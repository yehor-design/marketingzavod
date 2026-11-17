/**
 * The visitor's consent state. Everything outside GTM (PostHog, Amplitude,
 * the attribution cookie, server events) reads consent from here and nowhere
 * else.
 *
 * The choice lives in the first-party wb_consent cookie (see core.ts). Until
 * the visitor chooses, nothing is granted. The consent banner reports a choice
 * through saveConsent().
 */
import {
  CONSENT_COOKIE,
  CONSENT_VERSION,
  consentCookieAttributes,
  narrowsConsent,
  newConsentId,
  readConsentCookie,
  serializeConsent,
  type ConsentChoice,
  type StoredConsent,
} from "@/lib/consent/core";

export * from "@/lib/consent/core";

export type ConsentState = {
  necessary: true;
  /** No feature uses this category, so it is always false. */
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
  /** True once the visitor has made a choice that is still valid. */
  answered: boolean;
};

export type ConsentSource = "banner" | "settings";

export const DENIED: ConsentState = {
  necessary: true,
  preferences: false,
  statistics: false,
  marketing: false,
  answered: false,
};

/**
 * Set to true when the site's consent tool ships. Until then every GTM tag is
 * held back and the footer shows no "Cookie settings" control.
 */
export const CONSENT_TOOL_READY: boolean = false;

type Listener = (state: ConsentState, previous: ConsentState) => void;

let current: ConsentState | null = null;
let stored: StoredConsent | null = null;
const listeners = new Set<Listener>();

function stateOf(choice: StoredConsent | null): ConsentState {
  if (!choice) {
    return DENIED;
  }
  return {
    necessary: true,
    preferences: false,
    statistics: choice.statistics,
    marketing: choice.marketing,
    answered: true,
  };
}

/** Reads the cookie once per page load. */
function load(): ConsentState {
  if (current === null) {
    stored = typeof document === "undefined" ? null : readConsentCookie(document.cookie);
    current = stateOf(stored);
  }
  return current;
}

export function getConsent(): ConsentState {
  return typeof window === "undefined" ? DENIED : load();
}

/** The stored choice with its ID and date, or null when the visitor has not chosen. */
export function getStoredConsent(): StoredConsent | null {
  if (typeof window === "undefined") {
    return null;
  }
  load();
  return stored;
}

/** Updates the in-memory state and notifies listeners. Does not write the cookie. */
export function setConsent(next: Omit<ConsentState, "necessary">): void {
  const previous = getConsent();
  current = { necessary: true, ...next, preferences: false };
  listeners.forEach((listener) => listener(current as ConsentState, previous));
}

/**
 * The entry point for the consent banner and settings panel: stores the
 * choice in wb_consent for 180 days, then applies it without a reload.
 * The consent ID survives later changes, so each record of this browser's
 * choices carries the same ID.
 */
export function saveConsent(
  choice: ConsentChoice,
  source: ConsentSource,
): { stored: StoredConsent; narrowed: boolean; source: ConsentSource } {
  const previous = getConsent();
  const next: StoredConsent = {
    version: CONSENT_VERSION,
    statistics: choice.statistics,
    marketing: choice.marketing,
    decidedAt: Math.floor(Date.now() / 1000),
    id: getStoredConsent()?.id ?? newConsentId(),
  };
  if (typeof document !== "undefined") {
    const secure = window.location.protocol === "https:";
    document.cookie = `${CONSENT_COOKIE}=${serializeConsent(next)}; ${consentCookieAttributes(secure)}`;
  }
  stored = next;
  setConsent({ preferences: false, statistics: next.statistics, marketing: next.marketing, answered: true });
  return { stored: next, narrowed: narrowsConsent(previous, next), source };
}

/** Analytics outside GTM: PostHog, Amplitude, Speed Insights, the attribution cookie. */
export function hasAnalyticsConsent(): boolean {
  return getConsent().statistics;
}

/** Advertising data outside GTM: click IDs, Meta Conversions API. */
export function hasMarketingConsent(): boolean {
  return getConsent().marketing;
}

/** Calls the listener on every consent change. Returns the unsubscribe function. */
export function onConsentChange(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Reopens the consent dialog. Returns false while there is no dialog to open. */
export function openConsentSettings(): boolean {
  return false;
}

/** The compact form sent with a lead, so the server knows what it may do with it. */
export function consentSnapshot(): { statistics: boolean; marketing: boolean; preferences: boolean } {
  const { statistics, marketing, preferences } = getConsent();
  return { statistics, marketing, preferences };
}

/** Test hook: forgets the state read from the cookie. */
export function resetConsentMemory() {
  current = null;
  stored = null;
}
