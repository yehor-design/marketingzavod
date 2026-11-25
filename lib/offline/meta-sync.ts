/**
 * Offline conversions to Meta: a deal that reached a conversion stage is
 * reported through the Conversions API with action_source "system_generated".
 *
 * Two triggers share this code. The daily sync (/api/cron/offline-conversions)
 * works with any HubSpot account. The webhook (/api/crm/hubspot) reports at
 * once, but needs a HubSpot app with webhooks, which new accounts can only
 * build as a project-based app.
 *
 * Each reported conversion is written to the deal's mz_offline_sent, so a
 * second run, a webhook retry or a deal moved back and forth never reports it
 * twice. The event_id is deterministic as well, so Meta deduplicates too.
 */
import { hubspotFetch } from "@/lib/leads/hubspot";
import { sendMetaEvent } from "@/lib/meta/capi";
import { offlineConversions, type OfflineConversion } from "@/lib/offline/config";
import {
  dealProperties,
  getDealContact,
  markSent,
  sentKeys,
  stageEnteredAt,
  type DealRecord,
} from "@/lib/offline/hubspot-deals";

/** Meta rejects server events older than seven days. */
export const META_MAX_EVENT_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export type ConversionStatus =
  | "sent"
  | "already_sent"
  | "skipped_no_lead"
  | "skipped_no_consent"
  | "skipped_too_old"
  | "not_configured"
  | "error";

/** The conversions a deal has reached, by the dates it entered each stage. */
export function reachedConversions(deal: DealRecord): Array<{ conversion: OfflineConversion; at: string }> {
  return offlineConversions().flatMap((conversion) => {
    const raw =
      stageEnteredAt(deal, conversion.stage) ??
      (deal.properties.dealstage === conversion.stage ? (deal.properties.hs_lastmodifieddate ?? null) : null);
    if (!raw) {
      return [];
    }
    const time = /^\d+$/.test(raw) ? Number(raw) : Date.parse(raw);
    return Number.isNaN(time) ? [] : [{ conversion, at: new Date(time).toISOString() }];
  });
}

/** Reports one conversion of one deal. Never throws. */
export async function sendDealConversion(
  token: string,
  deal: DealRecord,
  conversion: OfflineConversion,
  enteredAt: string | null,
  now: number = Date.now(),
): Promise<ConversionStatus> {
  try {
    const leadId = deal.properties.mz_lead_id;
    if (!leadId) {
      return "skipped_no_lead";
    }
    if (sentKeys(deal).includes(conversion.key)) {
      return "already_sent";
    }
    const eventTime = enteredAt ? Date.parse(enteredAt) : now;
    if (now - eventTime > META_MAX_EVENT_AGE_MS) {
      return "skipped_too_old";
    }
    const contact = await getDealContact(token, deal.id);
    if (!contact || contact.properties.mz_consent_marketing !== "true") {
      return "skipped_no_consent";
    }
    const sent = await sendMetaEvent({
      eventName: conversion.metaEvent,
      eventId: `${leadId}:${conversion.key}`,
      eventTime: new Date(eventTime),
      actionSource: "system_generated",
      email: contact.properties.email ?? undefined,
      phone: contact.properties.phone ?? undefined,
      fbp: contact.properties.mz_fbp ?? undefined,
      fbc: contact.properties.mz_fbc ?? undefined,
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
      deal.properties.mz_offline_sent = [...new Set([...sentKeys(deal), conversion.key])].join(",");
    }
    return sent.sent ? "sent" : sent.reason;
  } catch (error) {
    console.error(
      JSON.stringify({
        type: "offline_conversion_error",
        deal: deal.id,
        conversion: conversion.key,
        message: error instanceof Error ? error.message : String(error),
      }),
    );
    return "error";
  }
}

/** Website deals changed since `sinceMs`, in any stage. */
export async function searchChangedDeals(token: string, sinceMs: number): Promise<DealRecord[]> {
  const deals: DealRecord[] = [];
  let after: string | undefined;
  for (let page = 0; page < 10; page += 1) {
    const result = await hubspotFetch<{ results: DealRecord[]; paging?: { next?: { after: string } } }>(
      token,
      "/crm/v3/objects/deals/search",
      {
        method: "POST",
        body: {
          filterGroups: [
            {
              filters: [
                { propertyName: "hs_lastmodifieddate", operator: "GTE", value: String(sinceMs) },
                { propertyName: "mz_lead_id", operator: "HAS_PROPERTY" },
              ],
            },
          ],
          properties: dealProperties(),
          limit: 100,
          ...(after ? { after } : {}),
        },
      },
    );
    deals.push(...result.results);
    after = result.paging?.next?.after;
    if (!after) {
      break;
    }
  }
  return deals;
}

/**
 * Reports every conversion reached by a deal changed in the last seven days.
 * A deal that went from qualified to won between two runs reports both.
 */
export async function syncMetaOfflineConversions(
  token: string,
  now: number = Date.now(),
): Promise<Array<{ deal: string; conversion: string; status: ConversionStatus }>> {
  const deals = await searchChangedDeals(token, now - META_MAX_EVENT_AGE_MS);
  const results: Array<{ deal: string; conversion: string; status: ConversionStatus }> = [];
  for (const deal of deals) {
    for (const { conversion, at } of reachedConversions(deal)) {
      if (sentKeys(deal).includes(conversion.key)) {
        continue;
      }
      const status = await sendDealConversion(token, deal, conversion, at, now);
      results.push({ deal: deal.id, conversion: conversion.key, status });
    }
  }
  return results;
}
