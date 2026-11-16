import { describe, expect, it } from "vitest";
import {
  EMPTY_ATTRIBUTION,
  attributionForConsent,
  deserializeAttribution,
  mergeTouch,
  normalizeClickId,
  normalizeUtm,
  organicTouch,
  parseTouch,
  sanitizeAttribution,
  serializeAttribution,
} from "@/lib/attribution/core";

const NOW = new Date("2026-11-16T10:00:00.000Z");

describe("parseTouch", () => {
  it("reads UTM parameters and click IDs from a landing URL", () => {
    const touch = parseTouch(
      "https://www.heywowboy.com/pricing?utm_source=google&utm_medium=cpc&utm_campaign=brand_q4&gclid=AbC-123",
      "https://www.google.com/search?q=jet",
      NOW,
    );
    expect(touch).toEqual({
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "brand_q4",
      gclid: "AbC-123",
      landing_page: "https://www.heywowboy.com/pricing",
      referrer: "https://www.google.com/search",
      timestamp: "2026-11-16T10:00:00.000Z",
    });
  });

  it("reads every supported click ID", () => {
    const touch = parseTouch(
      "https://x.test/?gclid=a&gbraid=b&wbraid=c&fbclid=d&msclkid=e&li_fat_id=f&ttclid=g",
      "",
      NOW,
    );
    expect(touch).toMatchObject({
      gclid: "a",
      gbraid: "b",
      wbraid: "c",
      fbclid: "d",
      msclkid: "e",
      li_fat_id: "f",
      ttclid: "g",
    });
  });

  it("returns null when the URL has no campaign parameters", () => {
    expect(parseTouch("https://x.test/pricing?ref=nav", "", NOW)).toBeNull();
  });

  it("returns null for an invalid URL", () => {
    expect(parseTouch("not a url", "", NOW)).toBeNull();
  });

  it("drops a referrer from the same site and the query string of the landing page", () => {
    const touch = parseTouch("https://x.test/a?utm_source=x&email=a@b.co", "https://x.test/b", NOW);
    expect(touch?.referrer).toBeUndefined();
    expect(touch?.landing_page).toBe("https://x.test/a");
  });
});

describe("normalization", () => {
  it("lowercases, trims and joins UTM values", () => {
    expect(normalizeUtm("  Google Ads ")).toBe("google_ads");
    expect(normalizeUtm("")).toBeUndefined();
    expect(normalizeUtm(null)).toBeUndefined();
  });

  it("caps UTM length", () => {
    expect(normalizeUtm("a".repeat(400))).toHaveLength(150);
  });

  it("keeps click ID case, trims it and rejects whitespace", () => {
    expect(normalizeClickId("  AbC_dEf ")).toBe("AbC_dEf");
    expect(normalizeClickId("ab cd")).toBeUndefined();
    expect(normalizeClickId("x".repeat(400))).toHaveLength(255);
  });
});

describe("mergeTouch", () => {
  const first = parseTouch("https://x.test/?utm_source=test&gclid=abc", "", NOW);
  const second = parseTouch("https://x.test/?utm_source=newsletter", "", new Date("2026-11-20T10:00:00Z"));

  it("sets first and last touch on the first campaign visit", () => {
    expect(mergeTouch(EMPTY_ATTRIBUTION, first)).toEqual({ first, last: first });
  });

  it("moves last touch and keeps first touch on a later campaign visit", () => {
    const merged = mergeTouch({ first, last: first }, second);
    expect(merged.first).toEqual(first);
    expect(merged.last).toEqual(second);
    expect(merged.first?.utm_source).toBe("test");
    expect(merged.last?.utm_source).toBe("newsletter");
  });

  it("keeps both touches on a visit without campaign parameters", () => {
    expect(mergeTouch({ first, last: second }, null, organicTouch("https://x.test/", "", NOW))).toEqual({
      first,
      last: second,
    });
  });

  it("records a direct visit as the first touch when nothing else is known", () => {
    const organic = organicTouch("https://x.test/blog", "https://news.example/item", NOW);
    expect(mergeTouch(EMPTY_ATTRIBUTION, null, organic)).toEqual({ first: organic, last: organic });
  });
});

describe("attributionForConsent", () => {
  const touch = parseTouch("https://x.test/?utm_source=test&gclid=abc&fbclid=xyz", "https://ref.example/", NOW);
  const attribution = { first: touch, last: touch };

  it("keeps everything with marketing consent", () => {
    expect(attributionForConsent(attribution, { statistics: false, marketing: true })).toEqual(attribution);
  });

  it("removes click IDs with statistics consent only", () => {
    const out = attributionForConsent(attribution, { statistics: true, marketing: false });
    expect(out.last).toEqual({
      utm_source: "test",
      landing_page: "https://x.test/",
      referrer: "https://ref.example/",
      timestamp: "2026-11-16T10:00:00.000Z",
    });
  });

  it("keeps only UTM values without consent", () => {
    const out = attributionForConsent(attribution, { statistics: false, marketing: false });
    expect(out).toEqual({ first: { utm_source: "test" }, last: { utm_source: "test" } });
  });
});

describe("cookie serialization", () => {
  it("round-trips", () => {
    const touch = parseTouch("https://x.test/?utm_source=test&gclid=abc", "", NOW);
    const attribution = { first: touch, last: touch };
    expect(deserializeAttribution(serializeAttribution(attribution))).toEqual(attribution);
  });

  it("survives a broken cookie", () => {
    expect(deserializeAttribution("%7Bnot-json")).toEqual(EMPTY_ATTRIBUTION);
    expect(deserializeAttribution(undefined)).toEqual(EMPTY_ATTRIBUTION);
  });

  it("re-normalizes and drops unknown keys from client input", () => {
    const out = sanitizeAttribution({
      first: { utm_source: " GOOGLE ", evil: "<script>", gclid: "a b" },
      last: "nope",
    });
    expect(out).toEqual({ first: { utm_source: "google" }, last: null });
  });
});
