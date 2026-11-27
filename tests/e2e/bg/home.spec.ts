import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { BG_HOME_BLOCK_ORDER, HOME_FOUNDER, HOME_HERO } from "@/content/bg/home";
import { events } from "../helpers";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1024, height: 900 },
  { width: 1440, height: 900 },
] as const;

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

test.describe("BG Home Page / (ZAV-116 / HM-A1 / PG-A1..PG-A4)", () => {
  test("renders exact 11-block HM-01 order, #resheniya with 4 published segment cards, illos.dev visuals, founder photo, and zero Jet/testimonial leaks", async ({
    page,
  }) => {
    await storeBgConsent(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "load" });

    // PG-A1: exact data-block sequence inside <main>.
    const blocks = await page
      .locator("main > [data-block]")
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-block")));
    expect(blocks).toEqual([...BG_HOME_BLOCK_ORDER]);

    // Hero copy & animated backdrop (no duplicate announcement inside hero).
    await expect(page.locator("main h1")).toHaveText(HOME_HERO.data.title);
    await expect(page.locator('[data-block="hero"] [data-block="announcement-bar"]')).toHaveCount(0);

    // PG-07 / DS-27: 4 animated illos.dev/library SVGs in FeatureGrid.
    const illos = page.locator('[data-block="feature-grid"] img[data-illo]');
    await expect(illos).toHaveCount(4);

    // HM-02 / PG-A4: #resheniya has 4 published segment links and hides gated «Хотели».
    const resheniya = page.locator("#resheniya");
    await expect(resheniya).toHaveCount(1);
    const segmentHrefs = await resheniya
      .locator("ul a")
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")));
    expect(segmentHrefs).toEqual([
      "/smyana-na-agentsiya",
      "/onlayn-magazini",
      "/uslugi-i-b2b",
      "/nedvizhimi-imoti",
    ]);
    await expect(resheniya).not.toContainText("Хотели");

    // HM-03: founder portrait loaded from public/founders/ with verbatim alt.
    const founder = page.locator('[data-block="founder-card"]');
    const founderImg = founder.locator("img").first();
    await founderImg.scrollIntoViewIfNeeded();
    await expect(founderImg).toHaveAttribute("alt", HOME_FOUNDER.data.photo.alt);
    await expect(founderImg).toHaveAttribute("src", /egor-goncharenko-1x1-800\.webp/);
    await expect
      .poll(() => founderImg.evaluate((node) => (node as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0);

    // HM-05: MirrorQuestions has 3 questions and zero testimonial/quote markup.
    const mirror = page.locator('[data-block="mirror-questions"]');
    await expect(mirror.locator("ul > li")).toHaveCount(3);
    await expect(mirror.locator("blockquote, cite, img")).toHaveCount(0);

    // HM-06: 4-column ComparisonTable without icons.
    const compare = page.locator('[data-block="comparison-table"]');
    await expect(compare).toHaveAttribute("data-columns", "4");
    await expect(compare.locator("svg")).toHaveCount(0);

    // PG-01: no Jet branding leaks anywhere on BG home.
    const bodyText = await page.locator("main").innerText();
    expect(bodyText).not.toMatch(/\bJet\b/);
    expect(bodyText).not.toContain("Join waitlist");
  });

  test("tracks CTA clicks (hero, home_pilot_banner, footer_cta) and founder mailto contact_click (PG-A3)", async ({
    page,
  }) => {
    await storeBgConsent(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "load" });

    // Prevent navigation in capture phase AFTER TrackingProvider's capture listener.
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

    await page.locator('[data-block="hero"] a[href="/kontakt"]').click();
    await page.locator('[data-block="pilot-banner"] a[href="/keysi"]').click();
    await page.locator('[data-block="cta-band"] a[href="/kontakt"]').click();
    await page.locator('[data-block="founder-card"] a[href^="mailto:"]').click();

    const ctaClicks = await events(page, "cta_click");
    expect(ctaClicks).toContainEqual(
      expect.objectContaining({ cta_location: "hero", destination: "/kontakt" }),
    );
    expect(ctaClicks).toContainEqual(
      expect.objectContaining({ cta_location: "home_pilot_banner", destination: "/keysi" }),
    );
    expect(ctaClicks).toContainEqual(
      expect.objectContaining({ cta_location: "footer_cta", destination: "/kontakt" }),
    );

    const contactClicks = await events(page, "contact_click");
    expect(contactClicks).toContainEqual(expect.objectContaining({ method: "email" }));
  });

  for (const viewport of VIEWPORTS) {
    test(`renders without horizontal overflow and passes WCAG 2.2 A/AA axe at ${viewport.width}px`, async ({
      page,
    }) => {
      await storeBgConsent(page);
      await page.setViewportSize(viewport);
      await page.goto("/", { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);

      const axe = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
      expect(axe.violations, JSON.stringify(axe.violations, null, 2)).toEqual([]);
    });
  }
});
