import { HubspotLeadStore } from "@/lib/leads/hubspot";
import type { Lead, LeadSaveResult, LeadStore } from "@/lib/leads/types";

/**
 * Fallback store. Writes the whole lead to the server log as one JSON line, so
 * a submission is never lost while no CRM is connected or the CRM is down.
 */
export class LogLeadStore implements LeadStore {
  readonly name = "log";

  async save(lead: Lead): Promise<LeadSaveResult> {
    console.log(JSON.stringify({ type: "lead", store: this.name, lead }));
    return { store: this.name };
  }
}

export function getLeadStore(): LeadStore {
  const token = process.env.HUBSPOT_ACCESS_TOKEN?.trim();
  if (!token) {
    return new LogLeadStore();
  }
  return new HubspotLeadStore(token, {
    stage: process.env.HUBSPOT_DEAL_STAGE_NEW?.trim() || undefined,
    pipeline: process.env.HUBSPOT_PIPELINE?.trim() || undefined,
  });
}

/**
 * Saves a lead and never throws. When the CRM fails, the error is logged and
 * the lead goes to the log store instead.
 */
export async function saveLead(lead: Lead, store: LeadStore = getLeadStore()): Promise<LeadSaveResult> {
  try {
    const result = await store.save(lead);
    if (store.name !== "log") {
      console.log(JSON.stringify({ type: "lead_saved", lead_id: lead.lead_id, ...result }));
    }
    return result;
  } catch (error) {
    const detail =
      error && typeof error === "object" && "body" in error
        ? { status: (error as { status?: number }).status, body: (error as { body?: string }).body }
        : { message: error instanceof Error ? error.message : String(error) };
    console.error(
      JSON.stringify({ type: "lead_store_error", store: store.name, lead_id: lead.lead_id, ...detail }),
    );
    return new LogLeadStore().save(lead);
  }
}
