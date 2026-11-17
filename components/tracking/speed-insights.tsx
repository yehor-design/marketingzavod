"use client";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { useConsent } from "@/lib/consent/use-consent";

/**
 * Vercel Speed Insights, in the statistics category of the consent spec:
 * its script is added only with statistics consent. Withdrawal reloads the
 * page, which removes it.
 */
export function ConsentedSpeedInsights() {
  const { statistics } = useConsent();
  return statistics ? <SpeedInsights /> : null;
}
