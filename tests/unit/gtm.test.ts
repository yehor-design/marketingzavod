import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const GRANTED_ALL = {
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
  analytics_storage: "granted",
  functionality_storage: "denied",
  personalization_storage: "denied",
  security_storage: "granted",
};

type Entry = Record<string, unknown>;

/** The browser globals applyGtmConsent touches. */
function browser() {
  const scripts: string[] = [];
  const dataLayer: unknown[] = [{ ga4_id: "G-TEST", consent_ready: "false" }, { event: "page_view" }];
  vi.stubGlobal("window", { dataLayer });
  vi.stubGlobal("document", {
    createElement: () => ({}) as { src?: string },
    head: { appendChild: (script: { src: string }) => scripts.push(script.src) },
  });
  return { dataLayer, scripts };
}

async function load() {
  vi.resetModules();
  return import("@/lib/tracking/gtm");
}

const state = (statistics: boolean, marketing: boolean) => ({
  necessary: true as const,
  preferences: false,
  statistics,
  marketing,
  answered: true,
});

describe("lib/tracking/gtm", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_TRACKING_DEBUG", "true");
    vi.stubEnv("NEXT_PUBLIC_GTM_ID", "GTM-UNIT");
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("maps a choice to Consent Mode v2 signals", async () => {
    const { consentModeState } = await load();
    expect(consentModeState(true, true)).toEqual(GRANTED_ALL);
    expect(consentModeState(true, false)).toMatchObject({ analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied" });
    expect(consentModeState(false, false)).toMatchObject({ analytics_storage: "denied", security_storage: "granted" });
  });

  it("does not start GTM for a choice that allows nothing", async () => {
    const { dataLayer, scripts } = browser();
    const { applyGtmConsent } = await load();
    applyGtmConsent(state(false, false));
    expect(scripts).toEqual([]);
    expect(dataLayer).toHaveLength(2);
  });

  it("starts GTM on a grant, with the default placed before events already queued", async () => {
    const { dataLayer, scripts } = browser();
    const { applyGtmConsent } = await load();
    applyGtmConsent(state(true, true));

    expect(scripts).toEqual(["https://www.googletagmanager.com/gtm.js?id=GTM-UNIT"]);
    expect((dataLayer[0] as Entry).consent_ready).toBe("false");
    // gtag commands are arguments objects: consent, default, signals.
    expect(Array.from(dataLayer[1] as IArguments)).toEqual(["consent", "default", GRANTED_ALL]);
    expect(dataLayer[2]).toEqual({ consent_statistics: true, consent_marketing: true });
    expect(dataLayer[3]).toEqual({ event: "page_view" });
    expect(dataLayer[4]).toEqual({ event: "consent_update", consent_statistics: true, consent_marketing: true });
    expect((dataLayer[5] as Entry).event).toBe("gtm.js");

    // A second grant on the same page only updates: no second gtm.js.
    applyGtmConsent(state(true, false));
    expect(scripts).toHaveLength(1);
    expect(Array.from(dataLayer[6] as IArguments).slice(0, 2)).toEqual(["consent", "update"]);
    expect(dataLayer[7]).toEqual({ event: "consent_update", consent_statistics: true, consent_marketing: false });
  });

  it("ignores state that is not a choice, and stays off without a GTM ID", async () => {
    const first = browser();
    const gtm = await load();
    gtm.applyGtmConsent({ ...state(true, true), answered: false });
    expect(first.scripts).toEqual([]);

    vi.stubEnv("NEXT_PUBLIC_GTM_ID", "");
    const second = browser();
    const fresh = await load();
    fresh.applyGtmConsent(state(true, true));
    expect(second.scripts).toEqual([]);
  });
});
