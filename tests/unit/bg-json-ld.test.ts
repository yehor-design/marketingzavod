import { describe, expect, it } from "vitest";
import { COMPANY } from "@/content/bg/company";
import { BG_SITE_METADATA } from "@/content/bg/metadata";
import {
  BG_ORGANIZATION_ID,
  BG_WEBSITE_ID,
  buildBgOrganizationJsonLd,
  buildBgWebSiteJsonLd,
} from "@/lib/bg-json-ld";
import { SITE_URL } from "@/lib/site";

const FORBIDDEN_ORG_FIELDS = [
  "logo",
  "telephone",
  "legalName",
  "taxID",
  "vatID",
  "streetAddress",
  "aggregateRating",
  "review",
] as const;

describe("lib/bg-json-ld.ts (CR-22, CR-52, CR-54, CR-A13)", () => {
  it("builds valid Organization JSON-LD with verbatim CR-22 fields and no forbidden fields", () => {
    const org = buildBgOrganizationJsonLd();

    expect(org).toEqual({
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": BG_ORGANIZATION_ID,
      name: "Маркетинг Завод",
      alternateName: "Marketing Zavod",
      description: BG_SITE_METADATA.defaultDescription,
      url: SITE_URL,
      email: COMPANY.email,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Варна",
        addressCountry: "BG",
      },
      areaServed: {
        "@type": "Country",
        name: "България",
      },
      founder: {
        "@type": "Person",
        name: "Егор Гончаренко",
        sameAs: "https://www.linkedin.com/in/yehor-honcharenko",
      },
      sameAs: ["https://www.linkedin.com/in/yehor-honcharenko"],
    });

    for (const key of FORBIDDEN_ORG_FIELDS) {
      expect(key in org, `Organization must not include ${key} yet`).toBe(false);
    }
    const address = org.address as Record<string, unknown>;
    expect("streetAddress" in address).toBe(false);
  });

  it("builds valid WebSite JSON-LD referencing the BG organization publisher", () => {
    const site = buildBgWebSiteJsonLd();

    expect(site).toEqual({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": BG_WEBSITE_ID,
      name: "Маркетинг Завод",
      alternateName: "Marketing Zavod",
      url: SITE_URL,
      description: BG_SITE_METADATA.defaultDescription,
      inLanguage: "bg",
      publisher: { "@id": BG_ORGANIZATION_ID },
    });
  });
});
