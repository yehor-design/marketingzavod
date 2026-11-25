/**
 * Browser side of a form submission. Every form goes through submitLead():
 * it adds attribution and consent, posts to /api/lead, then reports the
 * conversion through track().
 */
import { getAttributionForSubmit, getAttribution } from "@/lib/attribution";
import { consentSnapshot } from "@/lib/consent";
import { track, type FormName } from "@/lib/tracking";
import { amplitudeIdentifyLead, getAmplitudeDeviceId } from "@/lib/tracking/amplitude";

export type SubmitResult =
  | { ok: true; lead_id: string; event_id: string }
  | { ok: false; error: "validation"; errors: Record<string, string> }
  | { ok: false; error: "rate_limited" | "network" | "server" };

export async function submitLead(
  formName: FormName,
  fields: Record<string, string>,
  honeypot = "",
): Promise<SubmitResult> {
  let response: Response;
  try {
    response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        form_name: formName,
        fields,
        company_url: honeypot,
        attribution: getAttributionForSubmit(),
        consent: consentSnapshot(),
        page_url: `${window.location.origin}${window.location.pathname}`,
        amplitude_device_id: getAmplitudeDeviceId(),
      }),
    });
  } catch {
    return { ok: false, error: "network" };
  }

  if (response.status === 429) {
    return { ok: false, error: "rate_limited" };
  }
  let data: { ok?: boolean; lead_id?: string; event_id?: string; errors?: Record<string, string> };
  try {
    data = await response.json();
  } catch {
    return { ok: false, error: "server" };
  }
  if (response.status === 400 && data.errors) {
    Object.keys(data.errors).forEach((field) => track("form_error", { form_name: formName, field }));
    return { ok: false, error: "validation", errors: data.errors };
  }
  if (!response.ok || !data.ok || !data.lead_id || !data.event_id) {
    return { ok: false, error: "server" };
  }

  const leadId = data.lead_id;
  const eventId = data.event_id;

  if (formName === "careers_apply") {
    track("submit_application", { form_name: formName, lead_id: leadId, role: fields.role ?? "" }, { eventId });
  } else {
    // The address goes to the Google Ads tag for Enhanced Conversions and is
    // removed from the dataLayer right after. See track().
    track(
      "generate_lead",
      { form_name: formName, lead_id: leadId },
      { eventId, userData: { email: fields.email } },
    );
    if (formName === "waitlist") {
      track("join_waitlist", { form_name: "waitlist", lead_id: leadId }, { eventId });
    }
  }

  const first = getAttribution().first ?? {};
  const firstTouch: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const) {
    if (first[key]) {
      firstTouch[`first_${key}`] = first[key];
    }
  }
  if (first.landing_page) {
    firstTouch.first_landing_page = first.landing_page;
  }
  amplitudeIdentifyLead(leadId, firstTouch);

  return { ok: true, lead_id: leadId, event_id: eventId };
}

export const SUBMIT_ERROR_TEXT: Record<"rate_limited" | "network" | "server", string> = {
  rate_limited: "Too many attempts. Please try again in a minute.",
  network: "We couldn't reach the server. Check your connection and try again.",
  server: "Something went wrong on our side. Please try again.",
};
