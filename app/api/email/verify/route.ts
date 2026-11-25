import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import {
  DEFAULT_RESEND_DOMAIN,
  DEFAULT_RESEND_VERIFY_TO,
  getResendEmailStatus,
  resendConfigured,
  sendResendEmail,
  verifyResendDomain,
} from "@/lib/email/resend";
import { clientIp } from "@/lib/http/request";
import { createRateLimiter } from "@/lib/leads/rate-limit";
import { secretMatches } from "@/lib/offline/signature";
import { serverLog } from "@/lib/server-log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const allow = createRateLimiter(3, 60_000);

const bodySchema = z
  .object({
    send: z.boolean().optional().default(true),
  })
  .default({ send: true });

const RESPONSE_HEADERS = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex",
};

/**
 * Operational check for the Resend integration. Disabled unless
 * EMAIL_VERIFY_SECRET is set, requires a matching Bearer token, and only ever
 * sends to the project's own verification mailbox (never a caller-supplied address).
 */
export async function POST(request: NextRequest) {
  const verifySecret = process.env.EMAIL_VERIFY_SECRET?.trim();
  if (!verifySecret) {
    return NextResponse.json(
      { ok: false, error: "not_configured" },
      { status: 503, headers: RESPONSE_HEADERS },
    );
  }

  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!secretMatches(verifySecret, token)) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401, headers: RESPONSE_HEADERS },
    );
  }

  if (!allow(clientIp(request))) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { ...RESPONSE_HEADERS, "Retry-After": "60" } },
    );
  }

  if (!resendConfigured()) {
    return NextResponse.json(
      { ok: false, error: "resend_not_configured" },
      { status: 503, headers: RESPONSE_HEADERS },
    );
  }

  let rawBody: unknown = {};
  const text = await request.text();
  if (text.trim()) {
    try {
      rawBody = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { ok: false, error: "invalid_json" },
        { status: 400, headers: RESPONSE_HEADERS },
      );
    }
  }

  const parsed = bodySchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation" },
      { status: 400, headers: RESPONSE_HEADERS },
    );
  }

  const domain = await verifyResendDomain(DEFAULT_RESEND_DOMAIN);
  if (!parsed.data.send) {
    const domainReady =
      domain.state === "sending_only_key" ||
      (domain.state === "found" && domain.status === "verified");
    serverLog.info("email_verify_completed", {
      domain_state: domain.state,
      domain_status: domain.state === "found" ? domain.status : "",
      email_sent: false,
    });
    return NextResponse.json(
      { ok: domainReady, domain },
      { status: domainReady ? 200 : 502, headers: RESPONSE_HEADERS },
    );
  }

  const recipient = process.env.RESEND_VERIFY_TO?.trim() || DEFAULT_RESEND_VERIFY_TO;
  const email = await sendResendEmail({
    to: recipient,
    subject: "Marketing Zavod — перевірка підключення Resend",
    text: [
      "Тестовий лист із продакшену https://www.marketingzavod.com.",
      "",
      "Домен відправника: marketingzavod.com (SPF + DKIM + DMARC у Vercel DNS).",
      "Сервіс відправки: Resend (регіон ЄС).",
    ].join("\n"),
  });

  let lastEvent: string | undefined;
  if (email.sent && domain.state !== "sending_only_key") {
    await new Promise((resolve) => setTimeout(resolve, 2500));
    const delivery = await getResendEmailStatus(email.id);
    lastEvent = delivery.lastEvent;
  }

  serverLog.info("email_verify_completed", {
    domain_state: domain.state,
    domain_status: domain.state === "found" ? domain.status : "",
    email_sent: email.sent,
    email_id: email.sent ? email.id : "",
    last_event: lastEvent ?? "",
  });

  return NextResponse.json(
    { ok: email.sent, domain, email, ...(lastEvent ? { lastEvent } : {}) },
    { status: email.sent ? 200 : 502, headers: RESPONSE_HEADERS },
  );
}
