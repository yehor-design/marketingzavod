import Script from "next/script";
import { gtmConfig, TRACKING_ENABLED, trackingIds } from "@/lib/tracking/env";

const GTM_ID = /^GTM-[A-Z0-9]+$/;

function active(): boolean {
  return TRACKING_ENABLED && GTM_ID.test(trackingIds.gtm);
}

/**
 * Loads the GTM container. The official snippet is split in two on purpose:
 *
 * 1. An inline script that runs while the HTML is parsed. It puts the service
 *    IDs, the Consent Mode v2 default (everything denied) and the gtm.js event
 *    in the dataLayer before any React effect can add page_view.
 * 2. The container itself, fetched after the page is interactive.
 *
 * Consent is only ever granted by the site's consent tool, see lib/consent.
 * Without NEXT_PUBLIC_GTM_ID, or outside production, nothing is rendered.
 */
const CONSENT_DEFAULT = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
  functionality_storage: "denied",
  personalization_storage: "denied",
  security_storage: "granted",
};

export function GoogleTagManager() {
  if (!active()) {
    return null;
  }
  const bootstrap =
    "window.dataLayer=window.dataLayer||[];" +
    `window.dataLayer.push(${JSON.stringify(gtmConfig()).replace(/</g, "\\u003c")});` +
    "window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};" +
    `window.gtag('consent','default',${JSON.stringify(CONSENT_DEFAULT)});` +
    "window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});";

  return (
    <>
      <script id="gtm-bootstrap" dangerouslySetInnerHTML={{ __html: bootstrap }} />
      <Script
        id="gtm-container"
        src={`https://www.googletagmanager.com/gtm.js?id=${trackingIds.gtm}`}
        strategy="afterInteractive"
      />
    </>
  );
}

export function GoogleTagManagerNoscript() {
  if (!active()) {
    return null;
  }
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${trackingIds.gtm}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
