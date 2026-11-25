/**
 * Meta Conversions API. The server event carries the same event_id as the
 * browser pixel event, so Meta counts the pair once.
 *
 * Nothing here logs personal data: identifiers are hashed before they leave
 * this module and errors log only the response body.
 */
import { createHash } from "node:crypto";

/** Latest Graph API version, checked against graph.facebook.com on 2026-11-16. */
export const META_GRAPH_VERSION = "v27.0";

/** Meta events /api/lead sends for each form, deduplicated with the pixel tags in gtm/container.json. */
export const META_SERVER_LEAD_EVENTS = { contact: "Lead", waitlist: "CompleteRegistration" } as const;

export type MetaActionSource = "website" | "system_generated";

export type MetaEventInput = {
  eventName: string;
  eventId: string;
  eventTime: Date;
  actionSource: MetaActionSource;
  eventSourceUrl?: string;
  email?: string;
  phone?: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  leadId?: string;
  customData?: Record<string, string | number>;
};

export function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

/** Meta asks for a trimmed, lowercased address before hashing. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Digits only, country code included, no plus sign and no leading zeros. */
export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "").replace(/^0+/, "");
}

export function hashEmail(email: string | undefined): string | undefined {
  const value = email ? normalizeEmail(email) : "";
  return value ? sha256(value) : undefined;
}

export function hashPhone(phone: string | undefined): string | undefined {
  const value = phone ? normalizePhone(phone) : "";
  return value ? sha256(value) : undefined;
}

/** Builds the _fbc value from a click ID when the cookie itself is missing. */
export function fbcFromClickId(fbclid: string | undefined, clickTime?: string): string | undefined {
  if (!fbclid) {
    return undefined;
  }
  const parsed = clickTime ? Date.parse(clickTime) : NaN;
  const time = Number.isNaN(parsed) ? Date.now() : parsed;
  return `fb.1.${time}.${fbclid}`;
}

function compact<T extends Record<string, unknown>>(input: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined && value !== ""),
  ) as Partial<T>;
}

/** The request body for POST /{dataset_id}/events. Pure, covered by unit tests. */
export function buildMetaPayload(
  input: MetaEventInput,
  testEventCode?: string,
): Record<string, unknown> {
  const email = hashEmail(input.email);
  const phone = hashPhone(input.phone);
  const userData = compact({
    em: email ? [email] : undefined,
    ph: phone ? [phone] : undefined,
    client_ip_address: input.clientIp,
    client_user_agent: input.userAgent,
    fbp: input.fbp,
    fbc: input.fbc,
    external_id: input.leadId ? [sha256(input.leadId)] : undefined,
  });

  const event = compact({
    event_name: input.eventName,
    event_time: Math.floor(input.eventTime.getTime() / 1000),
    event_id: input.eventId,
    event_source_url: input.eventSourceUrl,
    action_source: input.actionSource,
    user_data: userData,
    custom_data:
      input.customData && Object.keys(input.customData).length > 0 ? input.customData : undefined,
  });

  return compact({ data: [event], test_event_code: testEventCode || undefined });
}

export type MetaSendResult =
  | { sent: true }
  | { sent: false; reason: "not_configured" | "error"; status?: number };

/**
 * Sends one event. Without a token or dataset ID it is a silent no-op. It never
 * throws: a Meta outage must not break a form.
 */
export async function sendMetaEvent(input: MetaEventInput, timeoutMs = 4000): Promise<MetaSendResult> {
  const token = process.env.META_CAPI_ACCESS_TOKEN?.trim();
  const datasetId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  if (!token || !datasetId) {
    return { sent: false, reason: "not_configured" };
  }
  const body = buildMetaPayload(input, process.env.META_TEST_EVENT_CODE?.trim());
  try {
    const response = await fetch(
      `https://graph.facebook.com/${META_GRAPH_VERSION}/${encodeURIComponent(datasetId)}/events`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(timeoutMs),
        cache: "no-store",
      },
    );
    if (!response.ok) {
      const text = (await response.text()).slice(0, 800);
      console.error(
        JSON.stringify({
          type: "meta_capi_error",
          status: response.status,
          event_name: input.eventName,
          event_id: input.eventId,
          body: text,
        }),
      );
      return { sent: false, reason: "error", status: response.status };
    }
    return { sent: true };
  } catch (error) {
    console.error(
      JSON.stringify({
        type: "meta_capi_error",
        event_name: input.eventName,
        event_id: input.eventId,
        message: error instanceof Error ? error.message : String(error),
      }),
    );
    return { sent: false, reason: "error" };
  }
}
