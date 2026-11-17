/**
 * Pure consent logic: the format of the wb_consent cookie and its rules.
 * No browser APIs here, so the inline GTM bootstrap, the server and the unit
 * tests all read the cookie the same way.
 *
 * Value: <version>.s<0|1>m<0|1>.<decided at, Unix seconds>.<consent ID>
 * Example: 1.s1m0.1763380000.0f8c2b1d9e7a4c6b8d0e1f2a3b4c5d6e
 */
export const CONSENT_COOKIE = "wb_consent";

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

/** Finds wb_consent in a Cookie header or in document.cookie. */
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

/** True when the new choice turns off a category the old one had on. */
export function narrowsConsent(previous: ConsentChoice, next: ConsentChoice): boolean {
  return (previous.statistics && !next.statistics) || (previous.marketing && !next.marketing);
}
