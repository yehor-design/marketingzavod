import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { events, prepare } from "./helpers";

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
  await page.goto("/dev/styleguide", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("#primitive-checkbox [data-slot='checkbox']").first()).toHaveAttribute(
    "aria-labelledby",
    /.+/,
  );
  await page.locator(".jet-dash-layer").first().waitFor({ state: "attached" });

  const result = await new AxeBuilder({ page }).withTags(WCAG).analyze();
  const summary = result.violations.map(
    (violation) =>
      `${violation.id} (${violation.impact}): ${violation.help} -> ${JSON.stringify(violation.nodes.map((node) => node.target))}`,
  );
  expect(summary).toEqual([]);
});

test("DS-21 / AR-02 / LG-02: ArticleBody and LegalBody render all rich blocks with scope=col tables and safe external links", async ({
  page,
}) => {
  await prepare(page, { choice: "necessary" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/dev/styleguide", { waitUntil: "networkidle" });

  for (const selector of ["#block-article-body", "#block-legal-body"]) {
    const section = page.locator(selector);
    await expect(section.locator("p.lead")).toHaveCount(1);
    await expect(section.locator("ol > li")).toHaveCount(2);
    await expect(section.locator('[data-block-kind="cta"] a[data-slot="button"]')).toHaveCount(2);
    await expect(section.locator('[data-block-kind="methodology"]')).toHaveCount(1);
    await expect(section.locator('[data-block-kind="sources"] li').first()).toBeVisible();
    await expect(section.locator("strong").first()).toBeVisible();

    const thScopes = await section
      .locator("table th")
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("scope")));
    expect(thScopes.length).toBeGreaterThan(0);
    expect(thScopes.every((scope) => scope === "col")).toBe(true);

    const externalRels = await section
      .locator('a[href^="http"]')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("rel")));
    expect(externalRels.length).toBeGreaterThan(0);
    expect(externalRels.every((rel) => rel === "noopener noreferrer")).toBe(true);
  }

  const richBlocksAxe = await new AxeBuilder({ page })
    .include("#block-article-body")
    .include("#block-legal-body")
    .include("#block-link-list")
    .include("#block-announcement-bar")
    .include("#block-mirror-questions")
    .include("#block-founder-card")
    .include("#block-pilot-banner")
    .include("#block-comparison-table")
    .withTags(WCAG)
    .analyze();
  expect(richBlocksAxe.violations).toEqual([]);

  const linkList = page.locator("#block-link-list");
  await expect(linkList.locator('[data-block="link-list"][data-variant="list"]')).toHaveCount(2);
  await expect(linkList.locator('[data-block="link-list"][data-variant="cards"]')).toHaveCount(1);
  await expect(linkList.locator('[data-variant="cards"] li > a')).toHaveCount(2);

  const announcementSection = page.locator("#block-announcement-bar");
  await expect(announcementSection.locator('[data-block="announcement-bar"]')).toHaveCount(1);
  await expect(
    announcementSection.locator('a[data-track="cta_click"][data-track-cta-location="announcement"]'),
  ).toHaveCount(1);

  const mirrorSection = page.locator("#block-mirror-questions");
  await expect(mirrorSection.locator('[data-block="mirror-questions"]')).toHaveCount(2);
  await expect(mirrorSection.locator('ul[data-question-count="3"] > li')).toHaveCount(3);
  await expect(mirrorSection.locator('ul[data-question-count="5"] > li')).toHaveCount(5);
  await expect(mirrorSection.locator("blockquote, cite")).toHaveCount(0);
  await expect(
    mirrorSection.locator('a[href="/kontakt"][data-track="cta_click"]'),
  ).toHaveCount(1);

  const founderSection = page.locator("#block-founder-card");
  await expect(founderSection.locator('[data-block="founder-card"]')).toHaveCount(1);
  const founderImg = founderSection.locator("img").first();
  await expect(founderImg).toHaveAttribute(
    "alt",
    "Егор Гончаренко, основател на Маркетинг Завод",
  );
  expect(await founderImg.evaluate((node) => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await expect(
    founderSection.locator('a[href="mailto:zavodzamarketing@gmail.com"]'),
  ).toHaveCount(1);
  await expect(
    founderSection.locator('a[href="https://www.linkedin.com/in/yehor-honcharenko"][rel="noopener"]'),
  ).toHaveCount(1);

  const pilotSection = page.locator("#block-pilot-banner");
  await expect(pilotSection.locator('[data-block="pilot-banner"]')).toHaveCount(1);
  await expect(pilotSection.locator("button")).toHaveCount(0);
  const pilotLink = pilotSection.locator(
    'a[href="/keysi"][data-track="cta_click"][data-track-cta-location="home_pilot_banner"]',
  );
  await expect(pilotLink).toHaveCount(1);
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
  await pilotLink.click();
  const clicks = await events(page, "cta_click");
  expect(clicks).toContainEqual(
    expect.objectContaining({
      event: "cta_click",
      cta_location: "home_pilot_banner",
      destination: "/keysi",
    }),
  );

  const comparison4 = page.locator('#block-comparison-table [data-block="comparison-table"][data-columns="4"]');
  await expect(comparison4).toHaveCount(1);
  await expect(comparison4.locator("svg")).toHaveCount(0);
  await expect(comparison4.locator('[role="tablist"]')).toHaveAttribute(
    "aria-label",
    "Изберете вариант",
  );
  await expect(
    comparison4.locator('[role="columnheader"][data-highlighted="true"]'),
  ).toHaveText("Маркетинг Завод");
});

for (const viewport of VIEWPORTS) {
  test(`DS-A7: new M3 styleguide blocks have zero horizontal overflow at ${viewport.width}px`, async ({
    page,
  }) => {
    await prepare(page, { choice: "necessary" });
    await page.setViewportSize(viewport);
    await page.goto("/dev/styleguide", { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);

    const overflow = await page.evaluate(() => {
      const ids = [
        "#block-mirror-questions",
        "#block-founder-card",
        "#block-pilot-banner",
        "#block-comparison-table",
      ];
      const entries = ids.map((id) => {
        const el = document.querySelector(id);
        return el ? [id, el.scrollWidth - el.clientWidth] : [id, null];
      });
      return {
        body: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        sections: Object.fromEntries(entries),
      };
    });
    expect(overflow.body).toBeLessThanOrEqual(0);
    for (const [id, delta] of Object.entries(overflow.sections)) {
      expect(delta, `${id} should exist`).not.toBeNull();
      expect(delta as number, `${id} overflow at ${viewport.width}px`).toBeLessThanOrEqual(0);
    }

    if (viewport.width < 1200) {
      const comparison4 = page.locator(
        '#block-comparison-table [data-block="comparison-table"][data-columns="4"]',
      );
      await comparison4.getByRole("tab", { name: "Маркетинг Завод" }).click();
      await expect(comparison4.locator(".valueActive").first()).toHaveText(
        "от 290 € за канал, от 690 € за 2–3 канала",
      );
    }
  });
}
