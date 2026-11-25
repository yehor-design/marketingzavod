/**
 * Pure consent logic: the format of the mz_consent cookie and its rules.
 * No browser APIs here, so the inline GTM bootstrap, the server and the unit
 * tests all read the cookie the same way.
 *
 * Value: <version>.s<0|1>m<0|1>.<decided at, Unix seconds>.<consent ID>
 * Example: 1.s1m0.1763380000.0f8c2b1d9e7a4c6b8d0e1f2a3b4c5d6e
 */
export const CONSENT_COOKIE = "mz_consent";

/** Raise when a service, purpose or category is added: every visitor is asked again. */
export const CONSENT_VERSION = 1;

export const CONSENT_MAX_AGE_DAYS = 180;
export const CONSENT_MAX_AGE_SECONDS = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60;

/** Clock skew tolerated for a choice that seems to come from the future. */
const FUTURE_TOLERANCE_SECONDS = 5 * 60;

/** What the visitor chose. Necessary storage is always on and not part of the choice. */
export type ConsentChoice = {
  statistics: boolean;
  marketing: boolean;
};

export type StoredConsent = ConsentChoice & {
  version: number;
  /** Unix seconds. */
  decidedAt: number;
  /** Random, not linked to the person. Ties a log record to this browser's choice. */
  id: string;
};

export const CONSENT_PATTERN = /^(\d{1,4})\.s([01])m([01])\.(\d{1,12})\.([0-9a-f]{32})$/;

export function serializeConsent(consent: StoredConsent): string {
  const flags = `s${consent.statistics ? 1 : 0}m${consent.marketing ? 1 : 0}`;
  return `${consent.version}.${flags}.${Math.floor(consent.decidedAt)}.${consent.id}`;
}

/**
 * Returns the stored choice, or null when there is none to honour: missing,
 * malformed, another version, from the future, or older than 180 days.
 */
export function parseConsent(
  raw: string | null | undefined,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): StoredConsent | null {
  const match = CONSENT_PATTERN.exec(raw ?? "");
  if (!match) {
    return null;
  }
  const version = Number(match[1]);
  const decidedAt = Number(match[4]);
  if (version !== CONSENT_VERSION) {
    return null;
  }
  if (decidedAt > nowSeconds + FUTURE_TOLERANCE_SECONDS) {
    return null;
  }
  if (nowSeconds - decidedAt >= CONSENT_MAX_AGE_SECONDS) {
    return null;
  }
  return {
    version,
    statistics: match[2] === "1",
    marketing: match[3] === "1",
    decidedAt,
    id: match[5],
  };
}

/**
 * The same rules as parseConsent() and readConsentCookie(), as plain
 * JavaScript for the inline GTM bootstrap, which runs before any bundle.
 * A function of (cookies, nowSeconds) returning {s, m} or null.
 * tests/unit/consent.test.ts checks that both readers agree.
 */
export const CONSENT_READER_SOURCE =
  "function(c,n){" +
  `var v=(c.match(/(?:^|;\\s*)${CONSENT_COOKIE}=([^;]*)/)||[])[1];` +
  `var r=${CONSENT_PATTERN.toString()}.exec(v||"");` +
  `if(!r||+r[1]!==${CONSENT_VERSION})return null;` +
  "var t=+r[4];" +
  `if(t>n+${FUTURE_TOLERANCE_SECONDS}||n-t>=${CONSENT_MAX_AGE_SECONDS})return null;` +
  'return{s:r[2]==="1",m:r[3]==="1"}' +
  "}";

/** Finds mz_consent in a Cookie header or in document.cookie. */
export function readConsentCookie(
  cookies: string,
  nowSeconds?: number,
): StoredConsent | null {
  const prefix = `${CONSENT_COOKIE}=`;
  const row = cookies
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));
  return row ? parseConsent(row.slice(prefix.length), nowSeconds) : null;
}

/** Attributes of the cookie. Not HttpOnly: the inline GTM bootstrap reads it. */
export function consentCookieAttributes(secure: boolean): string {
  return `Path=/; Max-Age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax${secure ? "; Secure" : ""}`;
}

/** 32 lowercase hex characters. */
export function newConsentId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replace(/-/g, "");
  }
  let id = "";
  while (id.length < 32) {
    id += Math.floor(Math.random() * 16).toString(16);
  }
  return id;
}

/**
 * First-party cookie and storage names each category leaves behind, by
 * prefix. mz_attr is not here: lib/attribution rewrites or deletes it on
 * every consent change. Cookies on other domains (facebook.com,
 * linkedin.com) cannot be removed by the site.
 */
export const CATEGORY_STORAGE_PREFIXES: Record<keyof ConsentChoice, readonly string[]> = {
  // GA4 (_ga, _ga_<stream>, _gid) and Amplitude with its Session Replay
  // (AMP_<key>, AMP_MKTG_<key>, amp_*, amplitude.* in local storage).
  statistics: ["_ga", "_gid", "AMP_", "amp_", "amplitude."],
  // Google Ads, Meta (the pixel also keeps lastExternalReferrer* in localStorage), LinkedIn.
  marketing: ["_gcl_", "_fbp", "_fbc", "lastExternalReferrer", "li_fat_id", "li_gc"],
};

/**
 * IndexedDB databases each category leaves behind, by a part of their name.
 * Amplitude keeps SDK diagnostics in AMP_diagnostics_<first 10 characters of key>
 * and unsent Session Replay recordings in <first 10 characters>_amp_session_replay_events.
 */
export const CATEGORY_INDEXED_DB: Record<keyof ConsentChoice, readonly string[]> = {
  statistics: ["_amp_session_replay_events", "AMP_diagnostics_"],
  marketing: [],
};

/** The IndexedDB name parts to clear when moving from one choice to the next. */
export function indexedDbToClear(previous: ConsentChoice, next: ConsentChoice): string[] {
  return (Object.keys(CATEGORY_INDEXED_DB) as Array<keyof ConsentChoice>)
    .filter((category) => previous[category] && !next[category])
    .flatMap((category) => CATEGORY_INDEXED_DB[category]);
}

/** The prefixes to clear when moving from one choice to the next. */
export function prefixesToClear(previous: ConsentChoice, next: ConsentChoice): string[] {
  return (Object.keys(CATEGORY_STORAGE_PREFIXES) as Array<keyof ConsentChoice>)
    .filter((category) => previous[category] && !next[category])
    .flatMap((category) => CATEGORY_STORAGE_PREFIXES[category]);
}

/** True when the new choice turns off a category the old one had on. */
export function narrowsConsent(previous: ConsentChoice, next: ConsentChoice): boolean {
  return (previous.statistics && !next.statistics) || (previous.marketing && !next.marketing);
}
