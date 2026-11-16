/**
 * HubSpot adapter for LeadStore. One contact per email: a repeat submission
 * updates the contact instead of creating a second one. First-touch fields are
 * written when the contact is created and never overwritten.
 */
import type { Touch } from "@/lib/attribution/core";
import { CLICK_ID_FIELDS, UTM_FIELDS } from "@/lib/leads/hubspot-properties";
import type { Lead, LeadSaveResult, LeadStore } from "@/lib/leads/types";

const API = "https://api.hubapi.com";

/** Deal to contact, HubSpot-defined association. */
const DEAL_TO_CONTACT = 3;

export class HubspotError extends Error {
  constructor(
    readonly status: number,
    readonly body: string,
  ) {
    super(`HubSpot responded ${status}`);
  }
}

export async function hubspotFetch<T>(
  token: string,
  path: string,
  init: { method?: string; body?: unknown; timeoutMs?: number } = {},
): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    method: init.method ?? "GET",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    signal: AbortSignal.timeout(init.timeoutMs ?? 8000),
    cache: "no-store",
  });
  const textBody = await response.text();
  if (!response.ok) {
    throw new HubspotError(response.status, textBody.slice(0, 500));
  }
  return (textBody ? JSON.parse(textBody) : {}) as T;
}

function touchProperties(prefix: "wb_ft_" | "wb_lt_", touch: Touch | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!touch) {
    return out;
  }
  for (const key of [...UTM_FIELDS, "landing_page", "referrer", "timestamp"]) {
    const value = (touch as Record<string, string | undefined>)[key];
    if (value) {
      out[`${prefix}${key}`] = value;
    }
  }
  return out;
}

function splitName(name: string): { firstname?: string; lastname?: string } {
  const parts = name.trim().split(/\s+/);
  if (!parts[0]) {
    return {};
  }
  return parts.length === 1
    ? { firstname: parts[0] }
    : { firstname: parts[0], lastname: parts.slice(1).join(" ") };
}

/** Maps a lead to HubSpot contact properties. Pure, covered by unit tests. */
export function toContactProperties(lead: Lead, isNew: boolean): Record<string, string> {
  const properties: Record<string, string> = {
    email: lead.email,
    wb_lead_id: lead.lead_id,
    wb_event_id: lead.event_id,
    wb_form_name: lead.form_name,
    wb_page_url: lead.page_url,
    wb_lead_created_at: lead.created_at,
    wb_consent_marketing: String(lead.consent.marketing),
    wb_consent_statistics: String(lead.consent.statistics),
    ...touchProperties("wb_lt_", lead.attribution.last),
    ...(isNew ? touchProperties("wb_ft_", lead.attribution.first) : {}),
  };

  if (lead.fields.name) {
    Object.assign(properties, splitName(lead.fields.name));
  }

  // The newest click ID wins. Its touch time becomes the click time for offline conversions.
  for (const touch of [lead.attribution.first, lead.attribution.last]) {
    if (!touch) {
      continue;
    }
    for (const key of CLICK_ID_FIELDS) {
      const value = (touch as Record<string, string | undefined>)[key];
      if (value) {
        properties[`wb_${key}`] = value;
        if (touch.timestamp) {
          properties.wb_click_time = touch.timestamp;
        }
      }
    }
  }

  if (lead.fbp) {
    properties.wb_fbp = lead.fbp;
  }
  if (lead.fbc) {
    properties.wb_fbc = lead.fbc;
  }

  if (lead.form_name === "contact") {
    properties.wb_inquiry_type = lead.fields.reason ?? "";
    properties.wb_message = lead.fields.message ?? "";
  }
  if (lead.form_name === "careers_apply") {
    properties.website = lead.fields.website ?? "";
    properties.wb_application = [
      `Role: ${lead.fields.role ?? ""}`,
      `Why join: ${lead.fields.motivation ?? ""}`,
      `Experience: ${lead.fields.experience ?? ""}`,
      `Most proud of: ${lead.fields.proud_of ?? ""}`,
    ].join("\n\n");
  }
  return properties;
}

const DEAL_LABELS: Record<string, string> = {
  contact: "Contact form",
  waitlist: "Waitlist",
};

/** Job applications are not sales leads and get no deal. */
export function toDealProperties(
  lead: Lead,
  stage: string,
  pipeline: string,
): Record<string, string> | null {
  const label = DEAL_LABELS[lead.form_name];
  if (!label) {
    return null;
  }
  return {
    dealname: `${label}: ${lead.email}`,
    pipeline,
    dealstage: stage,
    wb_lead_id: lead.lead_id,
    wb_form_name: lead.form_name,
  };
}

type SearchResult = { results: Array<{ id: string }> };

export class HubspotLeadStore implements LeadStore {
  readonly name = "hubspot";

  constructor(
    private readonly token: string,
    private readonly options: { stage?: string; pipeline?: string } = {},
  ) {}

  async save(lead: Lead): Promise<LeadSaveResult> {
    const found = await hubspotFetch<SearchResult>(this.token, "/crm/v3/objects/contacts/search", {
      method: "POST",
      body: {
        filterGroups: [
          { filters: [{ propertyName: "email", operator: "EQ", value: lead.email }] },
        ],
        properties: ["email"],
        limit: 1,
      },
    });

    let contactId = found.results[0]?.id;
    if (contactId) {
      await hubspotFetch(this.token, `/crm/v3/objects/contacts/${contactId}`, {
        method: "PATCH",
        body: { properties: toContactProperties(lead, false) },
      });
    } else {
      const created = await hubspotFetch<{ id: string }>(this.token, "/crm/v3/objects/contacts", {
        method: "POST",
        body: { properties: toContactProperties(lead, true) },
      });
      contactId = created.id;
    }

    const dealProperties = toDealProperties(
      lead,
      this.options.stage ?? "appointmentscheduled",
      this.options.pipeline ?? "default",
    );
    if (!dealProperties) {
      return { store: this.name, contact_id: contactId };
    }

    const deal = await hubspotFetch<{ id: string }>(this.token, "/crm/v3/objects/deals", {
      method: "POST",
      body: {
        properties: dealProperties,
        associations: [
          {
            to: { id: contactId },
            types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: DEAL_TO_CONTACT }],
          },
        ],
      },
    });
    return { store: this.name, contact_id: contactId, deal_id: deal.id };
  }
}
