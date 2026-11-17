import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { prepare } from "./helpers";

/** WCAG 2.0, 2.1 and 2.2 at levels A and AA: the bar the consent spec sets (L10). */
const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

function summary(violations: Array<{ id: string; nodes: Array<{ target: unknown }> }>) {
  return violations.map((violation) => `${violation.id}: ${JSON.stringify(violation.nodes.map((node) => node.target))}`);
}

test("the consent banner has no WCAG A/AA violations", async ({ page }) => {
  await prepare(page, { choice: "none" });
  await page.goto("/");
  await expect(page.locator("[data-consent-banner]")).toBeVisible();
  // Let the entrance animation finish so colours are measured at full opacity.
  await page.waitForTimeout(600);
  const result = await new AxeBuilder({ page }).include("[data-consent-banner]").withTags(WCAG).analyze();
  expect(summary(result.violations)).toEqual([]);
});

test("the consent settings panel has no WCAG A/AA violations", async ({ page }) => {
  await prepare(page, { choice: "none" });
  await page.goto("/");
  await page.locator("[data-consent-banner]").getByRole("button", { name: "Settings" }).click();
  await expect(page.locator("[data-consent-settings]")).toBeVisible();
  await page.waitForTimeout(600);
  const result = await new AxeBuilder({ page }).include("[data-consent-settings]").withTags(WCAG).analyze();
  expect(summary(result.violations)).toEqual([]);
});

test("at 320px wide (WCAG reflow) the banner fits without horizontal scroll", async ({ page }) => {
  await prepare(page, { choice: "none" });
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/");
  const banner = page.locator("[data-consent-banner]");
  await expect(banner).toBeVisible();
  const box = await banner.boundingBox();
  expect(box && box.x >= 0 && box.x + box.width <= 320).toBe(true);
  for (const name of ["Necessary only", "Accept all", "Settings"]) {
    const target = await banner.getByRole("button", { name }).boundingBox();
    // WCAG 2.5.8: targets at least 24 by 24 CSS pixels.
    expect(target && target.width >= 24 && target.height >= 24, name).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
