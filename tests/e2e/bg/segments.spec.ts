import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { SMYANA_SEGMENT } from "@/content/bg/segments/smyana";
import { events } from "../helpers";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1024, height: 900 },
  { width: 1440, height: 900 },
] as const;

const EXPECTED_SEGMENT_BLOCK_ORDER = [
  "hero",
  "feature-grid",
  "process-steps",
  "mirror-questions",
  "feature-section",
  "feature-section",
  "feature-section",
  "feature-section",
  "card-grid",
  "faq",
  "cta-band",
];

async function storeBgConsent(page: import("@playwright/test").Page) {
  const ts = Math.floor(Date.now() / 1000) - 60;
  await page.context().addCookies([
    {
      name: "mz_consent",
      value: `1.s0m0.${ts}.0f8c2b1d9e7a4c6b8d0e1f2a3b4c5d6e`,
      url: "http://localhost:3102",
    },
  ]);
}

test.describe("BG Segment /smyana-na-agentsiya (ZAV-118 / SG-A2 / PG-A1..PG-A4)", () => {
  test("renders exact 9-section order, tema=smyana on /kontakt CTAs, /proverka-na-akaunti hero CTA, /kak-rabotim#dogovor link, and 8 illos.dev SVGs", async ({
    page,
  }) => {
    await storeBgConsent(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    const response = await page.goto("/smyana-na-agentsiya", { waitUntil: "load" });
    expect(response?.status()).toBe(200);

    // PG-A1: exact data-block order inside <main>.
    const blocks = await page
      .locator("main > [data-block]")
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-block")));
    expect(blocks).toEqual(EXPECTED_SEGMENT_BLOCK_ORDER);

    // Exact H1 and metadata title (row 03 of 30-metadani-saytu.md).
    await expect(page.locator("main h1")).toHaveText(SMYANA_SEGMENT.hero.title);
    await expect(page).toHaveTitle("Смяна на агенция без срив в рекламата | Маркетинг Завод");

    // SG-11 / SG-06: Hero CTA 1 -> /proverka-na-akaunti; /kontakt CTAs carry ?tema=smyana.
    await expect(page.locator('[data-block="hero"] a[href="/proverka-na-akaunti"]')).toHaveCount(1);
    await expect(page.locator('[data-block="hero"] a[href="/kontakt?tema=smyana"]')).toHaveCount(1);
    await expect(
      page.locator('[data-block="cta-band"] a[href="/kontakt?tema=smyana"]'),
    ).toHaveCount(1);

    // Every /kontakt link inside <main> carries ?tema=smyana.
    const kontaktHrefs = await page
      .locator('main a[href^="/kontakt"]')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")));
    expect(kontaktHrefs.length).toBeGreaterThanOrEqual(2);
    for (const href of kontaktHrefs) {
      expect(href).toBe("/kontakt?tema=smyana");
    }

    // Inline contract terms link from FeatureSection 3.
    await expect(page.locator('main a[href="/kak-rabotim#dogovor"]')).toHaveCount(1);

    // MirrorQuestions: 5 questions, zero testimonial/quote markup.
    const mirror = page.locator('[data-block="mirror-questions"]');
    await expect(mirror.locator("ul > li")).toHaveCount(5);
    await expect(mirror.locator("blockquote, cite, img")).toHaveCount(0);

    // PG-07 / DS-27: 4 FeatureGrid + 4 FeatureSection = 8 animated illos.dev SVGs.
    const illos = page.locator("main img[data-illo]");
    await expect(illos).toHaveCount(8);

    // FAQ first item open by default, 5 items total.
    await expect(page.locator('[data-block="faq"] button[aria-expanded]')).toHaveCount(5);
    await expect(
      page.locator('[data-block="faq"] button[aria-expanded]').first(),
    ).toHaveAttribute("aria-expanded", "true");

    // Zero service labels, Ukrainian characters, or Jet branding leaks.
    const bodyText = await page.locator("main").innerText();
    expect(bodyText).not.toMatch(/\b(Jet|Основа|Примітка|Публікувати)\b/);
    expect(bodyText).not.toMatch(/[іїєґІЇЄҐ]/);
  });

  test("tracks hero and footer_cta clicks with tema=smyana (PG-A3)", async ({ page }) => {
    await storeBgConsent(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/smyana-na-agentsiya", { waitUntil: "load" });

    await page.evaluate(() => {
      document.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          event.stopPropagation();
        },
        true,
      );
    });

    await page.locator('[data-block="hero"] a[href="/proverka-na-akaunti"]').click();
    await page.locator('[data-block="hero"] a[href="/kontakt?tema=smyana"]').click();
    await page.locator('[data-block="cta-band"] a[href="/kontakt?tema=smyana"]').click();

    const ctaClicks = await events(page, "cta_click");
    expect(ctaClicks).toContainEqual(
      expect.objectContaining({ cta_location: "hero", destination: "/proverka-na-akaunti" }),
    );
    expect(ctaClicks).toContainEqual(
      expect.objectContaining({ cta_location: "hero", destination: "/kontakt?tema=smyana" }),
    );
    expect(ctaClicks).toContainEqual(
      expect.objectContaining({ cta_location: "footer_cta", destination: "/kontakt?tema=smyana" }),
    );
  });

  for (const viewport of VIEWPORTS) {
    test(`renders without horizontal overflow and passes WCAG 2.2 A/AA axe at ${viewport.width}px`, async ({
      page,
    }) => {
      await storeBgConsent(page);
      await page.setViewportSize(viewport);
      await page.goto("/smyana-na-agentsiya", { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);

      // Verify CtaBand primary button is never clipped inside the closing card.
      const ctaCardBox = await page.locator('[data-block="cta-band"] .card').boundingBox();
      const ctaBtnBox = await page.locator('[data-block="cta-band"] a').first().boundingBox();
      expect(ctaCardBox).not.toBeNull();
      expect(ctaBtnBox).not.toBeNull();
      if (ctaCardBox && ctaBtnBox) {
        expect(ctaBtnBox.y + ctaBtnBox.height).toBeLessThanOrEqual(
          ctaCardBox.y + ctaCardBox.height,
        );
      }

      const axe = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
      expect(axe.violations, JSON.stringify(axe.violations, null, 2)).toEqual([]);
    });
  }
});
