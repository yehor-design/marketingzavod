/**
 * The consent log: one record per choice, so the site can show when a choice
 * was made, what it was and under which version of the texts (GDPR art. 7(1)).
 *
 * A record carries no personal data: the consent ID is random and lives only
 * in the visitor's mz_consent cookie. No IP address or user agent is stored
 * with it. The record goes to Amplitude as a consent_recorded event, sent by
 * the server, under the consent ID instead of a browser's device ID.
 */
import { z } from "zod";
import type { AmplitudeServerEvent } from "@/lib/amplitude-server";

export const CONSENT_LOG_PATH = "/api/consent";
export const CONSENT_LOG_EVENT = "consent_recorded";

export const consentRecordSchema = z.object({
  id: z.string().regex(/^[0-9a-f]{32}$/),
  version: z.number().int().min(1).max(9999),
  statistics: z.boolean(),
  marketing: z.boolean(),
  source: z.enum(["banner", "settings"]),
  /** Unix seconds. */
  decided_at: z.number().int().positive(),
});

export type ConsentRecord = z.infer<typeof consentRecordSchema>;

/** The Amplitude event for a record. Sent again, it is dropped as a duplicate (insert_id). */
export function consentEvent(record: ConsentRecord): AmplitudeServerEvent {
  return {
    event_type: CONSENT_LOG_EVENT,
    device_id: record.id,
    insert_id: `${record.id}-${record.decided_at}`,
    time: record.decided_at * 1000,
    event_properties: {
      version: record.version,
      statistics: record.statistics,
      marketing: record.marketing,
      source: record.source,
      decided_at: new Date(record.decided_at * 1000).toISOString(),
    },
  };
}
