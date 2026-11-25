/**
 * Custom HubSpot properties used by the lead adapter. This file has no imports
 * on purpose: scripts/hubspot-setup.mjs loads it directly with Node.
 */
export const HUBSPOT_GROUP = { name: "mz_lead_attribution", label: "Lead attribution (website)" };

export const UTM_FIELDS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
export const CLICK_ID_FIELDS = [
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
  "li_fat_id",
  "ttclid",
];
const TOUCH_EXTRAS = ["landing_page", "referrer", "timestamp"];

type PropertyDef = {
  name: string;
  label: string;
  type: "string";
  fieldType: "text" | "textarea";
};

const text = (name: string, label: string): PropertyDef => ({
  name,
  label,
  type: "string",
  fieldType: "text",
});
const area = (name: string, label: string): PropertyDef => ({
  name,
  label,
  type: "string",
  fieldType: "textarea",
});

export const CONTACT_PROPERTIES: PropertyDef[] = [
  text("mz_lead_id", "Lead ID (latest)"),
  text("mz_event_id", "Event ID (latest)"),
  text("mz_form_name", "Form (latest)"),
  text("mz_page_url", "Form page URL"),
  text("mz_lead_created_at", "Lead submitted at"),
  text("mz_consent_marketing", "Consent: marketing"),
  text("mz_consent_statistics", "Consent: statistics"),
  text("mz_inquiry_type", "Inquiry type"),
  area("mz_message", "Website message"),
  area("mz_application", "Job application"),
  ...[...UTM_FIELDS, ...TOUCH_EXTRAS].map((key) => text(`mz_ft_${key}`, `First touch: ${key}`)),
  ...[...UTM_FIELDS, ...TOUCH_EXTRAS].map((key) => text(`mz_lt_${key}`, `Last touch: ${key}`)),
  ...CLICK_ID_FIELDS.map((key) => text(`mz_${key}`, `Click ID: ${key}`)),
  text("mz_click_time", "Click time"),
  text("mz_fbp", "Meta browser ID (_fbp)"),
  text("mz_fbc", "Meta click ID (_fbc)"),
];

export const DEAL_PROPERTIES: PropertyDef[] = [
  text("mz_lead_id", "Lead ID"),
  text("mz_form_name", "Form"),
  text("mz_offline_sent", "Offline conversions sent"),
];
