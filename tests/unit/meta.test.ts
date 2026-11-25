import { describe, expect, it } from "vitest";
import {
  buildMetaPayload,
  fbcFromClickId,
  hashEmail,
  hashPhone,
  normalizeEmail,
  normalizePhone,
  sha256,
} from "@/lib/meta/capi";

describe("hashing", () => {
  it("normalizes an email before hashing", () => {
    expect(normalizeEmail("  Jane.Smith@Example.COM ")).toBe("jane.smith@example.com");
    expect(hashEmail("  Jane.Smith@Example.COM ")).toBe(sha256("jane.smith@example.com"));
  });

  it("matches a known SHA-256 vector", () => {
    expect(sha256("test@example.com")).toBe(
      "973dfe463ec85785f5f95af5ba3906eedb2d931c24e69824a89ea65dba4e813b",
    );
  });

  it("normalizes a phone number to digits with the country code", () => {
    expect(normalizePhone("+359 (88) 123-45-67")).toBe("359881234567");
    expect(normalizePhone("00 359 88 123")).toBe("35988123");
    expect(hashPhone("+359 88 123 4567")).toBe(sha256("359881234567"));
  });

  it("returns undefined for empty input", () => {
    expect(hashEmail("  ")).toBeUndefined();
    expect(hashEmail(undefined)).toBeUndefined();
    expect(hashPhone("ext.")).toBeUndefined();
  });
});

describe("fbcFromClickId", () => {
  it("builds the _fbc format from fbclid and click time", () => {
    expect(fbcFromClickId("AbCdEf", "2026-11-16T10:00:00.000Z")).toBe("fb.1.1794823200000.AbCdEf");
    expect(fbcFromClickId(undefined)).toBeUndefined();
  });
});

describe("buildMetaPayload", () => {
  const input = {
    eventName: "Lead",
    eventId: "event-1",
    eventTime: new Date("2026-11-16T10:00:00.000Z"),
    actionSource: "website" as const,
    eventSourceUrl: "https://www.marketingzavod.com/contact",
    email: "Jane@Example.com",
    clientIp: "203.0.113.7",
    userAgent: "Mozilla/5.0",
    fbp: "fb.1.1.2",
    fbc: "fb.1.3.abc",
    leadId: "lead-1",
  };

  it("builds a website event with hashed identifiers", () => {
    expect(buildMetaPayload(input)).toEqual({
      data: [
        {
          event_name: "Lead",
          event_time: 1794823200,
          event_id: "event-1",
          event_source_url: "https://www.marketingzavod.com/contact",
          action_source: "website",
          user_data: {
            em: [sha256("jane@example.com")],
            client_ip_address: "203.0.113.7",
            client_user_agent: "Mozilla/5.0",
            fbp: "fb.1.1.2",
            fbc: "fb.1.3.abc",
            external_id: [sha256("lead-1")],
          },
        },
      ],
    });
  });

  it("never contains the plain email", () => {
    expect(JSON.stringify(buildMetaPayload(input)).toLowerCase()).not.toContain("jane@example.com");
  });

  it("adds the test event code and custom data when given", () => {
    const payload = buildMetaPayload(
      { ...input, actionSource: "system_generated", customData: { value: 50, currency: "EUR" } },
      "TEST123",
    );
    expect(payload.test_event_code).toBe("TEST123");
    expect((payload.data as Array<Record<string, unknown>>)[0]).toMatchObject({
      action_source: "system_generated",
      custom_data: { value: 50, currency: "EUR" },
    });
  });
});
