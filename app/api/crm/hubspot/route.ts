import { NextResponse, type NextRequest } from "next/server";
import { conversionForStage } from "@/lib/offline/config";
import { getDeal, getDealContact, markSent, sentKeys, stageEnteredAt } from "@/lib/offline/hubspot-deals";
import { verifyHubspotSignature } from "@/lib/offline/signature";
import { sendMetaEvent } from "@/lib/meta/capi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type HubspotEvent = {
  subscriptionType?: string;
  propertyName?: string;
  propertyValue?: string;
  objectId?: number | string;
};

/**
 * HubSpot webhook for deal stage changes. When a deal reaches a conversion
 * stage, the matching event goes to Meta through the Conversions API with
 * action_source "system_generated". Google Ads reads the same conversions from
 * /api/offline-conversions/google-ads on its own schedule.
 *
 * Each conversion is recorded on the deal, so moving a deal back and forth
 * never reports it twice.
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
      const leadId = deal.properties.wb_lead_id;
      if (!leadId) {
        results.push({ deal: dealId, status: "skipped_no_lead" });
        continue;
      }
      if (sentKeys(deal).includes(conversion.key)) {
        results.push({ deal: dealId, status: "already_sent" });
        continue;
      }
      const contact = await getDealContact(token, dealId);
      if (!contact || contact.properties.wb_consent_marketing !== "true") {
        results.push({ deal: dealId, status: "skipped_no_consent" });
        continue;
      }
      const sent = await sendMetaEvent({
        eventName: conversion.metaEvent,
        // Deterministic, so a retried delivery deduplicates on Meta's side too.
        eventId: `${leadId}:${conversion.key}`,
        eventTime: new Date(stageEnteredAt(deal, conversion.stage) ?? Date.now()),
        actionSource: "system_generated",
        email: contact.properties.email ?? undefined,
        phone: contact.properties.phone ?? undefined,
        fbp: contact.properties.wb_fbp ?? undefined,
        fbc: contact.properties.wb_fbc ?? undefined,
        leadId,
        customData: {
          event_source: "crm",
          lead_event_source: "HubSpot",
          value: conversion.value,
          currency: conversion.currency,
        },
      });
      // Marked when Meta accepted it, or when Meta is not connected at all.
      if (sent.sent || sent.reason === "not_configured") {
        await markSent(token, deal, conversion.key);
      }
      results.push({ deal: dealId, status: sent.sent ? "sent" : sent.reason });
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
