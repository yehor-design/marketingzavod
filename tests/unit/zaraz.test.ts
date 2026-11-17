import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type Call = [string, ...unknown[]];

const state = (statistics: boolean, marketing: boolean, answered = true) => ({
  necessary: true as const,
  preferences: false,
  statistics,
  marketing,
  answered,
});

/** The browser globals lib/tracking/zaraz.ts touches, and a fake Zaraz. */
function browser() {
  const scripts: Array<{ src: string; async?: boolean; load?: () => void }> = [];
  const documentListeners = new Map<string, () => void>();
  const timers: Array<() => void> = [];
  const calls: Call[] = [];
  const win: Record<string, unknown> = {
    setTimeout: (fn: () => void) => timers.push(fn),
  };
  vi.stubGlobal("window", win);
  vi.stubGlobal("document", {
    createElement: () => {
      const script: { src: string; async?: boolean; load?: () => void; addEventListener: unknown } = {
        src: "",
        addEventListener: (name: string, fn: () => void) => {
          if (name === "load") {
            script.load = fn;
          }
        },
      };
      return script;
    },
    head: { appendChild: (script: { src: string }) => scripts.push(script) },
    addEventListener: (name: string, fn: () => void) => documentListeners.set(name, fn),
  });

  /** What the real i.js does: defines window.zaraz, then the script's load event fires. */
  function loadZaraz({ consentReady }: { consentReady: boolean }) {
    win.zaraz = {
      track: (...args: unknown[]) => {
        calls.push(["track", ...args]);
        return Promise.resolve();
      },
      set: (...args: unknown[]) => calls.push(["set", ...args]),
      consent: {
        APIReady: consentReady,
        set: (...args: unknown[]) => calls.push(["consent.set", ...args]),
      },
    };
    scripts[0].load?.();
  }

  return { win, scripts, calls, loadZaraz, documentListeners, timers };
}

async function load() {
  vi.resetModules();
  return import("@/lib/tracking/zaraz");
}

describe("lib/tracking/zaraz", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_TRACKING_DEBUG", "true");
    vi.stubEnv("NEXT_PUBLIC_TAG_MANAGER", "zaraz");
    vi.stubEnv("NEXT_PUBLIC_ZARAZ_HOST", "z.example.com");
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("is off unless switched on with a valid host", async () => {
    expect((await load()).zarazActive()).toBe(true);

    vi.stubEnv("NEXT_PUBLIC_TAG_MANAGER", "gtm");
    expect((await load()).zarazActive()).toBe(false);

    vi.stubEnv("NEXT_PUBLIC_TAG_MANAGER", "zaraz");
    vi.stubEnv("NEXT_PUBLIC_ZARAZ_HOST", "https://z.example.com/");
    expect((await load()).zarazActive()).toBe(false);
  });

  it("does not request Zaraz without a choice or for necessary only", async () => {
    const { scripts } = browser();
    const zaraz = await load();
    zaraz.zarazTrack("page_view", { page_path: "/" });
    zaraz.applyZarazConsent(state(false, false, false));
    zaraz.applyZarazConsent(state(false, false));
    expect(scripts).toEqual([]);
  });

  it("on consent loads Zaraz, then sends the consent before the queued events", async () => {
    const { scripts, calls, loadZaraz } = browser();
    const zaraz = await load();
    zaraz.zarazTrack("page_view", { page_path: "/", event_id: "a" });
    zaraz.applyZarazConsent(state(true, false));

    expect(scripts.map((script) => script.src)).toEqual(["https://z.example.com/cdn-cgi/zaraz/i.js"]);
    expect(scripts[0].async).toBe(true);
    expect(calls).toEqual([]);

    loadZaraz({ consentReady: true });
    expect(calls).toEqual([
      ["set", "google_consent_default", expect.objectContaining({ analytics_storage: "granted", ad_storage: "denied" })],
      ["consent.set", { statistics: true, marketing: false }],
      ["track", "page_view", { page_path: "/", event_id: "a" }],
    ]);

    // Afterwards events go straight through, and a new choice is an update.
    zaraz.zarazTrack("faq_open", { question: "q" });
    zaraz.applyZarazConsent(state(true, true));
    expect(calls.slice(3)).toEqual([
      ["track", "faq_open", { question: "q" }],
      ["set", "google_consent_update", expect.objectContaining({ ad_storage: "granted", ad_user_data: "granted" })],
      ["consent.set", { statistics: true, marketing: true }],
    ]);
    expect(scripts).toHaveLength(1);
  });

  it("waits for the consent API, and falls back to a timeout", async () => {
    const first = browser();
    const zaraz = await load();
    zaraz.zarazTrack("page_view", { page_path: "/" });
    zaraz.applyZarazConsent(state(false, true));
    first.loadZaraz({ consentReady: false });
    expect(first.calls).toEqual([]);
    first.documentListeners.get("zarazConsentAPIReady")?.();
    expect(first.calls.map((call) => call[0])).toEqual(["set", "consent.set", "track"]);
    // The timeout firing later changes nothing.
    first.timers.forEach((fn) => fn());
    expect(first.calls).toHaveLength(3);

    const second = browser();
    const fresh = await load();
    fresh.zarazTrack("page_view", { page_path: "/" });
    fresh.applyZarazConsent(state(true, true));
    second.loadZaraz({ consentReady: false });
    expect(second.calls).toEqual([]);
    second.timers.forEach((fn) => fn());
    expect(second.calls.map((call) => call[0])).toEqual(["set", "consent.set", "track"]);
  });

  it("uses the latest choice made before Zaraz finished loading", async () => {
    const { calls, loadZaraz } = browser();
    const zaraz = await load();
    zaraz.applyZarazConsent(state(true, true));
    zaraz.applyZarazConsent(state(true, false));
    loadZaraz({ consentReady: true });
    expect(calls[0]).toEqual(["set", "google_consent_default", expect.objectContaining({ ad_storage: "denied" })]);
    expect(calls[1]).toEqual(["consent.set", { statistics: true, marketing: false }]);
  });

  it("keeps at most 100 queued events", async () => {
    const { calls, loadZaraz } = browser();
    const zaraz = await load();
    for (let i = 0; i < 105; i += 1) {
      zaraz.zarazTrack("cta_click", { n: i });
    }
    zaraz.applyZarazConsent(state(true, true));
    loadZaraz({ consentReady: true });
    const tracked = calls.filter((call) => call[0] === "track");
    expect(tracked).toHaveLength(100);
    expect(tracked[0][2]).toEqual({ n: 5 });
  });

  it("survives a Zaraz that throws", async () => {
    const { win, scripts, timers } = browser();
    const zaraz = await load();
    zaraz.zarazTrack("page_view", { page_path: "/" });
    zaraz.applyZarazConsent(state(true, true));
    win.zaraz = {
      track: () => Promise.reject(new Error("blocked")),
      set: () => {
        throw new Error("broken");
      },
    };
    expect(() => scripts[0].load?.()).not.toThrow();
    expect(() => timers.forEach((fn) => fn())).not.toThrow();
    expect(() => zaraz.zarazTrack("faq_open", { question: "q" })).not.toThrow();
  });
});
