/**
 * PostHog in the browser. Loaded in code, not through GTM, and sent through the
 * first-party /ingest proxy. The library is imported lazily, after the page is
 * interactive, so it never competes with rendering.
 *
 * PostHog runs only with statistics consent: without it the library is not
 * even downloaded and nothing is sent. Events from the current page wait in a
 * short queue and go out once consent is given. Withdrawal stops collection
 * and removes what PostHog stored.
 */
import type { PostHog } from "posthog-js";
import { getConsent, type ConsentState } from "@/lib/consent";
import { POSTHOG_PROXY_PATH, TRACKING_ENABLED, trackingIds } from "@/lib/tracking/env";

let client: PostHog | null = null;
let starting = false;
const queue: Array<(posthog: PostHog) => void> = [];

export function posthogActive(): boolean {
  return TRACKING_ENABLED && trackingIds.posthogKey !== "";
}

function uiHost(apiHost: string): string {
  return apiHost.includes("us.i.posthog.com") ? "https://us.posthog.com" : "https://eu.posthog.com";
}

/** Enough for one page before the visitor chooses. Older tasks are dropped. */
const QUEUE_LIMIT = 100;

function run(task: (posthog: PostHog) => void) {
  if (!posthogActive()) {
    return;
  }
  if (client) {
    if (getConsent().statistics) {
      task(client);
    }
    return;
  }
  queue.push(task);
  if (queue.length > QUEUE_LIMIT) {
    queue.shift();
  }
}

function clearStored(key: string) {
  const name = `ph_${key}_posthog`;
  try {
    window.localStorage.removeItem(name);
  } catch {
    // Storage can be unavailable. Nothing to remove then.
  }
  const host = window.location.hostname;
  const domains = ["", `; Domain=${host}`, `; Domain=.${host.split(".").slice(-2).join(".")}`];
  for (const domain of domains) {
    document.cookie = `${name}=; Max-Age=0; Path=/${domain}`;
  }
}

/** Settings PostHog runs with when it may collect. */
const COLLECTING = {
  persistence: "localStorage+cookie",
  autocapture: true,
  capture_pageleave: true,
  disable_session_recording: false,
} as const;

/** Starts PostHog once, with statistics consent only. Safe to call repeatedly. */
export function initPosthog() {
  if (!posthogActive() || client || starting || typeof window === "undefined") {
    return;
  }
  if (!getConsent().statistics) {
    return;
  }
  starting = true;
  const start = async () => {
    try {
      const { default: posthog } = await import("posthog-js");
      posthog.init(trackingIds.posthogKey, {
        api_host: POSTHOG_PROXY_PATH,
        ui_host: uiHost(trackingIds.posthogHost),
        defaults: "2026-08-30",
        // Page views come from track("page_view"), exactly one per route change.
        capture_pageview: false,
        capture_exceptions: true,
        person_profiles: "identified_only",
        ...COLLECTING,
        session_recording: { maskAllInputs: true, maskTextSelector: "[data-private]" },
      });
      client = posthog;
      queue.splice(0).forEach((task) => task(posthog));
    } catch (error) {
      starting = false;
      console.warn("[tracking] PostHog failed to load", error);
    }
  };
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => void start(), { timeout: 4000 });
  } else {
    setTimeout(() => void start(), 1500);
  }
}

export function posthogCapture(event: string, properties: Record<string, unknown> = {}) {
  run((posthog) => posthog.capture(event, properties));
}

/** A log line in PostHog Logs. Same consent rules as events: attributes carry no personal data. */
export function posthogLogInfo(body: string, attributes: Record<string, string | number | boolean>) {
  run((posthog) => posthog.captureLog({ body, level: "info", attributes }));
}

/** Reports an uncaught error to PostHog error tracking. */
export function posthogCaptureException(error: unknown) {
  run((posthog) => posthog.captureException(error));
}

/**
 * Applies a consent change without reloading the page. Withdrawal also
 * reloads the page (lib/consent), so the stop here only has to hold until then,
 * and it writes nothing new to the device.
 */
export function applyPosthogConsent(state: ConsentState) {
  if (state.statistics) {
    if (client) {
      client.set_config(COLLECTING);
      client.startSessionRecording();
    } else {
      initPosthog();
    }
    return;
  }
  queue.splice(0);
  if (client) {
    client.stopSessionRecording();
    client.set_config({
      persistence: "memory",
      autocapture: false,
      capture_pageleave: false,
      disable_session_recording: true,
    });
    clearStored(trackingIds.posthogKey);
  }
}

/**
 * Ties the browser to a lead after a form is sent. The distinct ID is the
 * internal lead ID, never the email. Skipped without analytics consent.
 */
export function posthogIdentifyLead(leadId: string, properties: Record<string, string>) {
  if (!getConsent().statistics) {
    return;
  }
  run((posthog) => {
    if (posthog._isIdentified()) {
      posthog.setPersonProperties({ last_lead_id: leadId });
      return;
    }
    posthog.identify(leadId, { last_lead_id: leadId }, properties);
  });
}

/** The current distinct ID, sent with a lead so server events join the same person. */
export function getPosthogDistinctId(): string | undefined {
  if (!client || !getConsent().statistics) {
    return undefined;
  }
  return client.get_distinct_id();
}
