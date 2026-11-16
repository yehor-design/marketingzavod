/**
 * PostHog in the browser. Loaded in code, not through GTM, and sent through the
 * first-party /ingest proxy. The library is imported lazily, after the page is
 * interactive, so it never competes with rendering.
 *
 * Before analytics consent PostHog keeps everything in memory: no cookie, no
 * localStorage, no session recording. Consent switches on persistence and
 * recordings. Withdrawal switches them off again and removes what was stored.
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

function run(task: (posthog: PostHog) => void) {
  if (!posthogActive()) {
    return;
  }
  if (client) {
    task(client);
  } else {
    queue.push(task);
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

/** Starts PostHog once. Safe to call repeatedly. Does nothing without a key. */
export function initPosthog() {
  if (!posthogActive() || client || starting || typeof window === "undefined") {
    return;
  }
  starting = true;
  const start = async () => {
    try {
      const { default: posthog } = await import("posthog-js");
      const consent = getConsent().statistics;
      posthog.init(trackingIds.posthogKey, {
        api_host: POSTHOG_PROXY_PATH,
        ui_host: uiHost(trackingIds.posthogHost),
        defaults: "2026-08-30",
        // Page views come from track("page_view"), exactly one per route change.
        capture_pageview: false,
        capture_pageleave: true,
        autocapture: true,
        person_profiles: "identified_only",
        persistence: consent ? "localStorage+cookie" : "memory",
        disable_session_recording: !consent,
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

export function posthogCapture(event: string, properties: Record<string, unknown>) {
  run((posthog) => posthog.capture(event, properties));
}

/** Applies a consent change without reloading the page. */
export function applyPosthogConsent(state: ConsentState) {
  run((posthog) => {
    if (state.statistics) {
      posthog.set_config({ persistence: "localStorage+cookie", disable_session_recording: false });
      posthog.startSessionRecording();
    } else {
      posthog.stopSessionRecording();
      posthog.set_config({ persistence: "memory", disable_session_recording: true });
      clearStored(trackingIds.posthogKey);
    }
  });
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
