/**
 * Sends a choice to the consent log. Fire and forget: a failure never stops
 * the choice from being stored, and sendBeacon survives the reload that
 * follows a withdrawal.
 */
import { CONSENT_LOG_PATH, type ConsentRecord } from "@/lib/consent/record";

export function sendConsentRecord(record: ConsentRecord) {
  if (typeof navigator === "undefined") {
    return;
  }
  const body = JSON.stringify(record);
  try {
    if (typeof navigator.sendBeacon === "function") {
      const queued = navigator.sendBeacon(CONSENT_LOG_PATH, new Blob([body], { type: "application/json" }));
      if (queued) {
        return;
      }
    }
    void fetch(CONSENT_LOG_PATH, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // Logging must never break the choice itself.
  }
}
