import { describe, expect, it, vi } from "vitest";
import { toContactProperties, toDealProperties } from "@/lib/leads/hubspot";
import { createRateLimiter } from "@/lib/leads/rate-limit";
import { cleanPageUrl, fieldErrors, leadRequestSchema } from "@/lib/leads/schema";
import { LogLeadStore, saveLead } from "@/lib/leads/store";
import type { Lead, LeadStore } from "@/lib/leads/types";

const contact = {
  form_name: "contact",
  fields: { name: "Jane Smith", email: " Jane@Example.com ", reason: "sales", message: "Hello there" },
};

describe("leadRequestSchema", () => {
  it("accepts a contact request, normalizes the email and applies defaults", () => {
    const parsed = leadRequestSchema.parse(contact);
    expect(parsed.fields.email).toBe("jane@example.com");
    expect(parsed.consent).toEqual({ statistics: false, marketing: false, preferences: false });
    expect(parsed.attribution).toEqual({ first: null, last: null });
    expect(parsed.company_url).toBe("");
  });

  it("accepts a waitlist request", () => {
    expect(leadRequestSchema.safeParse({ form_name: "waitlist", fields: { email: "a@b.co" } }).success).toBe(true);
  });

  it("rejects a bad email and reports the field", () => {
    const result = leadRequestSchema.safeParse({ form_name: "waitlist", fields: { email: "nope" } });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(fieldErrors(result.error)).toEqual({ email: "Enter a valid email." });
    }
  });

  it("rejects missing required fields", () => {
    const result = leadRequestSchema.safeParse({
      form_name: "contact",
      fields: { name: " ", email: "a@b.co", reason: "sales", message: "" },
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(Object.keys(fieldErrors(result.error)).sort()).toEqual(["message", "name"]);
    }
  });

  it("rejects an unknown reason, an over-long message and an unknown form", () => {
    expect(
      leadRequestSchema.safeParse({ ...contact, fields: { ...contact.fields, reason: "spam" } }).success,
    ).toBe(false);
    expect(
      leadRequestSchema.safeParse({ ...contact, fields: { ...contact.fields, message: "x".repeat(5001) } })
        .success,
    ).toBe(false);
    expect(leadRequestSchema.safeParse({ form_name: "newsletter", fields: { email: "a@b.co" } }).success).toBe(
      false,
    );
  });

  it("validates a job application", () => {
    const fields = {
      name: "Jane",
      email: "a@b.co",
      website: "https://jane.dev",
      motivation: "x",
      experience: "y",
      proud_of: "z",
      role: "frontend-developer",
    };
    expect(leadRequestSchema.safeParse({ form_name: "careers_apply", fields }).success).toBe(true);
    expect(
      leadRequestSchema.safeParse({ form_name: "careers_apply", fields: { ...fields, website: "javascript:alert(1)" } })
        .success,
    ).toBe(false);
  });

  it("sanitizes attribution sent by the client", () => {
    const parsed = leadRequestSchema.parse({
      ...contact,
      attribution: { first: { utm_source: "TEST", gclid: "abc", junk: "x" }, last: null },
    });
    expect(parsed.attribution).toEqual({ first: { utm_source: "test", gclid: "abc" }, last: null });
  });
});

describe("cleanPageUrl", () => {
  it("drops the query string and hash", () => {
    expect(cleanPageUrl("https://x.test/contact?email=a@b.co#top")).toBe("https://x.test/contact");
    expect(cleanPageUrl("garbage")).toBe("");
  });
});

describe("rate limiter", () => {
  it("allows the limit, then blocks until the window ends", () => {
    const allow = createRateLimiter(2, 1000);
    expect(allow("ip", 0)).toBe(true);
    expect(allow("ip", 10)).toBe(true);
    expect(allow("ip", 20)).toBe(false);
    expect(allow("other", 20)).toBe(true);
    expect(allow("ip", 1001)).toBe(true);
  });
});

const lead: Lead = {
  lead_id: "lead-1",
  event_id: "event-1",
  form_name: "contact",
  email: "jane@example.com",
  fields: { name: "Jane van Smith", email: "jane@example.com", reason: "sales", message: "Hello" },
  attribution: {
    first: {
      utm_source: "test",
      gclid: "abc",
      landing_page: "https://x.test/",
      timestamp: "2026-11-01T00:00:00.000Z",
    },
    last: { utm_source: "newsletter", utm_medium: "email", timestamp: "2026-11-10T00:00:00.000Z" },
  },
  consent: { statistics: true, marketing: true, preferences: false },
  page_url: "https://x.test/contact",
  user_agent: "test",
  created_at: "2026-11-16T10:00:00.000Z",
  fbp: "fb.1.1.2",
};

describe("HubSpot mapping", () => {
  it("maps a new contact with first touch, last touch and click IDs", () => {
    expect(toContactProperties(lead, true)).toEqual({
      email: "jane@example.com",
      firstname: "Jane",
      lastname: "van Smith",
      mz_lead_id: "lead-1",
      mz_event_id: "event-1",
      mz_form_name: "contact",
      mz_page_url: "https://x.test/contact",
      mz_lead_created_at: "2026-11-16T10:00:00.000Z",
      mz_consent_marketing: "true",
      mz_consent_statistics: "true",
      mz_ft_utm_source: "test",
      mz_ft_landing_page: "https://x.test/",
      mz_ft_timestamp: "2026-11-01T00:00:00.000Z",
      mz_lt_utm_source: "newsletter",
      mz_lt_utm_medium: "email",
      mz_lt_timestamp: "2026-11-10T00:00:00.000Z",
      mz_gclid: "abc",
      mz_click_time: "2026-11-01T00:00:00.000Z",
      mz_fbp: "fb.1.1.2",
      mz_inquiry_type: "sales",
      mz_message: "Hello",
    });
  });

  it("never overwrites first touch on an existing contact", () => {
    const properties = toContactProperties(lead, false);
    expect(Object.keys(properties).some((key) => key.startsWith("mz_ft_"))).toBe(false);
    expect(properties.mz_lt_utm_source).toBe("newsletter");
  });

  it("creates a deal for sales forms only", () => {
    expect(toDealProperties(lead, "appointmentscheduled", "default")).toEqual({
      dealname: "Contact form: jane@example.com",
      pipeline: "default",
      dealstage: "appointmentscheduled",
      mz_lead_id: "lead-1",
      mz_form_name: "contact",
    });
    expect(toDealProperties({ ...lead, form_name: "careers_apply" }, "x", "default")).toBeNull();
  });
});

describe("saveLead", () => {
  it("writes the lead to the log when no CRM is connected", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const result = await saveLead(lead, new LogLeadStore());
    expect(result).toEqual({ store: "log" });
    expect(JSON.parse(log.mock.calls[0][0] as string)).toMatchObject({ type: "lead", lead: { lead_id: "lead-1" } });
    log.mockRestore();
  });

  it("falls back to the log and reports the error when the CRM fails", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const failing: LeadStore = {
      name: "hubspot",
      save: () => Promise.reject(Object.assign(new Error("boom"), { status: 500, body: "{}" })),
    };
    const result = await saveLead(lead, failing);
    expect(result).toEqual({ store: "log" });
    expect(JSON.parse(error.mock.calls[0][0] as string)).toMatchObject({
      type: "lead_store_error",
      store: "hubspot",
      status: 500,
    });
    expect(log).toHaveBeenCalledOnce();
    log.mockRestore();
    error.mockRestore();
  });
});
