import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { ANNOUNCEMENT_DISMISSED_KEY } from "@/components/blocks/announcement-bar";
import { bgUi } from "@/content/bg/ui";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

test.describe("BG global AnnouncementBar (GL-01..GL-04, GL-A1)", () => {
  test("renders once on / and /blog below fixed header, hidden on /proverka-na-akaunti, tracks cta_location=announcement", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "load" });

    // Exactly one announcement instance on home (none duplicated inside hero)
    const bars = page.locator('[data-block="announcement-bar"]');
    await expect(bars).toHaveCount(1);
    await expect(bars.first()).toBeVisible();
    await expect(page.locator('[data-block="hero"] [data-block="announcement-bar"]')).toHaveCount(0);

    const link = bars.first().locator("a");
    await expect(link).toHaveAttribute("href", bgUi.announcement.href);
    await expect(link).toHaveAttribute("data-track", "cta_click");
    await expect(link).toHaveAttribute("data-track-cta-location", "announcement");
    await expect(link).toContainText(bgUi.announcement.text);
    // No duplicate arrow icon inside link
    await expect(link.locator("svg")).toHaveCount(0);

    // Must sit below the fixed 64px header (not occluded)
    const headerBox = await page.locator("header.site-header .header-bar").boundingBox();
    const barBox = await bars.first().locator(".announcement").boundingBox();
    expect(headerBox && barBox && barBox.y >= headerBox.y + headerBox.height).toBe(true);

    // Close button accessible name & minimum WCAG 2.5.8 24x24 target
    const closeBtn = bars.first().getByRole("button", { name: bgUi.announcement.closeAria });
    await expect(closeBtn).toBeVisible();
    const btnBox = await closeBtn.boundingBox();
    expect(btnBox && btnBox.width >= 24 && btnBox.height >= 24).toBe(true);

    // Also visible on /blog
    await page.goto("/blog", { waitUntil: "load" });
    await expect(page.locator('[data-block="announcement-bar"]')).toHaveCount(1);
    await expect(page.locator('[data-block="announcement-bar"]').first()).toBeVisible();

    // Hidden on /proverka-na-akaunti (it links there itself)
    await page.goto("/proverka-na-akaunti", { waitUntil: "load" });
    await expect(page.locator('[data-block="announcement-bar"]')).toHaveCount(0);
  });

  test("dismissing with × hides bar for the session without localStorage/cookies and avoids CLS on reload", async ({
    browser,
  }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    await page.goto("/blog", { waitUntil: "load" });
    const slot = page.locator('[data-announcement-slot="global"]');
    await expect(slot).toBeVisible();

    await slot.getByRole("button", { name: bgUi.announcement.closeAria }).click();
    await expect(slot).toBeHidden();

    // Only sessionStorage is written (Variant B default — no localStorage or cookies)
    const storageState = await page.evaluate((key) => {
      return {
        sessionValue: window.sessionStorage.getItem(key),
        localKeys: Object.keys(window.localStorage),
        cookies: document.cookie,
      };
    }, ANNOUNCEMENT_DISMISSED_KEY);
    expect(storageState.sessionValue).toBe("1");
    expect(storageState.localKeys).not.toContain(ANNOUNCEMENT_DISMISSED_KEY);
    expect(storageState.cookies).not.toContain(ANNOUNCEMENT_DISMISSED_KEY);

    // Measure CLS across reload when dismissed: blocking script hides bar before first paint
    await page.addInitScript(() => {
      const win = window as unknown as { __cls?: number };
      win.__cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
          if (!shift.hadRecentInput) {
            win.__cls = (win.__cls ?? 0) + (shift.value ?? 0);
          }
        }
      }).observe({ type: "layout-shift", buffered: true });
    });

    await page.reload({ waitUntil: "load" });
    await expect(page.locator("html")).toHaveAttribute("data-announcement-dismissed", "true");
    await expect(page.locator('[data-announcement-slot="global"]')).toBeHidden();

    const cls = await page.evaluate(() => (window as unknown as { __cls?: number }).__cls ?? 0);
    expect(cls).toBeLessThanOrEqual(0.1);
    await context.close();

    // Fresh session context shows the banner again (session-scoped)
    const freshContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const freshPage = await freshContext.newPage();
    await freshPage.goto("/blog", { waitUntil: "load" });
    await expect(freshPage.locator('[data-announcement-slot="global"]')).toBeVisible();
    await freshContext.close();
  });

  test("mobile (390px): wraps cleanly up to 2 lines without overflow and passes axe", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/blog", { waitUntil: "load" });

    const slot = page.locator('[data-announcement-slot="global"]');
    await expect(slot).toBeVisible();

    const bar = slot.locator(".announcement");
    const box = await bar.boundingBox();
    expect(box && box.x >= 0 && box.x + box.width <= 390).toBe(true);

    // Verify link wraps to at most 2 lines without clipping
    const lineCount = await bar.locator("a").evaluate((el) => {
      const style = getComputedStyle(el);
      const lineHeight = parseFloat(style.lineHeight);
      const height = el.getBoundingClientRect().height;
      return Math.round(height / lineHeight);
    });
    expect(lineCount).toBeLessThanOrEqual(2);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);

    const axeResults = await new AxeBuilder({ page })
      .include('[data-announcement-slot="global"]')
      .withTags(WCAG_TAGS)
      .analyze();
    expect(axeResults.violations, JSON.stringify(axeResults.violations, null, 2)).toEqual([]);
  });
});
