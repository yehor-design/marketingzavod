/**
 * Cloudflare Zaraz in the browser, the alternative to GTM behind
 * NEXT_PUBLIC_TAG_MANAGER=zaraz.
 *
 * The site itself is not proxied by Cloudflare. Zaraz is served from a proxied
 * subdomain (NEXT_PUBLIC_ZARAZ_HOST, z.heywowboy.com), and its servers forward
 * the events to GA4, Google Ads, Meta and LinkedIn. The tools and their
 * triggers live in zaraz/config.json.
 *
 * The consent rules are the same as for GTM: the Zaraz script is requested
 * only after consent to statistics or marketing. Until it has loaded, events
 * from the current page wait in a queue. When it loads, it first gets the
 * Consent Mode default and the consent purposes, then the queued events.
 * Withdrawal reloads the page, so Zaraz is not loaded again.
 */
import type { ConsentState } from "@/lib/consent";
import { TAG_MANAGER, TRACKING_ENABLED, trackingIds } from "@/lib/tracking/env";
import { consentModeState } from "@/lib/tracking/gtm";

/** The consent purposes configured in Zaraz, named like the consent categories. */
export type ZarazPurposes = { statistics: boolean; marketing: boolean };

type ZarazApi = {
  track: (event: string, properties?: Record<string, unknown>) => unknown;
  set: (key: string, value: unknown, options?: { scope?: "page" | "session" | "persist" }) => void;
  consent?: {
    APIReady?: boolean;
    /** Keyed by the purpose ID Zaraz assigned. Names may be plain or per language. */
    purposes?: Record<string, { name?: string | Record<string, string> }>;
    set: (purposes: Record<string, boolean>) => void;
  };
};

declare global {
  interface Window {
    zaraz?: ZarazApi;
    /** Set once the Zaraz script has been requested. */
    __wbZarazStarted?: boolean;
  }
}

const HOST_PATTERN = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/;

/** Enough for one page before the visitor chooses. Older events are dropped. */
const QUEUE_LIMIT = 100;

/** How long to wait for the Zaraz consent API before sending anyway. */
export const CONSENT_API_TIMEOUT_MS = 3000;

let queue: Array<[string, Record<string, unknown>]> = [];
/** True once Zaraz has the consent state and takes events directly. */
let ready = false;
/** The latest choice, applied when Zaraz becomes ready. */
let pending: ZarazPurposes | null = null;

export function zarazActive(): boolean {
  return TRACKING_ENABLED && TAG_MANAGER === "zaraz" && HOST_PATTERN.test(trackingIds.zarazHost);
}

export function zarazScriptUrl(host: string = trackingIds.zarazHost): string {
  return `https://${host}/cdn-cgi/zaraz/i.js`;
}

function call(task: (zaraz: ZarazApi) => unknown) {
  const zaraz = window.zaraz;
  if (!zaraz) {
    return;
  }
  try {
    const result = task(zaraz);
    // zaraz.track returns a promise. A failed send must not surface as an
    // unhandled rejection on the page.
    if (result instanceof Promise) {
      result.catch(() => undefined);
    }
  } catch {
    // A broken or blocked Zaraz never breaks the page.
  }
}

/** Sends an event, or queues it until Zaraz is ready. */
export function zarazTrack(event: string, properties: Record<string, unknown>) {
  if (!zarazActive() || typeof window === "undefined") {
    return;
  }
  if (ready) {
    call((zaraz) => zaraz.track(event, properties));
    return;
  }
  queue.push([event, properties]);
  if (queue.length > QUEUE_LIMIT) {
    queue.shift();
  }
}

/**
 * Zaraz gives each purpose a random ID. The purposes are named Statistics and
 * Marketing like the consent categories, so they are matched by name.
 */
export function purposeIds(zaraz: ZarazApi): Record<keyof ZarazPurposes, string> {
  const ids: Record<keyof ZarazPurposes, string> = { statistics: "statistics", marketing: "marketing" };
  for (const [id, purpose] of Object.entries(zaraz.consent?.purposes ?? {})) {
    const raw = purpose?.name;
    const name = (typeof raw === "string" ? raw : (raw?.en ?? Object.values(raw ?? {})[0] ?? ""))
      .trim()
      .toLowerCase();
    if (name === "statistics" || name === "marketing") {
      ids[name] = id;
    }
  }
  return ids;
}

function sendConsent(choice: ZarazPurposes, key: "google_consent_default" | "google_consent_update") {
  call((zaraz) => zaraz.set(key, consentModeState(choice.statistics, choice.marketing)));
  // One call per purpose: Zaraz rejects the whole call when it does not know
  // one of the IDs, which is the case for a purpose no tool uses yet
  // (Marketing, until Google Ads or LinkedIn are added).
  const ids = (zaraz: ZarazApi) => purposeIds(zaraz);
  call((zaraz) => zaraz.consent?.set({ [ids(zaraz).statistics]: choice.statistics }));
  call((zaraz) => zaraz.consent?.set({ [ids(zaraz).marketing]: choice.marketing }));
}

function becomeReady() {
  if (ready) {
    return;
  }
  ready = true;
  if (pending) {
    // The default goes first: Zaraz attaches it to every later event.
    sendConsent(pending, "google_consent_default");
    pending = null;
  }
  const events = queue;
  queue = [];
  for (const [event, properties] of events) {
    call((zaraz) => zaraz.track(event, properties));
  }
}

/**
 * Called when the Zaraz script has loaded. The consent API may need a moment
 * longer. Events are sent once it is ready, or after a timeout if the
 * configuration has no consent purposes.
 */
function onScriptLoad() {
  if (window.zaraz?.consent?.APIReady) {
    becomeReady();
    return;
  }
  document.addEventListener("zarazConsentAPIReady", becomeReady, { once: true });
  window.setTimeout(becomeReady, CONSENT_API_TIMEOUT_MS);
}

function startZaraz() {
  if (window.__wbZarazStarted) {
    return;
  }
  window.__wbZarazStarted = true;
  const script = document.createElement("script");
  script.async = true;
  script.src = zarazScriptUrl();
  script.addEventListener("load", onScriptLoad);
  document.head.appendChild(script);
}

/**
 * Applies a consent state: the stored one on page load, or a choice made on
 * the page. Zaraz starts only for a choice that allows statistics or
 * marketing. A later change on the same page reaches it as a consent update.
 */
export function applyZarazConsent(state: ConsentState) {
  if (!zarazActive() || typeof window === "undefined" || !state.answered) {
    return;
  }
  const choice: ZarazPurposes = { statistics: state.statistics, marketing: state.marketing };

  if (window.__wbZarazStarted) {
    if (ready) {
      sendConsent(choice, "google_consent_update");
    } else {
      pending = choice;
    }
    return;
  }
  if (!choice.statistics && !choice.marketing) {
    return;
  }
  pending = choice;
  startZaraz();
}

/** For tests: forgets the queue and the ready state. */
export function resetZarazMemory() {
  queue = [];
  ready = false;
  pending = null;
}
