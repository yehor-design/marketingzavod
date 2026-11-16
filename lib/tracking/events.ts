/**
 * The single list of events. Names and parameters mirror docs/tracking-plan.md.
 * gtm/build-container.mjs reads the same list from gtm/events.json, and a unit
 * test keeps the two in sync.
 */
export type FormName = "contact" | "waitlist" | "careers_apply";

export type ContactMethod = "email" | "phone" | "whatsapp" | "telegram" | "messenger";

export type TrackEvents = {
  page_view: { page_location: string; page_path: string; page_title: string };
  generate_lead: { form_name: FormName; lead_id: string };
  join_waitlist: { form_name: "waitlist"; lead_id: string };
  submit_application: { form_name: "careers_apply"; lead_id: string; role: string };
  begin_checkout: { plan: string; value: number; currency: string };
  view_pricing: { billing_period: "monthly" | "yearly" };
  cta_click: { cta_text: string; cta_location: string; destination: string };
  contact_click: { method: ContactMethod };
  outbound_click: { link_domain: string; link_url: string };
  form_start: { form_name: FormName };
  form_error: { form_name: FormName; field: string };
  faq_open: { question: string };
};

export type TrackEventName = keyof TrackEvents;

/** Added to every event by track(). Never set these by hand. */
export type EventMeta = {
  /** Shared by the browser pixel and the server event so Meta and Google Ads can deduplicate. */
  event_id: string;
};

export const TRACK_EVENT_NAMES = [
  "page_view",
  "generate_lead",
  "join_waitlist",
  "submit_application",
  "begin_checkout",
  "view_pricing",
  "cta_click",
  "contact_click",
  "outbound_click",
  "form_start",
  "form_error",
  "faq_open",
] as const satisfies readonly TrackEventName[];

export function isTrackEventName(value: string): value is TrackEventName {
  return (TRACK_EVENT_NAMES as readonly string[]).includes(value);
}

/** Parameters that must stay numeric when read from data-track-* attributes. */
export const NUMERIC_PARAMS = new Set(["value"]);
