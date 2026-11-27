import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { BG_ROUTE_METADATA, BG_SITE_METADATA } from "@/content/bg/metadata";
import { BG_NOT_FOUND, getPublishedBgNotFoundSolutions } from "@/content/bg/not-found";
import { bgUi } from "@/content/bg/ui";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

test.describe("BG 404 page (NF-01, CR-17, CR-18, CR-23, CR-31, NF-A1, CR-A7)", () => {
  for (const route of ["/neisnuvashta", "/updates"] as const) {
    test(`${route} returns HTTP 404 without redirecting, renders verbatim BG Hero + LinkList groups, cta_location=not_found, and passes axe`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      const response = await page.goto(route, { waitUntil: "load" });
      expect(response?.status()).toBe(404);
      expect(new URL(page.url()).pathname).toBe(route);

      await expect(page.locator("html")).toHaveAttribute("lang", "bg");
      await expect(page).toHaveTitle(BG_ROUTE_METADATA.notFound.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        BG_SITE_METADATA.defaultDescription,
      );
      const robots = await page
        .locator('meta[name="robots"]')
        .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("content") ?? ""));
      expect(robots.length).toBeGreaterThan(0);
      expect(robots.every((value) => value.includes("noindex"))).toBe(true);

      // Dismiss consent banner so axe and layout measure the page cleanly
      const necessaryOnly = page.locator("[data-consent-banner]").getByRole("button", {
        name: bgUi.consent.necessaryOnly,
      });
      if (await necessaryOnly.isVisible()) {
        await necessaryOnly.click();
      }

      const main = page.locator("main");
      await expect(main.locator("h1")).toHaveCount(1);
      await expect(main.locator("h1")).toHaveText(BG_NOT_FOUND.hero.title);
      await expect(main).toContainText(BG_NOT_FOUND.hero.description);

      // Hero CTA buttons with cta_location="not_found"
      const ctas = main.locator('[data-block="hero"] a[data-track="cta_click"]');
      await expect(ctas).toHaveCount(2);
      for (let i = 0; i < BG_NOT_FOUND.hero.actions.length; i += 1) {
        const expected = BG_NOT_FOUND.hero.actions[i];
        await expect(ctas.nth(i)).toHaveAttribute("href", expected.href);
        await expect(ctas.nth(i)).toHaveAttribute("data-track-cta-location", "not_found");
        await expect(ctas.nth(i)).toContainText(expected.text);
      }

      // Two LinkList list groups in file 26 order
      const groups = main.locator('[data-block="link-list"][data-variant="list"]');
      await expect(groups).toHaveCount(2);

      const suggested = groups.nth(0);
      await expect(suggested).toContainText(BG_NOT_FOUND.suggestedGroup.title);
      for (const item of BG_NOT_FOUND.suggestedGroup.items) {
        const link = suggested.locator(`a[href="${item.href}"]`);
        await expect(link).toBeVisible();
        await expect(link).toContainText(item.label);
      }

      const solutions = groups.nth(1);
      await expect(solutions).toContainText(BG_NOT_FOUND.solutionsGroup.title);
      const publishedSolutions = getPublishedBgNotFoundSolutions();
      await expect(solutions.locator("a")).toHaveCount(publishedSolutions.length);
      for (const item of publishedSolutions) {
        const link = solutions.locator(`a[href="${item.href}"]`);
        await expect(link).toBeVisible();
        await expect(link).toContainText(item.label);
      }

      // Closed gate item and service notes must never render
      const mainText = await main.innerText();
      expect(mainText).not.toContain("Хотели");
      expect(mainText).not.toContain("Технічна примітка");
      expect(mainText).not.toContain("Looks like the page");
      expect(mainText).not.toMatch(/[\[\]]/);

      const axeResults = await new AxeBuilder({ page })
        .include("main")
        .withTags(WCAG_TAGS)
        .analyze();
      expect(axeResults.violations, JSON.stringify(axeResults.violations, null, 2)).toEqual([]);
    });
  }

  for (const width of [390, 1024] as const) {
    test(`renders without horizontal overflow and passes axe at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      const response = await page.goto("/neisnuvashta", { waitUntil: "load" });
      expect(response?.status()).toBe(404);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect(overflow).toBe(false);

      const axeResults = await new AxeBuilder({ page })
        .include("main")
        .withTags(WCAG_TAGS)
        .analyze();
      expect(axeResults.violations, JSON.stringify(axeResults.violations, null, 2)).toEqual([]);
    });
  }
});
