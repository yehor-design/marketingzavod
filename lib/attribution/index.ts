/**
 * Browser side of attribution. Forms and trackers read first and last touch
 * from getAttribution() and from nowhere else.
 *
 * Storage follows consent: the 90-day first-party cookie exists only while the
 * visitor agrees to statistics or marketing. Without consent the values live in
 * memory until the tab is closed.
 */
import { getConsent, type ConsentState } from "@/lib/consent";
import {
  ATTRIBUTION_COOKIE,
  ATTRIBUTION_MAX_AGE_DAYS,
  EMPTY_ATTRIBUTION,
  attributionForConsent,
  deserializeAttribution,
  mergeTouch,
  organicTouch,
  parseTouch,
  serializeAttribution,
  withoutClickIds,
  type Attribution,
} from "@/lib/attribution/core";

export * from "@/lib/attribution/core";

let memory: Attribution = EMPTY_ATTRIBUTION;

function readCookie(): Attribution {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${ATTRIBUTION_COOKIE}=`));
  return deserializeAttribution(match?.slice(ATTRIBUTION_COOKIE.length + 1));
}

function writeCookie(attribution: Attribution) {
  const maxAge = ATTRIBUTION_MAX_AGE_DAYS * 24 * 60 * 60;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${ATTRIBUTION_COOKIE}=${serializeAttribution(attribution)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
}

function deleteCookie() {
  document.cookie = `${ATTRIBUTION_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
}

function hasCookie(): boolean {
  return document.cookie.split("; ").some((row) => row.startsWith(`${ATTRIBUTION_COOKIE}=`));
}

function persist(consent: ConsentState) {
  if (!consent.statistics && !consent.marketing) {
    if (hasCookie()) {
      deleteCookie();
    }
    return;
  }
  // Click IDs are advertising data. They reach the cookie only with marketing consent.
  writeCookie(consent.marketing ? memory : withoutClickIds(memory));
}

/** Records the landing touch. Call once per page load, before any navigation. */
export function captureAttribution(
  href: string = window.location.href,
  referrer: string = document.referrer,
): Attribution {
  const consent = getConsent();
  const stored = hasCookie() ? readCookie() : EMPTY_ATTRIBUTION;
  const current: Attribution = {
    first: stored.first ?? memory.first,
    last: memory.last ?? stored.last,
  };
  memory = mergeTouch(current, parseTouch(href, referrer), organicTouch(href, referrer));
  persist(consent);
  return memory;
}

/** Call when consent changes: writes the cookie on grant, deletes it on withdrawal. */
export function syncAttributionWithConsent(consent: ConsentState = getConsent()) {
  if (typeof document === "undefined") {
    return;
  }
  if (memory.first === null && hasCookie()) {
    memory = readCookie();
  }
  persist(consent);
}

/** Full first and last touch as known in this tab. */
export function getAttribution(): Attribution {
  if (typeof document === "undefined") {
    return EMPTY_ATTRIBUTION;
  }
  if (memory.first === null && hasCookie()) {
    memory = readCookie();
  }
  return memory;
}

/** The subset that may be sent with a form under the current consent. */
export function getAttributionForSubmit(): Attribution {
  return attributionForConsent(getAttribution(), getConsent());
}

/** Test hook. */
export function resetAttributionMemory() {
  memory = EMPTY_ATTRIBUTION;
}
