"use client";

import { openConsentSettings } from "@/lib/consent";
import { CONSENT_UI_ENABLED } from "@/lib/tracking/env";

/**
 * Reopens the consent settings panel. Shown wherever the consent banner can
 * appear, so the footer never carries a control that does nothing.
 */
export function CookieSettingsButton({ className }: { className?: string }) {
  if (!CONSENT_UI_ENABLED) {
    return null;
  }
  return (
    <button type="button" className={className} onClick={() => openConsentSettings()}>
      Cookie settings
    </button>
  );
}
