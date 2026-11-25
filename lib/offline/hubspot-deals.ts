/**
 * Reads what offline conversions need from HubSpot: the deal, its lead ID and
 * the contact that carries click IDs, email and consent.
 */
import { hubspotFetch } from "@/lib/leads/hubspot";
import { CLICK_ID_FIELDS } from "@/lib/leads/hubspot-properties";
import { offlineConversions } from "@/lib/offline/config";

export type DealRecord = { id: string; properties: Record<string, string | null> };
export type ContactRecord = { id: string; properties: Record<string, string | null> };

const CONTACT_PROPERTIES = [
  "email",
  "phone",
  "mz_lead_id",
  "mz_consent_marketing",
  "mz_click_time",
  "mz_fbp",
  "mz_fbc",
  "mz_page_url",
  ...CLICK_ID_FIELDS.map((key) => `mz_${key}`),
];

export function dealProperties(): string[] {
  const stages = offlineConversions().map((conversion) => conversion.stage);
  return [
    "dealstage",
    "dealname",
    "mz_lead_id",
    "mz_offline_sent",
    "hs_lastmodifieddate",
    ...stages.flatMap((stage) => [`hs_v2_date_entered_${stage}`, `hs_date_entered_${stage}`]),
  ];
}

export async function getDeal(token: string, dealId: string): Promise<DealRecord> {
  const query = new URLSearchParams({ properties: dealProperties().join(",") });
  return hubspotFetch<DealRecord>(token, `/crm/v3/objects/deals/${encodeURIComponent(dealId)}?${query}`);
}

export async function getDealContact(token: string, dealId: string): Promise<ContactRecord | null> {
  const links = await hubspotFetch<{ results: Array<{ toObjectId: number | string }> }>(
    token,
    `/crm/v4/objects/deals/${encodeURIComponent(dealId)}/associations/contacts?limit=1`,
  );
  const contactId = links.results[0]?.toObjectId;
  if (!contactId) {
    return null;
  }
  const query = new URLSearchParams({ properties: CONTACT_PROPERTIES.join(",") });
  return hubspotFetch<ContactRecord>(token, `/crm/v3/objects/contacts/${contactId}?${query}`);
}

/** Deals that are in a conversion stage and were touched in the lookback window. */
export async function searchConvertedDeals(token: string, sinceMs: number): Promise<DealRecord[]> {
  const stages = offlineConversions().map((conversion) => conversion.stage);
  const deals: DealRecord[] = [];
  let after: string | undefined;
  for (let page = 0; page < 10; page += 1) {
    const result = await hubspotFetch<{ results: DealRecord[]; paging?: { next?: { after: string } } }>(
      token,
      "/crm/v3/objects/deals/search",
      {
        method: "POST",
        body: {
          filterGroups: [
            {
              filters: [
                { propertyName: "dealstage", operator: "IN", values: stages },
                { propertyName: "hs_lastmodifieddate", operator: "GTE", value: String(sinceMs) },
                { propertyName: "mz_lead_id", operator: "HAS_PROPERTY" },
              ],
            },
          ],
          properties: dealProperties(),
          limit: 100,
          ...(after ? { after } : {}),
        },
      },
    );
    deals.push(...result.results);
    after = result.paging?.next?.after;
    if (!after) {
      break;
    }
  }
  return deals;
}

/** When the deal entered a stage, in ISO 8601. Falls back to the last change. */
export function stageEnteredAt(deal: DealRecord, stage: string): string | null {
  const raw =
    deal.properties[`hs_v2_date_entered_${stage}`] ??
    deal.properties[`hs_date_entered_${stage}`] ??
    null;
  if (!raw) {
    return null;
  }
  const time = /^\d+$/.test(raw) ? Number(raw) : Date.parse(raw);
  return Number.isNaN(time) ? null : new Date(time).toISOString();
}

/** Conversions already reported for this deal, kept on the deal itself. */
export function sentKeys(deal: DealRecord): string[] {
  return (deal.properties.mz_offline_sent ?? "")
    .split(",")
    .map((key) => key.trim())
    .filter(Boolean);
}

export async function markSent(token: string, deal: DealRecord, key: string): Promise<void> {
  const keys = [...new Set([...sentKeys(deal), key])];
  await hubspotFetch(token, `/crm/v3/objects/deals/${deal.id}`, {
    method: "PATCH",
    body: { properties: { mz_offline_sent: keys.join(",") } },
  });
}
