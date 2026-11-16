import type { Attribution } from "@/lib/attribution/core";
import type { FormName } from "@/lib/tracking/events";

export type LeadConsent = { statistics: boolean; marketing: boolean; preferences: boolean };

export type LeadFields = Record<string, string>;

/** One submitted form, as stored. */
export type Lead = {
  lead_id: string;
  event_id: string;
  form_name: FormName;
  email: string;
  fields: LeadFields;
  attribution: Attribution;
  consent: LeadConsent;
  page_url: string;
  user_agent: string;
  created_at: string;
  /** Meta browser and click cookies. Present only with marketing consent. */
  fbp?: string;
  fbc?: string;
};

export type LeadSaveResult = { store: string; contact_id?: string; deal_id?: string };

/** Anything that can keep a lead: a CRM, a database, the log. */
export interface LeadStore {
  readonly name: string;
  save(lead: Lead): Promise<LeadSaveResult>;
}
