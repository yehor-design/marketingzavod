import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CONSENT_MAX_AGE_SECONDS,
  CONSENT_READER_SOURCE,
  CONSENT_VERSION,
  consentCookieAttributes,
  narrowsConsent,
  newConsentId,
  parseConsent,
  prefixesToClear,
  readConsentCookie,
  serializeConsent,
  type StoredConsent,
} from "@/lib/consent/core";
import {
  consentSnapshot,
  DENIED,
  getConsent,
  getStoredConsent,
  onConsentChange,
  resetConsentMemory,
  saveConsent,
  setConsent,
} from "@/lib/consent";

const NOW = 1_763_380_000;
const ID = "0f8c2b1d9e7a4c6b8d0e1f2a3b4c5d6e";
const CHOICE: StoredConsent = { version: CONSENT_VERSION, statistics: true, marketing: false, decidedAt: NOW, id: ID };

describe("consent cookie format", () => {
  it("writes and reads back the same choice", () => {
    const value = serializeConsent(CHOICE);
    expect(value).toBe(`1.s1m0.${NOW}.${ID}`);
    expect(parseConsent(value, NOW)).toEqual(CHOICE);
    expect(parseConsent(serializeConsent({ ...CHOICE, statistics: false, marketing: true }), NOW)).toMatchObject({
      statistics: false,
      marketing: true,
    });
  });

  it.each([
    ["missing", undefined],
    ["empty", ""],
    ["garbage", "yes"],
    ["bad flags", `1.s2m0.${NOW}.${ID}`],
    ["short ID", `1.s1m0.${NOW}.abc`],
    ["uppercase ID", `1.s1m0.${NOW}.${ID.toUpperCase()}`],
    ["extra part", `1.s1m0.${NOW}.${ID}.x`],
    ["another version", `2.s1m0.${NOW}.${ID}`],
  ])("treats a %s value as no choice", (_, raw) => {
    expect(parseConsent(raw, NOW)).toBeNull();
  });

  it("ignores a choice from the future beyond clock skew", () => {
    expect(parseConsent(`1.s1m1.${NOW + 60}.${ID}`, NOW)).not.toBeNull();
    expect(parseConsent(`1.s1m1.${NOW + 3600}.${ID}`, NOW)).toBeNull();
  });

  it("forgets a choice after 180 days", () => {
    const raw = serializeConsent(CHOICE);
    expect(parseConsent(raw, NOW + CONSENT_MAX_AGE_SECONDS - 1)).not.toBeNull();
    expect(parseConsent(raw, NOW + CONSENT_MAX_AGE_SECONDS)).toBeNull();
    expect(CONSENT_MAX_AGE_SECONDS).toBe(180 * 24 * 60 * 60);
  });

  it("finds the cookie among others", () => {
    const cookies = `wb_attr=x; wb_consent=${serializeConsent(CHOICE)}; _ga=1`;
    expect(readConsentCookie(cookies, NOW)).toEqual(CHOICE);
    expect(readConsentCookie("wb_attr=x", NOW)).toBeNull();
    expect(readConsentCookie("xwb_consent=1", NOW)).toBeNull();
  });

  it("sets first-party, lax, 180-day attributes, secure on https", () => {
    expect(consentCookieAttributes(true)).toBe("Path=/; Max-Age=15552000; SameSite=Lax; Secure");
    expect(consentCookieAttributes(false)).toBe("Path=/; Max-Age=15552000; SameSite=Lax");
  });

  it("makes random 32-character hex IDs", () => {
    const a = newConsentId();
    expect(a).toMatch(/^[0-9a-f]{32}$/);
    expect(newConsentId()).not.toBe(a);
  });

  it("clears only the categories that were turned off", () => {
    const all = { statistics: true, marketing: true };
    expect(prefixesToClear(all, { statistics: true, marketing: false })).toEqual([
      "_gcl_",
      "_fbp",
      "_fbc",
      "lastExternalReferrer",
      "li_fat_id",
      "li_gc",
    ]);
    expect(prefixesToClear(all, { statistics: false, marketing: true })).toContain("amplitude.");
    expect(prefixesToClear(all, { statistics: false, marketing: true })).toContain("ph_");
    expect(prefixesToClear(all, { statistics: false, marketing: true })).toContain("AMP_");
    expect(prefixesToClear({ statistics: false, marketing: false }, all)).toEqual([]);
  });

  it("knows when a choice narrows consent", () => {
    const all = { statistics: true, marketing: true };
    const none = { statistics: false, marketing: false };
    expect(narrowsConsent(all, none)).toBe(true);
    expect(narrowsConsent(all, { statistics: true, marketing: false })).toBe(true);
    expect(narrowsConsent(none, all)).toBe(false);
    expect(narrowsConsent(all, all)).toBe(false);
  });
});

describe("the inline reader used by the GTM bootstrap", () => {
  const inline = new Function(`return ${CONSENT_READER_SOURCE}`)() as (
    cookies: string,
    now: number,
  ) => { s: boolean; m: boolean } | null;

  it.each([
    ["no cookie", "wb_attr=x"],
    ["statistics only", `wb_consent=1.s1m0.${NOW}.${ID}`],
    ["marketing only", `a=1; wb_consent=1.s0m1.${NOW}.${ID}; b=2`],
    ["both", `wb_consent=1.s1m1.${NOW}.${ID}`],
    ["neither", `wb_consent=1.s0m0.${NOW}.${ID}`],
    ["another version", `wb_consent=2.s1m1.${NOW}.${ID}`],
    ["garbage", "wb_consent=yes"],
    ["prefix of another name", `xwb_consent=1.s1m1.${NOW}.${ID}`],
    ["from the future", `wb_consent=1.s1m1.${NOW + 3600}.${ID}`],
    ["expired", `wb_consent=1.s1m1.${NOW - CONSENT_MAX_AGE_SECONDS}.${ID}`],
    ["just inside 180 days", `wb_consent=1.s1m1.${NOW - CONSENT_MAX_AGE_SECONDS + 1}.${ID}`],
  ])("agrees with readConsentCookie: %s", (_, cookies) => {
    const expected = readConsentCookie(cookies, NOW);
    const actual = inline(cookies, NOW);
    expect(actual).toEqual(expected ? { s: expected.statistics, m: expected.marketing } : null);
  });
});

/** A minimal document.cookie: assignments add or replace one cookie, reads join them. */
function cookieJar(initial: Record<string, string> = {}) {
  const jar = new Map(Object.entries(initial));
  const writes: string[] = [];
  const document = {
    get cookie() {
      return [...jar].map(([name, value]) => `${name}=${value}`).join("; ");
    },
    set cookie(line: string) {
      writes.push(line);
      const [pair] = line.split(";");
      const index = pair.indexOf("=");
      jar.set(pair.slice(0, index), pair.slice(index + 1));
    },
  };
  return { document, writes };
}

describe("lib/consent in the browser", () => {
  beforeEach(() => {
    resetConsentMemory();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    resetConsentMemory();
  });

  it("grants nothing on the server", () => {
    expect(getConsent()).toEqual(DENIED);
    expect(getStoredConsent()).toBeNull();
  });

  it("grants nothing until a choice is made", () => {
    const { document } = cookieJar();
    vi.stubGlobal("window", { location: { protocol: "https:" } });
    vi.stubGlobal("document", document);
    expect(getConsent()).toEqual(DENIED);
  });

  it("restores a stored choice on page load", () => {
    const decidedAt = Math.floor(Date.now() / 1000) - 60;
    const { document } = cookieJar({ wb_consent: serializeConsent({ ...CHOICE, decidedAt }) });
    vi.stubGlobal("window", { location: { protocol: "https:" } });
    vi.stubGlobal("document", document);
    expect(getConsent()).toEqual({ necessary: true, preferences: false, statistics: true, marketing: false, answered: true });
    expect(getStoredConsent()?.id).toBe(ID);
  });

  it("saves a choice to the cookie, applies it and notifies listeners", () => {
    const { document, writes } = cookieJar();
    const reload = vi.fn();
    const sendBeacon = vi.fn(() => true);
    vi.stubGlobal("window", { location: { protocol: "https:", hostname: "www.heywowboy.com", reload } });
    vi.stubGlobal("navigator", { sendBeacon });
    vi.stubGlobal("document", document);

    const seen: Array<[boolean, boolean]> = [];
    const stop = onConsentChange((state, previous) => seen.push([previous.statistics, state.statistics]));
    const result = saveConsent({ statistics: true, marketing: true }, "banner");

    expect(writes).toHaveLength(1);
    expect(writes[0]).toMatch(/^wb_consent=1\.s1m1\.\d+\.[0-9a-f]{32}; Path=\/; Max-Age=15552000; SameSite=Lax; Secure$/);
    expect(result).toMatchObject({ narrowed: false, source: "banner", stored: { statistics: true, marketing: true } });
    expect(getConsent()).toMatchObject({ statistics: true, marketing: true, answered: true });
    expect(consentSnapshot()).toEqual({ statistics: true, marketing: true, preferences: false });
    expect(seen).toEqual([[false, true]]);
    // One consent log record per choice.
    expect(sendBeacon).toHaveBeenCalledTimes(1);

    expect(reload).not.toHaveBeenCalled();

    // Withdrawal clears what the category stored and reloads the page.
    // The same browser keeps its consent ID across changes.
    document.cookie = "_ga=GA1.1.1";
    document.cookie = "_fbp=fb.1";
    const next = saveConsent({ statistics: false, marketing: false }, "settings");
    expect(next.narrowed).toBe(true);
    expect(next.stored.id).toBe(result.stored.id);
    expect(reload).toHaveBeenCalledTimes(1);
    expect(writes.filter((line) => /^(_ga|_fbp)=; Max-Age=0; Path=\//.test(line))).toHaveLength(6);

    stop();
    saveConsent({ statistics: true, marketing: false }, "settings");
    expect(seen).toHaveLength(2);
  });

  it("still supports a choice reported without the cookie", () => {
    vi.stubGlobal("window", {});
    setConsent({ preferences: false, statistics: true, marketing: false, answered: true });
    expect(consentSnapshot()).toEqual({ statistics: true, marketing: false, preferences: false });
  });
});
