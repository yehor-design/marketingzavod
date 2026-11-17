/**
 * Starting GTM and telling it about consent in the browser.
 *
 * GTM runs only with consent to statistics or marketing. When a choice is
 * already stored, the inline bootstrap in components/tracking/gtm.tsx starts
 * GTM on page load. This module covers a choice made on the page itself.
 */
import type { ConsentState } from "@/lib/consent";
import { TAG_MANAGER, TRACKING_ENABLED, trackingIds } from "@/lib/tracking/env";

export const GTM_ID_PATTERN = /^GTM-[A-Z0-9]+$/;

type ConsentSignal = "granted" | "denied";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    /** Set once gtm.js has been requested, by the bootstrap or by startGtm(). */
    __wbGtmStarted?: boolean;
  }
}

export function gtmActive(): boolean {
  return TRACKING_ENABLED && TAG_MANAGER === "gtm" && GTM_ID_PATTERN.test(trackingIds.gtm);
}

export function gtmScriptUrl(id: string = trackingIds.gtm): string {
  return `https://www.googletagmanager.com/gtm.js?id=${id}`;
}

/** Consent Mode v2 signals for a choice. Preferences is never granted. */
export function consentModeState(statistics: boolean, marketing: boolean): Record<string, ConsentSignal> {
  const ad: ConsentSignal = marketing ? "granted" : "denied";
  return {
    ad_storage: ad,
    ad_user_data: ad,
    ad_personalization: ad,
    analytics_storage: statistics ? "granted" : "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted",
  };
}

/** gtag() commands must reach GTM as an arguments object, not an array. */
function gtagCommand(...args: unknown[]): IArguments {
  void args;
  // eslint-disable-next-line prefer-rest-params
  return arguments;
}

function layer(): unknown[] {
  window.dataLayer = window.dataLayer ?? [];
  return window.dataLayer;
}

/** Requests gtm.js once. */
export function startGtm() {
  if (!gtmActive() || typeof document === "undefined" || window.__wbGtmStarted) {
    return;
  }
  window.__wbGtmStarted = true;
  layer().push({ "gtm.start": Date.now(), event: "gtm.js" });
  const script = document.createElement("script");
  script.async = true;
  script.src = gtmScriptUrl();
  document.head.appendChild(script);
}

/**
 * Applies a choice made on the page. If GTM already runs, it gets a consent
 * update. If it does not and the choice allows it, GTM starts now, with the
 * consent default placed right after the config entry: every event already
 * queued on this page is then read under the state the visitor chose.
 */
export function applyGtmConsent(state: ConsentState) {
  if (!gtmActive() || typeof window === "undefined" || !state.answered) {
    return;
  }
  const flags = { consent_statistics: state.statistics, consent_marketing: state.marketing };
  const signals = consentModeState(state.statistics, state.marketing);
  const queue = layer();

  if (window.__wbGtmStarted) {
    queue.push(gtagCommand("consent", "update", signals));
    queue.push({ event: "consent_update", ...flags });
    return;
  }
  if (!state.statistics && !state.marketing) {
    return;
  }
  const config = queue.findIndex(
    (entry) => typeof entry === "object" && entry !== null && "consent_ready" in entry,
  );
  queue.splice(config + 1, 0, gtagCommand("consent", "default", signals), flags);
  queue.push({ event: "consent_update", ...flags });
  startGtm();
}
