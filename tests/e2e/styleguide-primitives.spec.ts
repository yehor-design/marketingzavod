import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { prepare } from "./helpers";

const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1024, height: 900 },
  { width: 1440, height: 900 },
] as const;

const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

test("DS-A6: checkbox, navigation menu item, and table row keep equal px heights across 390, 1024, and 1440", async ({
  page,
}) => {
  await prepare(page, { choice: "necessary" });
  const heights: Record<number, { checkbox: number; navItem: number; tableRow: number }> = {};

  for (const viewport of VIEWPORTS) {
    await page.setViewportSize(viewport);
    await page.goto("/dev/styleguide", { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);

    const checkbox = await page.locator('[data-ds-a6="checkbox"]').boundingBox();
    const navItem = await page.locator('[data-ds-a6="nav-item"]').boundingBox();
    const tableRow = await page.locator('[data-ds-a6="table-row"]').boundingBox();

    expect(checkbox, `checkbox box at ${viewport.width}`).not.toBeNull();
    expect(navItem, `navItem box at ${viewport.width}`).not.toBeNull();
    expect(tableRow, `tableRow box at ${viewport.width}`).not.toBeNull();

    heights[viewport.width] = {
      checkbox: Math.round(checkbox!.height),
      navItem: Math.round(navItem!.height),
      tableRow: Math.round(tableRow!.height),
    };
  }

  expect(heights[390].checkbox).toBe(heights[1024].checkbox);
  expect(heights[1024].checkbox).toBe(heights[1440].checkbox);
  expect(heights[390].navItem).toBe(heights[1024].navItem);
  expect(heights[1024].navItem).toBe(heights[1440].navItem);
  expect(heights[390].tableRow).toBe(heights[1024].tableRow);
  expect(heights[1024].tableRow).toBe(heights[1440].tableRow);
});

test("DS-A9: /dev/styleguide has no WCAG 2.2 A/AA axe violations", async ({ page }) => {
  await prepare(page, { choice: "necessary" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/dev/styleguide", { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);

  const result = await new AxeBuilder({ page }).withTags(WCAG).analyze();
  const summary = result.violations.map(
    (violation) =>
      `${violation.id} (${violation.impact}): ${violation.help} -> ${JSON.stringify(violation.nodes.map((node) => node.target))}`,
  );
  expect(summary).toEqual([]);
});
