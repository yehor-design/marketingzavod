/**
 * Pure attribution logic: parse a landing URL, normalize, and merge touches.
 * No browser APIs here, so the server and the unit tests can share it.
 */
export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export const CLICK_ID_KEYS = [
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
  "li_fat_id",
  "ttclid",
] as const;

export type UtmKey = (typeof UTM_KEYS)[number];
export type ClickIdKey = (typeof CLICK_ID_KEYS)[number];

export type Touch = Partial<Record<UtmKey | ClickIdKey, string>> & {
  landing_page?: string;
  referrer?: string;
  /** ISO 8601, when the touch was recorded. */
  timestamp?: string;
};

export type Attribution = {
  first: Touch | null;
  last: Touch | null;
};

export const EMPTY_ATTRIBUTION: Attribution = { first: null, last: null };

export const ATTRIBUTION_COOKIE = "mz_attr";
export const ATTRIBUTION_MAX_AGE_DAYS = 90;

const UTM_MAX = 150;
const CLICK_ID_MAX = 255;
const URL_MAX = 500;

/** UTM values are lowercased so "Google" and "google" land in one row. */
export function normalizeUtm(value: string | null | undefined): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const out = value.trim().toLowerCase().replace(/\s+/g, "_").slice(0, UTM_MAX);
  return out || undefined;
}

/** Click IDs are case-sensitive tokens. Only trim and cap them. */
export function normalizeClickId(value: string | null | undefined): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const out = value.trim().slice(0, CLICK_ID_MAX);
  return out && !/\s/.test(out) ? out : undefined;
}

function cap(value: string | null | undefined): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const out = value.trim().slice(0, URL_MAX);
  return out || undefined;
}

/** Strips the query string and hash, which can carry personal data. */
function pathOnly(url: URL): string {
  return `${url.origin}${url.pathname}`.slice(0, URL_MAX);
}

/**
 * Reads campaign parameters from a landing URL. Returns null when the URL
 * carries neither a UTM parameter nor a click ID.
 */
export function parseTouch(href: string, referrer?: string, now: Date = new Date()): Touch | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  const touch: Touch = {};
  for (const key of UTM_KEYS) {
    const value = normalizeUtm(url.searchParams.get(key));
    if (value) {
      touch[key] = value;
    }
  }
  for (const key of CLICK_ID_KEYS) {
    const value = normalizeClickId(url.searchParams.get(key));
    if (value) {
      touch[key] = value;
    }
  }
  if (Object.keys(touch).length === 0) {
    return null;
  }
  touch.landing_page = pathOnly(url);
  const ref = cap(referrer);
  if (ref) {
    try {
      const refUrl = new URL(ref);
      if (refUrl.origin !== url.origin) {
        touch.referrer = pathOnly(refUrl);
      }
    } catch {
      // An unparsable referrer is dropped.
    }
  }
  touch.timestamp = now.toISOString();
  return touch;
}

/**
 * A visit without campaign parameters still counts as a first touch, so direct
 * and organic traffic can be told apart from "unknown".
 */
export function organicTouch(href: string, referrer?: string, now: Date = new Date()): Touch | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  const touch: Touch = { landing_page: pathOnly(url), timestamp: now.toISOString() };
  const ref = cap(referrer);
  if (ref) {
    try {
      const refUrl = new URL(ref);
      if (refUrl.origin !== url.origin) {
        touch.referrer = pathOnly(refUrl);
      }
    } catch {
      // Dropped.
    }
  }
  return touch;
}

/** First touch is written once. Last touch moves only when a new campaign touch arrives. */
export function mergeTouch(
  current: Attribution,
  campaignTouch: Touch | null,
  fallbackTouch: Touch | null = null,
): Attribution {
  const first = current.first ?? campaignTouch ?? fallbackTouch;
  const last = campaignTouch ?? current.last ?? first;
  return { first, last };
}

function pick<K extends string>(touch: Touch | null, keys: readonly K[]): Touch | null {
  if (!touch) {
    return null;
  }
  const out: Record<string, string> = {};
  for (const key of keys) {
    const value = (touch as Record<string, string | undefined>)[key];
    if (value) {
      out[key] = value;
    }
  }
  return out as Touch;
}

const NON_AD_KEYS = [...UTM_KEYS, "landing_page", "referrer", "timestamp"] as const;

/** Removes click IDs. Used when the visitor has not agreed to marketing. */
export function withoutClickIds(attribution: Attribution): Attribution {
  return { first: pick(attribution.first, NON_AD_KEYS), last: pick(attribution.last, NON_AD_KEYS) };
}

/** Keeps UTM values only. Used when the visitor has given no consent at all. */
export function utmOnly(attribution: Attribution): Attribution {
  return { first: pick(attribution.first, UTM_KEYS), last: pick(attribution.last, UTM_KEYS) };
}

/**
 * What may leave the browser with a form, by consent:
 * - marketing: everything, click IDs included;
 * - statistics only: UTM, landing page, referrer and time, without click IDs;
 * - neither: UTM values only.
 */
export function attributionForConsent(
  attribution: Attribution,
  consent: { statistics: boolean; marketing: boolean },
): Attribution {
  if (consent.marketing) {
    return attribution;
  }
  if (consent.statistics) {
    return withoutClickIds(attribution);
  }
  return utmOnly(attribution);
}

function cleanTouch(input: unknown): Touch | null {
  if (!input || typeof input !== "object") {
    return null;
  }
  const source = input as Record<string, unknown>;
  const touch: Touch = {};
  for (const key of UTM_KEYS) {
    const value = normalizeUtm(source[key] as string);
    if (value) {
      touch[key] = value;
    }
  }
  for (const key of CLICK_ID_KEYS) {
    const value = normalizeClickId(source[key] as string);
    if (value) {
      touch[key] = value;
    }
  }
  const landing = cap(source.landing_page as string);
  if (landing) {
    touch.landing_page = landing;
  }
  const referrer = cap(source.referrer as string);
  if (referrer) {
    touch.referrer = referrer;
  }
  const timestamp = source.timestamp;
  if (typeof timestamp === "string" && !Number.isNaN(Date.parse(timestamp))) {
    touch.timestamp = new Date(timestamp).toISOString();
  }
  return Object.keys(touch).length > 0 ? touch : null;
}

export function serializeAttribution(attribution: Attribution): string {
  return encodeURIComponent(JSON.stringify(attribution));
}

/** Tolerates a missing, truncated or hand-edited cookie. */
export function deserializeAttribution(raw: string | null | undefined): Attribution {
  if (!raw) {
    return EMPTY_ATTRIBUTION;
  }
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as { first?: unknown; last?: unknown };
    return { first: cleanTouch(parsed.first), last: cleanTouch(parsed.last) };
  } catch {
    return EMPTY_ATTRIBUTION;
  }
}

/** Re-validates attribution that arrived from a client. */
export function sanitizeAttribution(input: unknown): Attribution {
  if (!input || typeof input !== "object") {
    return EMPTY_ATTRIBUTION;
  }
  const source = input as { first?: unknown; last?: unknown };
  return { first: cleanTouch(source.first), last: cleanTouch(source.last) };
}
