import { expect, test, type Page } from "@playwright/test";
import { BG_SITE_METADATA } from "@/content/bg/metadata";
import { SITE_URL } from "@/lib/site";

async function readJsonLdObjects(page: Page): Promise<Array<Record<string, unknown>>> {
  const scripts = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((nodes) => nodes.map((node) => node.textContent ?? ""));
  return scripts.map((raw) => JSON.parse(raw) as Record<string, unknown>);
}

test.describe("BG structured data JSON-LD (CR-22, CR-52, CR-54, CR-A13)", () => {
  test("home page renders exactly one Organization and one WebSite with CR-22 fields", async ({
    page,
  }) => {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    const blocks = await readJsonLdObjects(page);
    const orgs = blocks.filter((item) => item["@type"] === "Organization");
    const sites = blocks.filter((item) => item["@type"] === "WebSite");

    expect(orgs).toHaveLength(1);
    expect(sites).toHaveLength(1);

    const org = orgs[0];
    expect(org["@context"]).toBe("https://schema.org");
    expect(org.name).toBe(BG_SITE_METADATA.organization.name);
    expect(org.alternateName).toBe(BG_SITE_METADATA.organization.alternateName);
    expect(org.url).toBe(SITE_URL);
    expect(org.email).toBe(BG_SITE_METADATA.organization.email);
    expect(org.address).toEqual({
      "@type": "PostalAddress",
      addressLocality: "Варна",
      addressCountry: "BG",
    });
    expect(org.areaServed).toEqual({
      "@type": "Country",
      name: "България",
    });
    expect(org.founder).toEqual({
      "@type": "Person",
      name: "Егор Гончаренко",
      sameAs: "https://www.linkedin.com/in/yehor-honcharenko",
    });
    for (const forbidden of ["logo", "telephone", "legalName", "taxID", "vatID"]) {
      expect(forbidden in org).toBe(false);
    }

    const site = sites[0];
    expect(site["@context"]).toBe("https://schema.org");
    expect(site.name).toBe(BG_SITE_METADATA.siteName);
    expect(site.alternateName).toBe(BG_SITE_METADATA.alternateName);
    expect(site.url).toBe(SITE_URL);
    expect(site.inLanguage).toBe("bg");
  });

  test("non-home BG pages render Organization without duplicating WebSite", async ({ page }) => {
    const response = await page.goto("/blog", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    const blocks = await readJsonLdObjects(page);
    const orgs = blocks.filter((item) => item["@type"] === "Organization");
    const sites = blocks.filter((item) => item["@type"] === "WebSite");

    expect(orgs).toHaveLength(1);
    expect(sites).toHaveLength(0);
    expect(orgs[0].name).toBe(BG_SITE_METADATA.organization.name);
  });
});
