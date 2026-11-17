/**
 * Meta standard events for what happens in the browser, when Zaraz is the
 * tag manager. Instead of a pixel, the browser posts them to /api/meta/event,
 * and the server sends them to the Conversions API with the token kept in
 * Vercel. No Meta token is stored in Cloudflare.
 *
 * Lead and CompleteRegistration are missing on purpose: /api/lead already
 * sends them from the server with the lead's event_id.
 *
 * No server-only imports: the browser and the route handler share this file.
 */
export const META_BROWSER_EVENTS = {
  page_view: "PageView",
  view_pricing: "ViewContent",
  contact_click: "Contact",
  begin_checkout: "InitiateCheckout",
} as const;

export type MetaBrowserEvent = keyof typeof META_BROWSER_EVENTS;

export const META_BROWSER_EVENT_NAMES = Object.keys(META_BROWSER_EVENTS) as MetaBrowserEvent[];

/** Meta events /api/lead sends for each form. Kept in step with app/api/lead/route.ts. */
export const META_SERVER_LEAD_EVENTS = { contact: "Lead", waitlist: "CompleteRegistration" } as const;

export function isMetaBrowserEvent(value: string): value is MetaBrowserEvent {
  return Object.prototype.hasOwnProperty.call(META_BROWSER_EVENTS, value);
}

/** The custom_data each event carries, the same as the GTM pixel tags sent. */
export function metaCustomData(
  event: MetaBrowserEvent,
  params: { value?: number; currency?: string },
): Record<string, string | number> | undefined {
  if (event === "view_pricing") {
    return { content_name: "pricing" };
  }
  if (event === "begin_checkout") {
    return { value: Number(params.value) || 0, currency: params.currency || "USD" };
  }
  return undefined;
}
