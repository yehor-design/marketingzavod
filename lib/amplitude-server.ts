/**
 * Amplitude from route handlers, through the HTTP V2 API. Used for events the
 * browser cannot vouch for: a lead the server saved, a consent choice for the
 * consent log.
 *
 * The key is the same public project key the browser uses. Without it, or
 * outside the production deployment (unless NEXT_PUBLIC_TRACKING_DEBUG=true),
 * nothing is sent. A failed request is logged and never affects the response.
 */
import { AMPLITUDE_SERVER_ZONE } from "@/lib/tracking/env";

const ENDPOINTS = {
  US: "https://api2.amplitude.com/2/httpapi",
  EU: "https://api.eu.amplitude.com/2/httpapi",
} as const;

export type AmplitudeServerEvent = {
  event_type: string;
  /** The browser's Amplitude device ID, or a random ID that stands for one. At least 5 characters. */
  device_id: string;
  event_properties?: Record<string, string | number | boolean>;
  /** Amplitude drops a second event with the same insert_id within 7 days. */
  insert_id?: string;
  /** Unix milliseconds. Defaults to the time Amplitude receives the event. */
  time?: number;
};

export function amplitudeServerAllowed(): boolean {
  const key = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY?.trim();
  const allowed =
    process.env.VERCEL_ENV === "production" || process.env.NEXT_PUBLIC_TRACKING_DEBUG === "true";
  return Boolean(key) && allowed;
}

/** Sends the events in one request. Resolves to true when Amplitude accepted them. */
export async function sendAmplitudeServerEvents(
  events: AmplitudeServerEvent[],
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  const key = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY?.trim();
  if (!key || !amplitudeServerAllowed() || events.length === 0) {
    return false;
  }
  try {
    const response = await fetchImpl(ENDPOINTS[AMPLITUDE_SERVER_ZONE], {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "*/*" },
      body: JSON.stringify({ api_key: key, events }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      console.error(
        JSON.stringify({ type: "amplitude_server_error", status: response.status, events: events.length }),
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error(
      JSON.stringify({
        type: "amplitude_server_error",
        message: error instanceof Error ? error.message : "unknown",
      }),
    );
    return false;
  }
}
