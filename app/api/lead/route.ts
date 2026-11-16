import { randomUUID } from "node:crypto";
import { after, NextResponse, type NextRequest } from "next/server";
import { attributionForConsent } from "@/lib/attribution/core";
import { createRateLimiter } from "@/lib/leads/rate-limit";
import { cleanPageUrl, fieldErrors, leadRequestSchema } from "@/lib/leads/schema";
import { saveLead } from "@/lib/leads/store";
import type { Lead } from "@/lib/leads/types";
import { fbcFromClickId, sendMetaEvent } from "@/lib/meta/capi";
import { capturePosthogServerEvent } from "@/lib/posthog-server";
import { flushServerLogs, serverLog } from "@/lib/posthog-server-logs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Five submissions a minute from one address. */
const allow = createRateLimiter(5, 60_000);

/** Server-side Meta event per form. Kept in step with docs/tracking-plan.md. */
const META_EVENTS: Record<string, string | undefined> = {
  contact: "Lead",
  waitlist: "CompleteRegistration",
};

const TRACKING_ALLOWED =
  process.env.VERCEL_ENV === "production" || process.env.NEXT_PUBLIC_TRACKING_DEBUG === "true";

function clientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    return true;
  }
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const ip = clientIp(request);
  if (!allow(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = leadRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", errors: fieldErrors(parsed.error) },
      { status: 400 },
    );
  }
  const data = parsed.data;
  const leadId = randomUUID();
  const eventId = randomUUID();

  // A filled honeypot is a bot. It gets the same answer and nothing is stored.
  if (data.company_url) {
    return NextResponse.json({ ok: true, lead_id: leadId, event_id: eventId });
  }

  const consent = data.consent;
  // The browser already trims attribution by consent. The server repeats it.
  const attribution = attributionForConsent(data.attribution, consent);
  const userAgent = (request.headers.get("user-agent") ?? "").slice(0, 400);
  const fields = { ...data.fields } as Record<string, string>;
  const email = fields.email;

  const lead: Lead = {
    lead_id: leadId,
    event_id: eventId,
    form_name: data.form_name,
    email,
    fields,
    attribution,
    consent,
    page_url: cleanPageUrl(data.page_url),
    user_agent: userAgent,
    created_at: new Date().toISOString(),
  };

  if (consent.marketing) {
    const fbclidTouch = [attribution.last, attribution.first].find((touch) => touch?.fbclid);
    lead.fbp = request.cookies.get("_fbp")?.value;
    lead.fbc =
      request.cookies.get("_fbc")?.value ??
      fbcFromClickId(fbclidTouch?.fbclid, fbclidTouch?.timestamp);
  }

  const saved = await saveLead(lead);

  // No personal data here: IDs, the form name and where the lead was stored.
  serverLog.info("lead_saved", {
    route: "/api/lead",
    form_name: lead.form_name,
    lead_id: lead.lead_id,
    event_id: lead.event_id,
    store: saved.store,
    consent_marketing: consent.marketing,
    consent_statistics: consent.statistics,
  });

  after(async () => {
    const tasks: Promise<unknown>[] = [];
    const metaEvent = META_EVENTS[lead.form_name];
    if (TRACKING_ALLOWED && consent.marketing && metaEvent) {
      tasks.push(
        sendMetaEvent({
          eventName: metaEvent,
          eventId: lead.event_id,
          eventTime: new Date(lead.created_at),
          actionSource: "website",
          eventSourceUrl: lead.page_url || undefined,
          email: lead.email,
          phone: lead.fields.phone,
          clientIp: ip === "unknown" ? undefined : ip,
          userAgent: lead.user_agent || undefined,
          fbp: lead.fbp,
          fbc: lead.fbc,
          leadId: lead.lead_id,
        }),
      );
    }
    if (TRACKING_ALLOWED && consent.statistics && data.posthog_distinct_id) {
      tasks.push(
        capturePosthogServerEvent(data.posthog_distinct_id, "lead_saved", {
          form_name: lead.form_name,
          lead_id: lead.lead_id,
          event_id: lead.event_id,
          store: saved.store,
        }),
      );
    }
    tasks.push(flushServerLogs());
    await Promise.allSettled(tasks);
  });

  return NextResponse.json({ ok: true, lead_id: leadId, event_id: eventId });
}
