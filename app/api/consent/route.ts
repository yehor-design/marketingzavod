import { after, NextResponse, type NextRequest } from "next/server";
import { consentEvent, consentRecordSchema } from "@/lib/consent/record";
import { clientIp, sameOrigin } from "@/lib/http/request";
import { createRateLimiter } from "@/lib/leads/rate-limit";
import { amplitudeServerAllowed, sendAmplitudeServerEvents } from "@/lib/amplitude-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** A visitor chooses rarely. Twenty a minute from one address is already a burst. */
const allow = createRateLimiter(20, 60_000);

/**
 * The consent log (spec 7.6). The browser posts each choice here; the record
 * goes to Amplitude as a consent_recorded event (lib/consent/record.ts). The
 * client address is used only for the rate limit and is not stored.
 */
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  if (!allow(clientIp(request))) {
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
  const parsed = consentRecordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }
  const record = parsed.data;
  if (record.decided_at > Math.floor(Date.now() / 1000) + 300) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  if (amplitudeServerAllowed()) {
    after(() => sendAmplitudeServerEvents([consentEvent(record)]));
  }
  return new NextResponse(null, { status: 204 });
}
