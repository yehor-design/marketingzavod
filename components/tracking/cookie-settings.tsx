"use client";

import { openConsentSettings } from "@/lib/consent";
import { TRACKING_ENABLED, trackingIds } from "@/lib/tracking/env";

/**
 * Reopens the Cookiebot dialog. Shown only when Cookiebot is configured, so the
 * footer never carries a control that does nothing.
 */
export function CookieSettingsButton({ className }: { className?: string }) {
  if (!TRACKING_ENABLED || !trackingIds.cookiebot || !trackingIds.gtm) {
    return null;
  }
  return (
    <button type="button" className={className} onClick={() => openConsentSettings()}>
      Cookie settings
    </button>
  );
}
