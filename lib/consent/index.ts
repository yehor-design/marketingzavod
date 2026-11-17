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
  prefixesToClear,
  readConsentCookie,
  serializeConsent,
  type ConsentChoice,
  type StoredConsent,
} from "@/lib/consent/core";
import { sendConsentRecord } from "@/lib/consent/log";
import { clearStoredByPrefix } from "@/lib/consent/storage";

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
 * choice in wb_consent for 180 days, then applies it.
 *
 * Every choice also goes to the consent log (lib/consent/log.ts).
 * A grant applies without a reload. A withdrawal also removes what the
 * withdrawn categories stored and reloads the page, because scripts that
 * already run cannot be unloaded.
 *
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
  sendConsentRecord({
    id: next.id,
    version: next.version,
    statistics: next.statistics,
    marketing: next.marketing,
    source,
    decided_at: next.decidedAt,
  });
  const narrowed = narrowsConsent(previous, next);
  if (narrowed && typeof window !== "undefined") {
    clearStoredByPrefix(prefixesToClear(previous, next));
    window.location.reload();
  }
  return { stored: next, narrowed, source };
}

/**
 * Removes what refused categories left on the device. saveConsent() does this
 * on withdrawal, but a script that is still running can write its cookie once
 * more before the page unloads, so it runs again on the next page load.
 */
export function clearRefusedStorage(): string[] {
  const state = getConsent();
  if (!state.answered) {
    return [];
  }
  return clearStoredByPrefix(prefixesToClear({ statistics: true, marketing: true }, state));
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

const settingsOpeners = new Set<() => void>();

/** The settings panel registers here while it is mounted. Returns the unregister function. */
export function onOpenConsentSettings(open: () => void): () => void {
  settingsOpeners.add(open);
  return () => {
    settingsOpeners.delete(open);
  };
}

/** Opens the consent settings panel. Returns false while there is no panel to open. */
export function openConsentSettings(): boolean {
  settingsOpeners.forEach((open) => open());
  return settingsOpeners.size > 0;
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
