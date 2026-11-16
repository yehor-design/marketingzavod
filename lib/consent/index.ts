/**
 * Thin wrapper over the Cookiebot JavaScript API. Cookiebot itself is loaded by
 * its tag in Google Tag Manager. This module only reads its state.
 *
 * Everything outside GTM (PostHog, the attribution cookie, server events) reads
 * consent from here and nowhere else. No Cookiebot on the page means no consent.
 */
export type ConsentState = {
  necessary: true;
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
  /** True once the visitor has answered the banner. */
  answered: boolean;
};

type CookiebotApi = {
  consent?: {
    necessary?: boolean;
    preferences?: boolean;
    statistics?: boolean;
    marketing?: boolean;
  };
  hasResponse?: boolean;
  renew?: () => void;
  show?: () => void;
};

declare global {
  interface Window {
    Cookiebot?: CookiebotApi;
  }
}

export const DENIED: ConsentState = {
  necessary: true,
  preferences: false,
  statistics: false,
  marketing: false,
  answered: false,
};

/** Fired on window by Cookiebot. https://www.cookiebot.com/en/developer/ */
const COOKIEBOT_EVENTS = [
  "CookiebotOnConsentReady",
  "CookiebotOnAccept",
  "CookiebotOnDecline",
] as const;

export function getConsent(): ConsentState {
  if (typeof window === "undefined") {
    return DENIED;
  }
  const consent = window.Cookiebot?.consent;
  if (!consent) {
    return DENIED;
  }
  return {
    necessary: true,
    preferences: consent.preferences === true,
    statistics: consent.statistics === true,
    marketing: consent.marketing === true,
    answered: window.Cookiebot?.hasResponse === true,
  };
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
  if (typeof window === "undefined") {
    return () => {};
  }
  const handler = () => listener(getConsent());
  COOKIEBOT_EVENTS.forEach((name) => window.addEventListener(name, handler));
  return () => COOKIEBOT_EVENTS.forEach((name) => window.removeEventListener(name, handler));
}

/** Reopens the Cookiebot dialog. Returns false when Cookiebot is not on the page. */
export function openConsentSettings(): boolean {
  if (typeof window === "undefined" || typeof window.Cookiebot?.renew !== "function") {
    return false;
  }
  window.Cookiebot.renew();
  return true;
}

/** The compact form sent with a lead, so the server knows what it may do with it. */
export function consentSnapshot(): { statistics: boolean; marketing: boolean; preferences: boolean } {
  const { statistics, marketing, preferences } = getConsent();
  return { statistics, marketing, preferences };
}
