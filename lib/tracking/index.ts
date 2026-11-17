/**
 * The only way events leave the site. track() writes to the GTM dataLayer and
 * mirrors the same event to PostHog. Besides track(), only the GTM bootstrap
 * and lib/tracking/gtm.ts (consent signals) write to the dataLayer.
 *
 * Parameters must never carry personal data: no email, name, phone or message.
 */
import { getConsent } from "@/lib/consent";
import type { EventMeta, TrackEventName, TrackEvents } from "@/lib/tracking/events";
import { TRACKING_ENABLED, trackingIds } from "@/lib/tracking/env";
import { posthogCapture } from "@/lib/tracking/posthog";

export * from "@/lib/tracking/events";

type DataLayerEntry = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerEntry[];
    google_tag_manager?: Record<string, unknown>;
  }
}

/** Contact details for Google Ads Enhanced Conversions. Handed to the tag, then removed. */
export type UserData = { email?: string; phone_number?: string };

export type TrackOptions = {
  /** Reuse an ID issued by the server so browser and server events deduplicate. */
  eventId?: string;
  userData?: UserData;
};

export function newEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function gtmLoaded(): boolean {
  return (
    TRACKING_ENABLED &&
    trackingIds.gtm !== "" &&
    typeof window.google_tag_manager?.[trackingIds.gtm] === "object"
  );
}

export function track<E extends TrackEventName>(
  event: E,
  params: TrackEvents[E],
  options: TrackOptions = {},
): string {
  const eventId = options.eventId ?? newEventId();
  if (typeof window === "undefined") {
    return eventId;
  }

  const meta: EventMeta = { event_id: eventId };
  const entry: DataLayerEntry = { event, ...params, ...meta };

  // Enhanced Conversions: the address is given to the container for this one
  // event and removed straight after. It needs a loaded container and consent
  // to send user data to Google. Otherwise it never reaches the dataLayer.
  const shareUserData =
    options.userData !== undefined && gtmLoaded() && getConsent().marketing === true;
  if (shareUserData) {
    entry.user_data = options.userData;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(entry);

  if (shareUserData) {
    delete entry.user_data;
    window.dataLayer.push({ user_data: undefined });
  }

  if (event === "page_view") {
    const view = params as TrackEvents["page_view"];
    posthogCapture("$pageview", {
      $current_url: view.page_location,
      $pathname: view.page_path,
      title: view.page_title,
    });
  } else {
    posthogCapture(event, { ...params, ...meta });
  }

  return eventId;
}
