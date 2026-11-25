import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getResendEmailStatus,
  resendConfigured,
  sendResendEmail,
  verifyResendDomain,
} from "@/lib/email/resend";

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV };
  delete process.env.RESEND_API_KEY;
  delete process.env.RESEND_FROM;
  delete process.env.RESEND_VERIFY_TO;
  delete process.env.EMAIL_VERIFY_SECRET;
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.restoreAllMocks();
});

describe("lib/email/resend", () => {
  it("stays inactive when RESEND_API_KEY is missing", async () => {
    expect(resendConfigured()).toBe(false);
    const result = await sendResendEmail({
      to: "qa@marketingzavod.com",
      subject: "Hello",
      text: "Body",
    });
    expect(result).toEqual({ sent: false, reason: "not_configured" });
  });

  it("sends a formatted request to Resend and returns the message ID", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    const calls: Array<{ url: string; init?: RequestInit }> = [];
    const fetchMock: typeof fetch = async (input, init) => {
      calls.push({ url: String(input), init });
      return new Response(JSON.stringify({ id: "email_123" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    };

    const result = await sendResendEmail(
      {
        to: "qa@marketingzavod.com",
        subject: "Checklist PDF",
        text: "Plain body",
        html: "<p>Plain body</p>",
        replyTo: "hello@marketingzavod.com",
        headers: { "List-Unsubscribe": "<https://www.marketingzavod.com/unsub>" },
        attachments: [{ filename: "checklist.pdf", content: "JVBERi0=", contentType: "application/pdf" }],
        idempotencyKey: "idem-1",
      },
      { fetchImpl: fetchMock },
    );

    expect(result).toEqual({ sent: true, id: "email_123" });
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe("https://api.resend.com/emails");
    const headers = calls[0].init?.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer re_test_key");
    expect(headers["Idempotency-Key"]).toBe("idem-1");

    const body = JSON.parse(String(calls[0].init?.body)) as Record<string, unknown>;
    expect(body).toEqual({
      from: "Marketing Zavod <noreply@marketingzavod.com>",
      to: ["qa@marketingzavod.com"],
      subject: "Checklist PDF",
      text: "Plain body",
      html: "<p>Plain body</p>",
      reply_to: "hello@marketingzavod.com",
      headers: { "List-Unsubscribe": "<https://www.marketingzavod.com/unsub>" },
      attachments: [
        { filename: "checklist.pdf", content: "JVBERi0=", content_type: "application/pdf" },
      ],
    });
  });

  it("never logs recipient PII when Resend returns an error", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock: typeof fetch = async () =>
      new Response(
        JSON.stringify({
          statusCode: 403,
          name: "validation_error",
          message: "Cannot send to secret-person@example.com",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } },
      );

    const result = await sendResendEmail(
      {
        to: "secret-person@example.com",
        subject: "Private subject",
        text: "Private body",
      },
      { fetchImpl: fetchMock },
    );

    expect(result).toEqual({
      sent: false,
      reason: "error",
      status: 403,
      errorName: "validation_error",
    });
    expect(errorSpy).toHaveBeenCalledTimes(1);
    const logged = String(errorSpy.mock.calls[0][0]);
    expect(logged).not.toContain("secret-person@example.com");
    expect(logged).not.toContain("Private subject");
    expect(logged).not.toContain("Private body");
  });

  it("triggers domain verification when status is not yet verified", async () => {
    process.env.RESEND_API_KEY = "re_full_key";
    const urls: string[] = [];
    const fetchMock: typeof fetch = async (input, init) => {
      const url = String(input);
      urls.push(`${init?.method ?? "GET"} ${url}`);
      if (url.endsWith("/domains")) {
        return new Response(
          JSON.stringify({
            data: [{ id: "dom_1", name: "marketingzavod.com", status: "not_started", region: "eu-west-1" }],
          }),
          { status: 200 },
        );
      }
      if (url.endsWith("/domains/dom_1/verify")) {
        return new Response(JSON.stringify({ object: "domain", id: "dom_1" }), { status: 200 });
      }
      return new Response(
        JSON.stringify({ id: "dom_1", name: "marketingzavod.com", status: "verified", region: "eu-west-1" }),
        { status: 200 },
      );
    };

    const domain = await verifyResendDomain("marketingzavod.com", {
      fetchImpl: fetchMock,
      sleepMs: 0,
    });

    expect(domain).toEqual({
      state: "found",
      id: "dom_1",
      name: "marketingzavod.com",
      status: "verified",
      region: "eu-west-1",
    });
    expect(urls).toEqual([
      "GET https://api.resend.com/domains",
      "POST https://api.resend.com/domains/dom_1/verify",
      "GET https://api.resend.com/domains/dom_1",
    ]);
  });

  it("handles sending-only API keys gracefully during domain checks", async () => {
    process.env.RESEND_API_KEY = "re_sending_only";
    const fetchMock: typeof fetch = async () =>
      new Response(JSON.stringify({ statusCode: 401, name: "restricted_api_key" }), {
        status: 401,
      });

    const domain = await verifyResendDomain("marketingzavod.com", {
      fetchImpl: fetchMock,
      sleepMs: 0,
    });
    expect(domain).toEqual({ state: "sending_only_key" });

    const delivery = await getResendEmailStatus("email_123", { fetchImpl: fetchMock });
    expect(delivery).toEqual({});
  });
});

describe("POST /api/email/verify", () => {
  it("refuses calls when EMAIL_VERIFY_SECRET is unset or bearer token mismatches", async () => {
    const { POST } = await import("@/app/api/email/verify/route");

    const unconfigured = await POST(
      new NextRequest("https://www.marketingzavod.com/api/email/verify", { method: "POST" }),
    );
    expect(unconfigured.status).toBe(503);

    process.env.EMAIL_VERIFY_SECRET = "expected-secret-token";
    const unauthorized = await POST(
      new NextRequest("https://www.marketingzavod.com/api/email/verify", {
        method: "POST",
        headers: { Authorization: "Bearer wrong-token" },
      }),
    );
    expect(unauthorized.status).toBe(401);
  });
});
