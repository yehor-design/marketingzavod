"use client";

import { CONSENT_TOOL_READY, openConsentSettings } from "@/lib/consent";
import { TRACKING_ENABLED } from "@/lib/tracking/env";

/**
 * Reopens the consent dialog. Shown only once the site has a consent tool, so
 * the footer never carries a control that does nothing.
 */
export function CookieSettingsButton({ className }: { className?: string }) {
  if (!TRACKING_ENABLED || !CONSENT_TOOL_READY) {
    return null;
  }
  return (
    <button type="button" className={className} onClick={() => openConsentSettings()}>
      Cookie settings
    </button>
  );
}
