import { CONSENT_READER_SOURCE } from "@/lib/consent/core";
import { gtmConfig, trackingIds } from "@/lib/tracking/env";
import { gtmActive, gtmScriptUrl } from "@/lib/tracking/gtm";

/**
 * The GTM bootstrap: an inline script that runs while the HTML is parsed,
 * before any React effect can add page_view.
 *
 * It always puts the service IDs in the dataLayer and defines gtag(). GTM
 * itself starts only when the visitor has already consented to statistics or
 * marketing (the mz_consent cookie): then the script sets the Consent Mode v2
 * default from that choice and requests gtm.js. Without consent nothing is
 * requested from Google. A choice made on the page starts GTM through
 * lib/tracking/gtm.ts.
 *
 * Without NEXT_PUBLIC_GTM_ID, or outside production, nothing is rendered.
 * There is no <noscript> fallback: without JavaScript there is no consent.
 */
export function GoogleTagManager() {
  if (!gtmActive()) {
    return null;
  }
  const bootstrap =
    "window.dataLayer=window.dataLayer||[];" +
    `window.dataLayer.push(${JSON.stringify(gtmConfig()).replace(/</g, "\\u003c")});` +
    "window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};" +
    "(function(){" +
    `var c=(${CONSENT_READER_SOURCE})(document.cookie,Math.floor(Date.now()/1000));` +
    "if(!c||!(c.s||c.m))return;" +
    "var g='granted',d='denied',a=c.m?g:d;" +
    "window.gtag('consent','default',{ad_storage:a,ad_user_data:a,ad_personalization:a," +
    "analytics_storage:c.s?g:d,functionality_storage:d,personalization_storage:d,security_storage:g});" +
    "window.dataLayer.push({consent_statistics:c.s,consent_marketing:c.m});" +
    "window.__mzGtmStarted=true;" +
    "window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});" +
    "var j=document.createElement('script');j.async=true;" +
    `j.src=${JSON.stringify(gtmScriptUrl(trackingIds.gtm))};` +
    "document.head.appendChild(j);" +
    "})();";

  return <script id="gtm-bootstrap" dangerouslySetInnerHTML={{ __html: bootstrap }} />;
}
