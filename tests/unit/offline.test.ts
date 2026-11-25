import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { buildGoogleAdsCsv, formatConversionTime } from "@/lib/offline/google-ads-csv";
import { sentKeys, stageEnteredAt } from "@/lib/offline/hubspot-deals";
import { secretMatches, verifyHubspotSignature } from "@/lib/offline/signature";
import { sha256 } from "@/lib/meta/capi";

describe("Google Ads offline conversion file", () => {
  it("formats the conversion time in UTC", () => {
    expect(formatConversionTime("2026-11-16T10:05:09.123Z")).toBe("2026-11-16 10:05:09");
  });

  it("writes a click ID row and a hashed email row", () => {
    const csv = buildGoogleAdsCsv([
      {
        gclid: "TEST-gclid",
        email: "jane@example.com",
        conversionName: "Deal won (offline)",
        conversionTime: "2026-11-16T10:00:00.000Z",
        value: 500,
        currency: "EUR",
      },
      {
        email: "Jane@Example.com",
        conversionName: "Qualified lead (offline)",
        conversionTime: "2026-11-15T08:30:00.000Z",
        value: 50,
        currency: "EUR",
      },
    ]);
    expect(csv.split("\n")).toEqual([
      "Parameters:TimeZone=+0000",
      "Google Click ID,GBRAID,WBRAID,Email,Conversion Name,Conversion Time,Conversion Value,Conversion Currency,Ad User Data,Ad Personalization",
      "TEST-gclid,,,,Deal won (offline),2026-11-16 10:00:00,500,EUR,Granted,Granted",
      `,,,${sha256("jane@example.com")},Qualified lead (offline),2026-11-15 08:30:00,50,EUR,Granted,Granted`,
      "",
    ]);
    expect(csv).not.toContain("jane@example.com");
  });

  it("escapes commas and quotes", () => {
    const csv = buildGoogleAdsCsv([
      { gclid: "a", conversionName: 'Won, "big"', conversionTime: "2026-11-16T10:00:00Z", value: 1, currency: "EUR" },
    ]);
    expect(csv).toContain('"Won, ""big"""');
  });
});

describe("deal helpers", () => {
  it("reads the stage entry time in either HubSpot format", () => {
    const deal = {
      id: "1",
      properties: { hs_v2_date_entered_closedwon: "2026-11-16T10:00:00.000Z", hs_date_entered_qualifiedtobuy: "1794823200000" },
    };
    expect(stageEnteredAt(deal, "closedwon")).toBe("2026-11-16T10:00:00.000Z");
    expect(stageEnteredAt(deal, "qualifiedtobuy")).toBe("2026-11-16T10:00:00.000Z");
    expect(stageEnteredAt(deal, "contractsent")).toBeNull();
  });

  it("reads the conversions already sent for a deal", () => {
    expect(sentKeys({ id: "1", properties: { mz_offline_sent: "qualified_lead, deal_won" } })).toEqual([
      "qualified_lead",
      "deal_won",
    ]);
    expect(sentKeys({ id: "1", properties: {} })).toEqual([]);
  });
});

describe("request authentication", () => {
  const secret = "client-secret";
  const url = "https://www.marketingzavod.com/api/crm/hubspot";
  const body = '[{"objectId":1}]';
  const now = 1794823200000;
  const sign = (timestamp: string) =>
    createHmac("sha256", secret).update(`POST${url}${body}${timestamp}`).digest("base64");

  it("accepts a valid HubSpot v3 signature", () => {
    const timestamp = String(now);
    expect(
      verifyHubspotSignature({ secret, method: "POST", url, body, timestamp, signature: sign(timestamp), now }),
    ).toBe(true);
  });

  it("rejects a changed body, a wrong secret and a stale request", () => {
    const timestamp = String(now);
    const signature = sign(timestamp);
    expect(verifyHubspotSignature({ secret, method: "POST", url, body: "[]", timestamp, signature, now })).toBe(false);
    expect(verifyHubspotSignature({ secret: "other", method: "POST", url, body, timestamp, signature, now })).toBe(false);
    expect(verifyHubspotSignature({ secret, method: "POST", url, body, timestamp: null, signature, now })).toBe(false);
    const old = String(now - 6 * 60 * 1000);
    expect(
      verifyHubspotSignature({ secret, method: "POST", url, body, timestamp: old, signature: sign(old), now }),
    ).toBe(false);
  });

  it("compares shared secrets safely", () => {
    expect(secretMatches("abc", "abc")).toBe(true);
    expect(secretMatches("abc", "abd")).toBe(false);
    expect(secretMatches("abc", "abcd")).toBe(false);
    expect(secretMatches(undefined, "abc")).toBe(false);
    expect(secretMatches("abc", null)).toBe(false);
  });
});
