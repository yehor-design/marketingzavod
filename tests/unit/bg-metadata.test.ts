import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  BG_CASE_TEMPLATE_METADATA,
  BG_ROUTE_METADATA,
  BG_SITE_METADATA,
  findBgMetadataRouteByPath,
  isBgRouteIndexable,
  stripBgTitleSuffix,
  type BgMetadataRouteKey,
  type BgRouteMetadataEntry,
} from "@/content/bg/metadata";
import { bgPageMetadata, pageMetadata } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const FILE_30_PATH = path.join(process.cwd(), "docs", "site-texts", "30-metadani-saytu.md");
const UKRAINIAN_LETTERS = /[іїєґІЇЄҐ]/;
const BRACKET_PLACEHOLDERS = /[\[\]]/;
const SERVICE_LABELS = [/\bОснова\b/, /\bПримітка\b/, /\bПублікувати\b/, /\bдля перевірки\b/i];

function readNormalizedFile30(): string {
  const raw = fs.readFileSync(FILE_30_PATH, "utf8");
  return raw
    .replace(/\\\|/g, "|")
    .replace(/[\s\u00A0]+/g, " ")
    .trim();
}

function normalizeWhitespace(value: string): string {
  return value.replace(/[\s\u00A0]+/g, " ").trim();
}

function collectStrings(value: unknown, prefix: string): Array<{ path: string; value: string }> {
  if (typeof value === "string") {
    return [{ path: prefix, value }];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectStrings(item, `${prefix}[${index}]`));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) => {
      if (
        key === "source" ||
        key === "gate" ||
        key === "type" ||
        key === "lang" ||
        key === "locale" ||
        key === "countryCode"
      ) {
        return [];
      }
      return collectStrings(child, prefix ? `${prefix}.${key}` : key);
    });
  }
  return [];
}

describe("content/bg/metadata.ts verbatim & CR-51 / CR-A10 validation", () => {
  const docText = readNormalizedFile30();

  it("verifies every string in BG_SITE_METADATA, BG_CASE_TEMPLATE_METADATA, and BG_ROUTE_METADATA is verbatim in 30-metadani-saytu.md", () => {
    const entries = [
      ...collectStrings(BG_SITE_METADATA, "BG_SITE_METADATA"),
      ...collectStrings(BG_CASE_TEMPLATE_METADATA, "BG_CASE_TEMPLATE_METADATA"),
      ...collectStrings(BG_ROUTE_METADATA, "BG_ROUTE_METADATA"),
    ];
    expect(entries.length).toBeGreaterThan(50);

    for (const entry of entries) {
      expect(entry.value, `${entry.path} contains Ukrainian letters`).not.toMatch(UKRAINIAN_LETTERS);
      expect(entry.value, `${entry.path} contains bracket placeholders`).not.toMatch(
        BRACKET_PLACEHOLDERS,
      );
      for (const forbidden of SERVICE_LABELS) {
        expect(entry.value, `${entry.path} contains service label ${forbidden}`).not.toMatch(
          forbidden,
        );
      }

      const normalized = normalizeWhitespace(entry.value);
      expect(
        docText.includes(normalized),
        `${entry.path} not found verbatim in docs/site-texts/30-metadani-saytu.md:\n  "${entry.value}"`,
      ).toBe(true);
    }
  });

  it("enforces CR-51 length, uniqueness, and no-price-on-home-card rules", () => {
    expect(BG_SITE_METADATA.defaultTitle.length).toBeLessThanOrEqual(60);
    expect(BG_SITE_METADATA.defaultDescription.length).toBeGreaterThanOrEqual(100);
    expect(BG_SITE_METADATA.defaultDescription.length).toBeLessThanOrEqual(160);

    // CR-A10: home share card description must not contain prices or euro sign
    expect(BG_SITE_METADATA.homeCard.description).not.toContain("€");
    expect(BG_SITE_METADATA.homeCard.description).not.toMatch(/\d+\s*(€|лв)/i);

    const seenTitles = new Set<string>();
    const seenDescriptions = new Set<string>();

    for (const [key, entry] of Object.entries(BG_ROUTE_METADATA) as Array<
      [BgMetadataRouteKey, BgRouteMetadataEntry]
    >) {
      expect(entry.title.length, `${key}.title exceeds 60 chars (${entry.title.length})`).toBeLessThanOrEqual(
        60,
      );

      if (entry.inSearch) {
        expect(entry.description, `${key} is inSearch but missing description`).not.toBeNull();
        const desc = entry.description!;
        expect(desc.length, `${key}.description too short (${desc.length})`).toBeGreaterThanOrEqual(
          100,
        );
        expect(desc.length, `${key}.description too long (${desc.length})`).toBeLessThanOrEqual(160);

        expect(seenTitles.has(entry.title), `Duplicate title: ${entry.title}`).toBe(false);
        expect(seenDescriptions.has(desc), `Duplicate description on ${key}`).toBe(false);
        seenTitles.add(entry.title);
        seenDescriptions.add(desc);
      }
    }
  });

  it("derives indexability from route flags and publication gates (CR-23)", () => {
    expect(isBgRouteIndexable("home")).toBe(true);
    expect(isBgRouteIndexable("tseni")).toBe(true);
    expect(isBgRouteIndexable("blagodarim")).toBe(false);
    expect(isBgRouteIndexable("notFound")).toBe(false);

    // Gated routes default to closed until Yehor opens the corresponding gate in content/bg/gates.ts
    expect(isBgRouteIndexable("hoteli")).toBe(false);
    expect(isBgRouteIndexable("blogTseni2026")).toBe(false);
    expect(isBgRouteIndexable("blogDirektniRezervatsii")).toBe(false);
    expect(isBgRouteIndexable("blogMetaBeneficient")).toBe(false);
  });

  it("builds bgPageMetadata with absolute title, canonical, OG/Twitter, home card, article override, and noindex", () => {
    const home = bgPageMetadata("home");
    expect(home.title).toEqual({ absolute: BG_ROUTE_METADATA.home.title });
    expect(home.description).toBe(BG_ROUTE_METADATA.home.description);
    expect(home.alternates).toEqual({ canonical: `${SITE_URL}/` });
    expect(home.openGraph).toMatchObject({
      type: "website",
      siteName: "Маркетинг Завод",
      title: BG_SITE_METADATA.homeCard.title,
      description: BG_SITE_METADATA.homeCard.description,
      url: `${SITE_URL}/`,
      locale: "bg_BG",
    });
    expect(home.twitter).toMatchObject({
      card: "summary_large_image",
      title: BG_SITE_METADATA.homeCard.title,
      description: BG_SITE_METADATA.homeCard.description,
    });
    expect(home.robots).toBeUndefined();

    const pricing = bgPageMetadata("tseni");
    expect(pricing.openGraph).toMatchObject({
      title: stripBgTitleSuffix(BG_ROUTE_METADATA.tseni.title),
      description: BG_ROUTE_METADATA.tseni.description,
      url: `${SITE_URL}/tseni`,
    });
    expect(pricing.openGraph?.title).toBe("Маркетинг услуги: цени без „по запитване“");

    const article = bgPageMetadata("blogPrediDaPodpishete", {
      ogTitle: "Какво да проверите, преди да подпишете с маркетинг агенция",
      publishedTime: "2026-11-20",
    });
    expect(article.openGraph).toMatchObject({
      type: "article",
      title: "Какво да проверите, преди да подпишете с маркетинг агенция",
      publishedTime: "2026-11-20",
    });

    const notFound = bgPageMetadata("notFound");
    expect(notFound.title).toEqual({ absolute: BG_ROUTE_METADATA.notFound.title });
    expect(notFound.description).toBe(BG_SITE_METADATA.defaultDescription);
    expect(notFound.alternates).toBeUndefined();
    expect(notFound.robots).toEqual({ index: false, follow: false });

    const blagodarim = bgPageMetadata("blagodarim");
    expect(blagodarim.description).toBe(BG_SITE_METADATA.defaultDescription);
    expect(blagodarim.alternates).toEqual({ canonical: `${SITE_URL}/blagodarim` });
    expect(blagodarim.robots).toEqual({ index: false, follow: false });

    const gatedHotels = bgPageMetadata("hoteli");
    expect(gatedHotels.robots).toEqual({ index: false, follow: false });

    expect(findBgMetadataRouteByPath("/tseni")).toBe("tseni");
    expect(findBgMetadataRouteByPath("/unknown")).toBeUndefined();
  });

  it("preserves English Jet site constants and pageMetadata defaults untouched (CR-A1)", () => {
    expect(SITE_NAME).toBe("Jet");
    expect(SITE_DESCRIPTION).toContain("Supercharge your website with Jet");
    const jetHome = pageMetadata({
      title: "Jet – Lightning-Fast Website Optimization",
      description: SITE_DESCRIPTION,
      path: "/",
    });
    expect(jetHome.openGraph).toMatchObject({
      siteName: "Jet",
      locale: "en_US",
      url: "/",
    });
  });
});
