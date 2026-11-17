/**
 * The consent log: one record per choice, so the site can show when a choice
 * was made, what it was and under which version of the texts (GDPR art. 7(1)).
 *
 * A record carries no personal data: the consent ID is random and lives only
 * in the visitor's wb_consent cookie. No IP address, user agent or person
 * profile is stored with it.
 */
import { z } from "zod";

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

/**
 * Properties of the PostHog event. The event creates no person profile and
 * skips GeoIP, so nothing ties it to a person.
 */
export function consentEventProperties(record: ConsentRecord): Record<string, string | number | boolean> {
  return {
    version: record.version,
    statistics: record.statistics,
    marketing: record.marketing,
    source: record.source,
    decided_at: new Date(record.decided_at * 1000).toISOString(),
    $process_person_profile: false,
    $geoip_disable: true,
  };
}
