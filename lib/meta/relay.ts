/**
 * The server side of the Meta relay (/api/meta/event): it checks a browser
 * event and turns it into a Conversions API event. Pure functions, covered by
 * tests/unit/meta-relay.test.ts.
 *
 * The browser ID (_fbp) and click ID (_fbc) cookies are the ones the Meta
 * pixel would have set, in its format, so Meta matches the visitor across
 * events the same way. They are marketing cookies: the consent cleanup
 * removes them on withdrawal.
 */
import { z } from "zod";
import { readConsentCookie } from "@/lib/consent/core";
import {
  META_BROWSER_EVENT_NAMES,
  META_BROWSER_EVENTS,
  metaCustomData,
  type MetaBrowserEvent,
} from "@/lib/meta/browser-events";
import type { MetaEventInput } from "@/lib/meta/capi";

/** How long the pixel keeps _fbp and _fbc: 90 days. */
export const FB_COOKIE_MAX_AGE_SECONDS = 90 * 24 * 60 * 60;

export const relayRequestSchema = z.object({
  event: z.enum(META_BROWSER_EVENT_NAMES as [MetaBrowserEvent, ...MetaBrowserEvent[]]),
  event_id: z.string().regex(/^[A-Za-z0-9-]{8,64}$/),
  page_url: z.string().url().max(2000),
  value: z.number().finite().nonnegative().max(1_000_000).optional(),
  currency: z.string().regex(/^[A-Z]{3}$/).optional(),
});

export type RelayRequest = z.infer<typeof relayRequestSchema>;

/** True when the wb_consent cookie in this Cookie header allows marketing. */
export function marketingAllowed(cookieHeader: string, nowSeconds?: number): boolean {
  return readConsentCookie(cookieHeader, nowSeconds)?.marketing === true;
}

const FB_COOKIE_PATTERN = /^fb\.\d\.\d{10,13}\.[A-Za-z0-9_-]{1,512}$/;

/** The existing _fbp, or a new one in the pixel's format. `created` says whether to set it. */
export function browserId(
  existing: string | undefined,
  now: number = Date.now(),
  random: () => number = Math.random,
): { value: string; created: boolean } {
  if (existing && FB_COOKIE_PATTERN.test(existing)) {
    return { value: existing, created: false };
  }
  const id = Math.floor(random() * 2_147_483_647);
  return { value: `fb.1.${now}.${id}`, created: true };
}

/**
 * _fbc from a fbclid in the page address, which wins as the newest click, or
 * the existing cookie. `created` says whether to set it.
 */
export function clickId(
  existing: string | undefined,
  pageUrl: string,
  now: number = Date.now(),
): { value: string | undefined; created: boolean } {
  let fbclid: string | null = null;
  try {
    fbclid = new URL(pageUrl).searchParams.get("fbclid");
  } catch {
    // An invalid address carries no click ID.
  }
  if (fbclid && /^[A-Za-z0-9_-]{1,500}$/.test(fbclid)) {
    if (existing?.endsWith(`.${fbclid}`)) {
      return { value: existing, created: false };
    }
    return { value: `fb.1.${now}.${fbclid}`, created: true };
  }
  if (existing && FB_COOKIE_PATTERN.test(existing)) {
    return { value: existing, created: false };
  }
  return { value: undefined, created: false };
}

/** The page address without its query string, which can carry identifiers. */
export function sourceUrl(pageUrl: string): string | undefined {
  try {
    const url = new URL(pageUrl);
    return `${url.origin}${url.pathname}`;
  } catch {
    return undefined;
  }
}

/** True when the page address belongs to the site that received the request. */
export function sameSitePage(pageUrl: string, host: string | null): boolean {
  try {
    return host !== null && new URL(pageUrl).host === host;
  } catch {
    return false;
  }
}

export function relayEvent(
  request: RelayRequest,
  context: { now: Date; clientIp?: string; userAgent?: string; fbp: string; fbc?: string },
): MetaEventInput {
  return {
    eventName: META_BROWSER_EVENTS[request.event],
    eventId: request.event_id,
    eventTime: context.now,
    actionSource: "website",
    eventSourceUrl: sourceUrl(request.page_url),
    clientIp: context.clientIp,
    userAgent: context.userAgent,
    fbp: context.fbp,
    fbc: context.fbc,
    customData: metaCustomData(request.event, request),
  };
}
