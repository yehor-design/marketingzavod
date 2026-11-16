import { NextResponse, type NextRequest } from "next/server";
import { offlineConversions } from "@/lib/offline/config";
import { buildGoogleAdsCsv, type GoogleAdsRow } from "@/lib/offline/google-ads-csv";
import { getDealContact, searchConvertedDeals, stageEnteredAt } from "@/lib/offline/hubspot-deals";
import { secretMatches } from "@/lib/offline/signature";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Google Ads accepts clicks up to 90 days old. */
const LOOKBACK_DAYS = 90;

/** Google Ads sends HTTP Basic credentials. A bearer token works for manual checks. */
function authorized(request: NextRequest): boolean {
  const secret = process.env.OFFLINE_CONVERSIONS_SECRET?.trim();
  const header = request.headers.get("authorization") ?? "";
  if (header.startsWith("Bearer ")) {
    return secretMatches(secret, header.slice(7));
  }
  if (header.startsWith("Basic ")) {
    try {
      const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
      return secretMatches(secret, decoded.slice(decoded.indexOf(":") + 1));
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * The offline conversion file for a Google Ads scheduled upload. It is built
 * from HubSpot on every request and holds no state: deals currently in a
 * conversion stage, for leads who agreed to marketing.
 */
export async function GET(request: NextRequest) {
  const token = process.env.HUBSPOT_ACCESS_TOKEN?.trim();
  if (!process.env.OFFLINE_CONVERSIONS_SECRET?.trim() || !token) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }
  if (!authorized(request)) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="offline-conversions"' },
    });
  }

  const since = Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000;
  const rows: GoogleAdsRow[] = [];
  try {
    const deals = await searchConvertedDeals(token, since);
    for (const deal of deals) {
      const contact = await getDealContact(token, deal.id);
      if (!contact || contact.properties.wb_consent_marketing !== "true") {
        continue;
      }
      const properties = contact.properties;
      const clickIds = {
        gclid: properties.wb_gclid ?? undefined,
        gbraid: properties.wb_gbraid ?? undefined,
        wbraid: properties.wb_wbraid ?? undefined,
      };
      const email = properties.email ?? undefined;
      if (!clickIds.gclid && !clickIds.gbraid && !clickIds.wbraid && !email) {
        continue;
      }
      // A won deal also passed through the qualified stage. Report each stage it entered.
      for (const conversion of offlineConversions()) {
        const enteredAt = stageEnteredAt(deal, conversion.stage);
        if (!enteredAt || Date.parse(enteredAt) < since) {
          continue;
        }
        rows.push({
          ...clickIds,
          email,
          conversionName: conversion.googleAdsName,
          conversionTime: enteredAt,
          value: conversion.value,
          currency: conversion.currency,
        });
      }
    }
  } catch (error) {
    console.error(
      JSON.stringify({
        type: "offline_conversion_error",
        target: "google_ads",
        message: error instanceof Error ? error.message : String(error),
      }),
    );
    return NextResponse.json({ ok: false, error: "crm_unavailable" }, { status: 502 });
  }

  return new NextResponse(buildGoogleAdsCsv(rows), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
