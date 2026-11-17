/**
 * Every public identifier the tracking stack reads. A missing value keeps the
 * matching integration inactive. Nothing here is secret.
 */
import { CONSENT_TOOL_READY } from "@/lib/consent";

const clean = (value: string | undefined) => (value ?? "").trim();

export const trackingIds = {
  gtm: clean(process.env.NEXT_PUBLIC_GTM_ID),
  ga4: clean(process.env.NEXT_PUBLIC_GA4_ID),
  googleAds: clean(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID),
  googleAdsLabelContact: clean(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_CONTACT),
  googleAdsLabelWaitlist: clean(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_WAITLIST),
  googleAdsLabelCheckout: clean(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_CHECKOUT),
  googleAdsLabelContactClick: clean(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_CONTACT_CLICK),
  metaPixel: clean(process.env.NEXT_PUBLIC_META_PIXEL_ID),
  linkedin: clean(process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID),
  linkedinConversionContact: clean(process.env.NEXT_PUBLIC_LINKEDIN_CONVERSION_CONTACT),
  linkedinConversionWaitlist: clean(process.env.NEXT_PUBLIC_LINKEDIN_CONVERSION_WAITLIST),
  // The PostHog wizard named the same public key NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN.
  posthogKey:
    clean(process.env.NEXT_PUBLIC_POSTHOG_KEY) || clean(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN),
  amplitude: clean(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY),
  posthogHost: clean(process.env.NEXT_PUBLIC_POSTHOG_HOST) || "https://eu.i.posthog.com",
  /** The Cloudflare-proxied host that serves Zaraz, for example z.heywowboy.com. */
  zarazHost: clean(process.env.NEXT_PUBLIC_ZARAZ_HOST),
} as const;

/**
 * Which tag manager carries the events to GA4, Google Ads, Meta and LinkedIn:
 * Google Tag Manager (the default) or Cloudflare Zaraz. Switching back is one
 * variable and a redeploy. PostHog and Amplitude are loaded by the site
 * itself and do not depend on it.
 */
export type TagManager = "gtm" | "zaraz";

export const TAG_MANAGER: TagManager =
  clean(process.env.NEXT_PUBLIC_TAG_MANAGER) === "zaraz" ? "zaraz" : "gtm";

/**
 * Tracking sends data only from the production deployment. Preview and local
 * builds stay silent unless NEXT_PUBLIC_TRACKING_DEBUG=true.
 */
export const TRACKING_DEBUG = process.env.NEXT_PUBLIC_TRACKING_DEBUG === "true";

export const TRACKING_ENABLED =
  process.env.NEXT_PUBLIC_SITE_ENV === "production" || TRACKING_DEBUG;

/**
 * Where the consent banner and the "Cookie settings" control appear: wherever
 * tracking runs, once the consent tool ships. Debug builds (preview, tests)
 * show them before that, so they can be checked.
 */
export const CONSENT_UI_ENABLED = TRACKING_ENABLED && (CONSENT_TOOL_READY || TRACKING_DEBUG);

/** Path of the first-party reverse proxy to PostHog. See next.config.ts. */
export const POSTHOG_PROXY_PATH = "/ingest";

/** The values the GTM container reads from the dataLayer instead of hardcoded constants. */
export function gtmConfig(): Record<string, string> {
  return {
    ga4_id: trackingIds.ga4,
    consent_ready: CONSENT_TOOL_READY ? "true" : "false",
    google_ads_id: trackingIds.googleAds,
    google_ads_label_contact: trackingIds.googleAdsLabelContact,
    google_ads_label_waitlist: trackingIds.googleAdsLabelWaitlist,
    google_ads_label_checkout: trackingIds.googleAdsLabelCheckout,
    google_ads_label_contact_click: trackingIds.googleAdsLabelContactClick,
    meta_pixel_id: trackingIds.metaPixel,
    linkedin_partner_id: trackingIds.linkedin,
    linkedin_conversion_contact: trackingIds.linkedinConversionContact,
    linkedin_conversion_waitlist: trackingIds.linkedinConversionWaitlist,
    tracking_debug: TRACKING_DEBUG ? "true" : "false",
  };
}
