import { COMPANY } from "@/content/bg/company";
import { BG_SITE_METADATA } from "@/content/bg/metadata";
import { SITE_URL } from "@/lib/site";

export const BG_ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const BG_WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * Builds Schema.org `Organization` JSON-LD for the Bulgarian edition (CR-22, CR-54).
 * Omits `logo` until ZAV-187, `telephone` per 25.11.2026 decision, and legal
 * entity fields (`legalName`, `taxID`, `vatID`, `streetAddress`) until ZAV-82.
 */
export function buildBgOrganizationJsonLd(): Record<string, unknown> {
  const org = BG_SITE_METADATA.organization;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": BG_ORGANIZATION_ID,
    name: org.name,
    alternateName: org.alternateName,
    description: BG_SITE_METADATA.defaultDescription,
    url: SITE_URL,
    email: COMPANY.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: org.city,
      addressCountry: org.countryCode,
    },
    areaServed: {
      "@type": "Country",
      name: org.areaServed,
    },
    founder: {
      "@type": "Person",
      name: org.founderName,
      sameAs: org.founderUrl,
    },
    sameAs: [COMPANY.linkedinHref],
  };
}

/**
 * Builds Schema.org `WebSite` JSON-LD for the Bulgarian homepage (CR-22, CR-52).
 */
export function buildBgWebSiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": BG_WEBSITE_ID,
    name: BG_SITE_METADATA.siteName,
    alternateName: BG_SITE_METADATA.alternateName,
    url: SITE_URL,
    description: BG_SITE_METADATA.defaultDescription,
    inLanguage: BG_SITE_METADATA.lang,
    publisher: { "@id": BG_ORGANIZATION_ID },
  };
}
