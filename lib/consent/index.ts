/**
 * The visitor's consent state. Everything outside GTM (PostHog, the attribution
 * cookie, server events) reads consent from here and nowhere else.
 *
 * The site has no consent tool yet, so nothing is ever granted. The site's own
 * tool reports the visitor's choice through setConsent().
 */
export type ConsentState = {
  necessary: true;
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
  /** True once the visitor has made a choice. */
  answered: boolean;
};

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

let current: ConsentState = DENIED;
const listeners = new Set<(state: ConsentState) => void>();

export function getConsent(): ConsentState {
  return typeof window === "undefined" ? DENIED : current;
}

/** The entry point for the consent tool: stores the choice and notifies listeners. */
export function setConsent(next: Omit<ConsentState, "necessary">): void {
  current = { necessary: true, ...next };
  listeners.forEach((listener) => listener(current));
}

/** Analytics outside GTM: PostHog persistence and recordings, the attribution cookie. */
export function hasAnalyticsConsent(): boolean {
  return getConsent().statistics;
}

/** Advertising data outside GTM: click IDs, Meta Conversions API. */
export function hasMarketingConsent(): boolean {
  return getConsent().marketing;
}

/** Calls the listener on every consent change. Returns the unsubscribe function. */
export function onConsentChange(listener: (state: ConsentState) => void): () => void {
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
