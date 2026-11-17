import { NextResponse, type NextRequest } from "next/server";
import { conversionForStage } from "@/lib/offline/config";
import { getDeal, stageEnteredAt } from "@/lib/offline/hubspot-deals";
import { sendDealConversion } from "@/lib/offline/meta-sync";
import { verifyHubspotSignature } from "@/lib/offline/signature";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type HubspotEvent = {
  subscriptionType?: string;
  propertyName?: string;
  propertyValue?: string;
  objectId?: number | string;
};

/**
 * HubSpot webhook for deal stage changes: reports a conversion to Meta at
 * once (lib/offline/meta-sync.ts). It needs a HubSpot app with webhooks and
 * HUBSPOT_CLIENT_SECRET. Without them the daily sync in
 * /api/cron/offline-conversions reports the same conversions. Google Ads
 * reads them from /api/offline-conversions/google-ads on its own schedule.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.HUBSPOT_CLIENT_SECRET?.trim();
  const token = process.env.HUBSPOT_ACCESS_TOKEN?.trim();
  if (!secret || !token) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const body = await request.text();
  // HubSpot signs the public URL. Behind Vercel's proxy the host comes from the headers.
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const url = `https://${host}${request.nextUrl.pathname}${request.nextUrl.search}`;
  const valid = verifyHubspotSignature({
    secret,
    method: "POST",
    url,
    body,
    timestamp: request.headers.get("x-hubspot-request-timestamp"),
    signature: request.headers.get("x-hubspot-signature-v3"),
  });
  if (!valid) {
    return NextResponse.json({ ok: false, error: "invalid_signature" }, { status: 401 });
  }

  let events: HubspotEvent[];
  try {
    const parsed = JSON.parse(body);
    events = Array.isArray(parsed) ? parsed : [];
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const results: Array<Record<string, string>> = [];
  for (const event of events) {
    if (event.subscriptionType !== "deal.propertyChange" || event.propertyName !== "dealstage") {
      continue;
    }
    const conversion = conversionForStage(String(event.propertyValue ?? ""));
    const dealId = String(event.objectId ?? "");
    if (!conversion || !dealId) {
      continue;
    }
    try {
      const deal = await getDeal(token, dealId);
      const status = await sendDealConversion(
        token,
        deal,
        conversion,
        stageEnteredAt(deal, conversion.stage),
      );
      results.push({ deal: dealId, status });
    } catch (error) {
      console.error(
        JSON.stringify({
          type: "offline_conversion_error",
          deal: dealId,
          message: error instanceof Error ? error.message : String(error),
        }),
      );
      results.push({ deal: dealId, status: "error" });
    }
  }

  return NextResponse.json({ ok: true, results });
}
