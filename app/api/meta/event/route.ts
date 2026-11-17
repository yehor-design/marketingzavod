import { after, NextResponse, type NextRequest } from "next/server";
import { clientIp, sameOrigin } from "@/lib/http/request";
import { createRateLimiter } from "@/lib/leads/rate-limit";
import { sendMetaEvent } from "@/lib/meta/capi";
import {
  browserId,
  clickId,
  FB_COOKIE_MAX_AGE_SECONDS,
  marketingAllowed,
  relayEvent,
  relayRequestSchema,
  sameSitePage,
} from "@/lib/meta/relay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** A page sends a handful of these per view. Sixty a minute from one address is a burst. */
const allow = createRateLimiter(60, 60_000);

const TRACKING_ALLOWED =
  process.env.VERCEL_ENV === "production" || process.env.NEXT_PUBLIC_TRACKING_DEBUG === "true";

/**
 * The Meta relay used with Zaraz (lib/tracking/meta-relay.ts). The browser
 * posts a standard event; this handler sends it to the Conversions API with
 * the visitor's address, user agent and _fbp/_fbc, like the pixel would.
 * It acts only with marketing consent in the wb_consent cookie, so a request
 * from a visitor who did not agree changes nothing and sets no cookie.
 */
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
  const parsed = relayRequestSchema.safeParse(body);
  if (!parsed.success || !sameSitePage(parsed.data.page_url, request.headers.get("host"))) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  if (!TRACKING_ALLOWED || !marketingAllowed(request.headers.get("cookie") ?? "")) {
    return new NextResponse(null, { status: 204 });
  }

  const now = new Date();
  const fbp = browserId(request.cookies.get("_fbp")?.value, now.getTime());
  const fbc = clickId(request.cookies.get("_fbc")?.value, parsed.data.page_url, now.getTime());
  const event = relayEvent(parsed.data, {
    now,
    clientIp: ip === "unknown" ? undefined : ip,
    userAgent: (request.headers.get("user-agent") ?? "").slice(0, 400) || undefined,
    fbp: fbp.value,
    fbc: fbc.value,
  });
  after(() => sendMetaEvent(event));

  const response = new NextResponse(null, { status: 204 });
  // Not HttpOnly: the consent cleanup in the browser must be able to remove them.
  const cookie = {
    maxAge: FB_COOKIE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax" as const,
    secure: request.nextUrl.protocol === "https:",
  };
  if (fbp.created) {
    response.cookies.set("_fbp", fbp.value, cookie);
  }
  if (fbc.created && fbc.value) {
    response.cookies.set("_fbc", fbc.value, cookie);
  }
  return response;
}
