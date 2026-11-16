import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { consentSnapshot, DENIED, getConsent, onConsentChange, setConsent } from "@/lib/consent";

describe("lib/consent", () => {
  beforeAll(() => {
    vi.stubGlobal("window", {});
  });
  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it("grants nothing until a choice is reported, then notifies listeners", () => {
    expect(getConsent()).toEqual(DENIED);

    const seen: unknown[] = [];
    const stop = onConsentChange((state) => seen.push(state));
    setConsent({ preferences: false, statistics: true, marketing: false, answered: true });

    expect(consentSnapshot()).toEqual({ statistics: true, marketing: false, preferences: false });
    expect(seen).toEqual([
      { necessary: true, preferences: false, statistics: true, marketing: false, answered: true },
    ]);

    stop();
    setConsent({ preferences: false, statistics: false, marketing: false, answered: true });
    expect(seen).toHaveLength(1);
    expect(getConsent().statistics).toBe(false);
  });
});
