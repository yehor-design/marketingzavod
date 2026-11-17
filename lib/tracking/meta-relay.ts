/**
 * Meta without a pixel, used when Zaraz is the tag manager. The browser
 * posts Meta's standard events to the site's own /api/meta/event, and the
 * server sends them to the Conversions API. Nothing loads from facebook.com,
 * and the Meta token stays in Vercel.
 *
 * It runs only with marketing consent. A page_view from before the choice is
 * sent once the visitor allows marketing on that page, as the GTM pixel did.
 */
import { getConsent, type ConsentState } from "@/lib/consent";
import { isMetaBrowserEvent, type MetaBrowserEvent } from "@/lib/meta/browser-events";
import { TAG_MANAGER, TRACKING_ENABLED, trackingIds } from "@/lib/tracking/env";

export const META_RELAY_PATH = "/api/meta/event";

type PendingView = { eventId: string; pageUrl: string };

let lastView: PendingView | null = null;
let lastViewSent = false;

export function metaRelayActive(): boolean {
  return TRACKING_ENABLED && TAG_MANAGER === "zaraz" && trackingIds.metaPixel !== "";
}

function post(event: MetaBrowserEvent, eventId: string, pageUrl: string, extra: Record<string, unknown> = {}) {
  try {
    void fetch(META_RELAY_PATH, {
      method: "POST",
      keepalive: true,
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, event_id: eventId, page_url: pageUrl, ...extra }),
    }).catch(() => undefined);
  } catch {
    // A failed relay never breaks the page.
  }
}

/** Called by track() for every event. Sends the ones Meta has a standard event for. */
export function relayMetaEvent(event: string, params: Record<string, unknown>, eventId: string) {
  if (!metaRelayActive() || typeof window === "undefined" || !isMetaBrowserEvent(event)) {
    return;
  }
  const pageUrl =
    event === "page_view" && typeof params.page_location === "string"
      ? params.page_location
      : window.location.href;

  if (event === "page_view") {
    lastView = { eventId, pageUrl };
    lastViewSent = false;
  }
  if (!getConsent().marketing) {
    return;
  }
  if (event === "page_view") {
    lastViewSent = true;
  }
  const extra: Record<string, unknown> = {};
  if (typeof params.value === "number") {
    extra.value = params.value;
  }
  if (typeof params.currency === "string") {
    extra.currency = params.currency;
  }
  post(event, eventId, pageUrl, extra);
}

/** A choice made on the page: sends this page's view if marketing was just allowed. */
export function applyMetaRelayConsent(state: ConsentState) {
  if (!metaRelayActive() || !state.answered || !state.marketing || !lastView || lastViewSent) {
    return;
  }
  lastViewSent = true;
  post("page_view", lastView.eventId, lastView.pageUrl);
}

/** For tests: forgets the remembered page view. */
export function resetMetaRelayMemory() {
  lastView = null;
  lastViewSent = false;
}
