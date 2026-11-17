import { afterEach, describe, expect, it, vi } from "vitest";
import { sendConsentRecord } from "@/lib/consent/log";
import { CONSENT_LOG_PATH, consentEventProperties, consentRecordSchema } from "@/lib/consent/record";

const RECORD = {
  id: "0f8c2b1d9e7a4c6b8d0e1f2a3b4c5d6e",
  version: 1,
  statistics: true,
  marketing: false,
  source: "banner" as const,
  decided_at: 1_763_380_000,
};

describe("consent log record", () => {
  it("accepts a choice and drops anything else", () => {
    const parsed = consentRecordSchema.parse({ ...RECORD, email: "a@b.c", ip: "1.2.3.4" });
    expect(parsed).toEqual(RECORD);
  });

  it.each([
    ["a short ID", { ...RECORD, id: "abc" }],
    ["an unknown source", { ...RECORD, source: "popup" }],
    ["a string flag", { ...RECORD, statistics: "true" }],
    ["a missing date", { ...RECORD, decided_at: undefined }],
    ["a negative date", { ...RECORD, decided_at: -1 }],
    ["a fractional version", { ...RECORD, version: 1.5 }],
  ])("rejects %s", (_, value) => {
    expect(consentRecordSchema.safeParse(value).success).toBe(false);
  });

  it("becomes an event without a person profile, GeoIP or personal data", () => {
    const properties = consentEventProperties(RECORD);
    expect(properties).toEqual({
      version: 1,
      statistics: true,
      marketing: false,
      source: "banner",
      decided_at: "2025-11-17T11:46:40.000Z",
      $process_person_profile: false,
      $geoip_disable: true,
    });
  });
});

describe("sendConsentRecord", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses sendBeacon with a JSON body", async () => {
    const sendBeacon = vi.fn(() => true);
    const fetch = vi.fn();
    vi.stubGlobal("navigator", { sendBeacon });
    vi.stubGlobal("fetch", fetch);
    sendConsentRecord(RECORD);
    expect(sendBeacon).toHaveBeenCalledTimes(1);
    const [path, blob] = sendBeacon.mock.calls[0] as unknown as [string, Blob];
    expect(path).toBe(CONSENT_LOG_PATH);
    expect(blob.type).toBe("application/json");
    expect(JSON.parse(await blob.text())).toEqual(RECORD);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("falls back to a keepalive fetch and never throws", () => {
    const fetch = vi.fn(() => Promise.reject(new Error("offline")));
    vi.stubGlobal("navigator", { sendBeacon: () => false });
    vi.stubGlobal("fetch", fetch);
    expect(() => sendConsentRecord(RECORD)).not.toThrow();
    expect(fetch).toHaveBeenCalledWith(CONSENT_LOG_PATH, expect.objectContaining({ method: "POST", keepalive: true }));
  });
});
