/**
 * Every public identifier the tracking stack reads. A missing value keeps the
 * matching integration inactive. Nothing here is secret.
 */
const clean = (value: string | undefined) => (value ?? "").trim();

export const trackingIds = {
  gtm: clean(process.env.NEXT_PUBLIC_GTM_ID),
  ga4: clean(process.env.NEXT_PUBLIC_GA4_ID),
  cookiebot: clean(process.env.NEXT_PUBLIC_COOKIEBOT_ID),
  clarity: clean(process.env.NEXT_PUBLIC_CLARITY_ID),
  googleAds: clean(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID),
  googleAdsLabelContact: clean(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_CONTACT),
  googleAdsLabelWaitlist: clean(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_WAITLIST),
  googleAdsLabelCheckout: clean(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_CHECKOUT),
  googleAdsLabelContactClick: clean(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_CONTACT_CLICK),
  metaPixel: clean(process.env.NEXT_PUBLIC_META_PIXEL_ID),
  linkedin: clean(process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID),
  linkedinConversionContact: clean(process.env.NEXT_PUBLIC_LINKEDIN_CONVERSION_CONTACT),
  linkedinConversionWaitlist: clean(process.env.NEXT_PUBLIC_LINKEDIN_CONVERSION_WAITLIST),
  posthogKey: clean(process.env.NEXT_PUBLIC_POSTHOG_KEY),
  posthogHost: clean(process.env.NEXT_PUBLIC_POSTHOG_HOST) || "https://eu.i.posthog.com",
} as const;

/**
 * Tracking sends data only from the production deployment. Preview and local
 * builds stay silent unless NEXT_PUBLIC_TRACKING_DEBUG=true.
 */
export const TRACKING_DEBUG = process.env.NEXT_PUBLIC_TRACKING_DEBUG === "true";

export const TRACKING_ENABLED =
  process.env.NEXT_PUBLIC_SITE_ENV === "production" || TRACKING_DEBUG;

/** Path of the first-party reverse proxy to PostHog. See next.config.ts. */
export const POSTHOG_PROXY_PATH = "/ingest";

/** The values the GTM container reads from the dataLayer instead of hardcoded constants. */
export function gtmConfig(): Record<string, string> {
  return {
    ga4_id: trackingIds.ga4,
    cookiebot_id: trackingIds.cookiebot,
    clarity_id: trackingIds.clarity,
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
