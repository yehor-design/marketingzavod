import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { ANNOUNCEMENT_DISMISSED_KEY } from "@/components/blocks/announcement-bar";
import { bgUi } from "@/content/bg/ui";
import { CONSENT_VERSION } from "@/lib/consent/core";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const ALLOWED_SERVICE_NAMES = [
  "Google Analytics",
  "PostHog",
  "Amplitude",
  "Vercel Speed Insights",
  "Google Ads",
  "Meta",
  "LinkedIn",
] as const;

function stripAllowedServiceNames(text: string): string {
  let cleaned = text;
  for (const name of ALLOWED_SERVICE_NAMES) {
    cleaned = cleaned.replaceAll(name, "");
  }
  return cleaned;
}

async function interceptThirdParty(page: Page): Promise<string[]> {
  const requests: string[] = [];
  await page.route(/googletagmanager\.com/, (route) => {
    requests.push(route.request().url());
    return route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
  });
  await page.route(/amplitude\.com/, (route) => {
    requests.push(route.request().url());
    return route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
  });
  await page.route(/\/_vercel\//, (route) => {
    requests.push(route.request().url());
    return route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
  });
  return requests;
}

test.describe("BG consent banner and settings panel (CN-01..CN-06, CN-A1..CN-A3 Variant B)", () => {
  test("CN-A1: banner and settings panel render verbatim Bulgarian text, CN-02 button order, 3 Variant B categories, zero Latin leaks, and pass axe", async ({
    page,
  }) => {
    await interceptThirdParty(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/blog", { waitUntil: "load" });

    const banner = page.locator("[data-consent-banner]");
    await expect(banner).toBeVisible();
    await page.waitForTimeout(500);

    // Hidden title, verbatim copy, /legal/biskvitki link + screen-reader aria-label
    await expect(banner.getByRole("heading", { name: bgUi.consent.bannerTitleSr })).toBeAttached();
    await expect(banner).toContainText(bgUi.consent.bannerText);
    const learnMore = banner.getByRole("link", { name: bgUi.consent.learnMoreAria });
    await expect(learnMore).toHaveAttribute("href", "/legal/biskvitki");
    await expect(learnMore).toHaveText(bgUi.consent.learnMore);

    // Exact CN-02 button set and order
    const bannerButtonLabels = await banner
      .locator("button")
      .evaluateAll((nodes) =>
        nodes.map((node) => node.querySelector(".sr-only")?.textContent?.trim() ?? node.textContent?.trim() ?? ""),
      );
    expect(bannerButtonLabels).toEqual([
      bgUi.consent.necessaryOnly,
      bgUi.consent.acceptAll,
      bgUi.consent.settings,
    ]);

    // Zero Latin letters or bracket placeholders in banner text & aria-labels
    const bannerRawText = await banner.innerText();
    expect(bannerRawText).not.toMatch(/[A-Za-z]/);
    expect(bannerRawText).not.toMatch(/[\[\]]/);

    // Axe WCAG 2.2 A/AA on banner
    const bannerAxe = await new AxeBuilder({ page })
      .include("[data-consent-banner]")
      .withTags(WCAG_TAGS)
      .analyze();
    expect(bannerAxe.violations, JSON.stringify(bannerAxe.violations, null, 2)).toEqual([]);

    // Open settings panel via «Настройки»
    await banner.getByRole("button", { name: bgUi.consent.settings }).click();
    const panel = page.locator("[data-consent-settings]");
    await expect(panel).toBeVisible();
    await page.waitForTimeout(450);

    await expect(panel).toContainText(bgUi.consent.settingsTitle);
    await expect(panel).toContainText(bgUi.consent.settingsDescription);
    await expect(panel.getByRole("button", { name: bgUi.consent.closeAria })).toBeVisible();

    // Variant B (CN-04): exactly 3 categories, NO «Предпочитания»
    const switches = panel.locator('[role="switch"]');
    await expect(switches).toHaveCount(3);
    await expect(panel).not.toContainText("Предпочитания");

    const necessarySwitch = panel.getByRole("switch", { name: bgUi.consent.categories.necessary.name });
    const statsSwitch = panel.getByRole("switch", { name: bgUi.consent.categories.statistics.name });
    const marketingSwitch = panel.getByRole("switch", { name: bgUi.consent.categories.marketing.name });

    await expect(necessarySwitch).toHaveAttribute("aria-checked", "true");
    await expect(necessarySwitch).toHaveAttribute("aria-disabled", "true");
    await expect(statsSwitch).toHaveAttribute("aria-checked", "false");
    await expect(marketingSwitch).toHaveAttribute("aria-checked", "false");

    for (const category of Object.values(bgUi.consent.categories)) {
      await expect(panel).toContainText(category.name);
      await expect(panel).toContainText(category.purpose);
      await expect(panel).toContainText(category.services);
    }

    // Exact CN-02 panel footer button order
    const footerButtonLabels = await panel
      .locator('[data-slot="dialog-footer"] button')
      .evaluateAll((nodes) =>
        nodes.map((node) => node.querySelector(".sr-only")?.textContent?.trim() ?? node.textContent?.trim() ?? ""),
      );
    expect(footerButtonLabels).toEqual([
      bgUi.consent.necessaryOnly,
      bgUi.consent.acceptAll,
      bgUi.consent.saveChoices,
    ]);

    // Zero Latin letters outside allowed service names and zero placeholders
    const panelRawText = await panel.innerText();
    expect(stripAllowedServiceNames(panelRawText)).not.toMatch(/[A-Za-z]/);
    expect(panelRawText).not.toMatch(/[\[\]]/);

    // Axe WCAG 2.2 A/AA on settings panel
    const panelAxe = await new AxeBuilder({ page })
      .include("[data-consent-settings]")
      .withTags(WCAG_TAGS)
      .analyze();
    expect(panelAxe.violations, JSON.stringify(panelAxe.violations, null, 2)).toEqual([]);
  });

  test("CN-A2: consent logic (no choice, accept all, granular save, necessary-only withdrawal) works identically in BG with unchanged CONSENT_VERSION", async ({
    page,
  }) => {
    const requests = await interceptThirdParty(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/blog", { waitUntil: "load" });

    const banner = page.locator("[data-consent-banner]");
    await expect(banner).toBeVisible();

    // Before choice: nothing stored, no third-party requests
    expect(await page.context().cookies()).toEqual([]);
    expect(requests).toEqual([]);

    // Accept all via BG button
    await banner.getByRole("button", { name: bgUi.consent.acceptAll }).click();
    await expect(banner).toBeHidden();

    const acceptedCookie = (await page.context().cookies()).find((c) => c.name === "mz_consent")?.value;
    expect(acceptedCookie).toMatch(new RegExp(`^${CONSENT_VERSION}\\.s1m1\\.`));
    await expect
      .poll(() => requests.filter((url) => url.includes("gtm.js?id=GTM-E2ETEST")).length)
      .toBe(1);

    // Reopen from footer «Настройки за бисквитки», keep statistics only, save
    await page
      .locator("footer.site-footer")
      .getByRole("button", { name: bgUi.consent.cookieSettingsButton })
      .click();
    const panel = page.locator("[data-consent-settings]");
    await expect(panel).toBeVisible();

    await panel.getByRole("switch", { name: bgUi.consent.categories.marketing.name }).click();
    await panel.getByRole("button", { name: bgUi.consent.saveChoices }).click();
    await expect(panel).toBeHidden();

    await expect
      .poll(async () => (await page.context().cookies()).find((c) => c.name === "mz_consent")?.value ?? "")
      .toMatch(new RegExp(`^${CONSENT_VERSION}\\.s1m0\\.`));

    // Reopen and withdraw to necessary only
    await page
      .locator("footer.site-footer")
      .getByRole("button", { name: bgUi.consent.cookieSettingsButton })
      .click();
    await expect(panel).toBeVisible();
    await panel.getByRole("button", { name: bgUi.consent.necessaryOnly }).click();

    await expect
      .poll(async () => (await page.context().cookies()).find((c) => c.name === "mz_consent")?.value ?? "")
      .toMatch(new RegExp(`^${CONSENT_VERSION}\\.s0m0\\.`));
  });

  test("CN-A3 (Variant B) & mobile 390x844: banner fits <= 1/3 viewport height without clipping, buttons >= 24x24, session-only announcement dismiss", async ({
    page,
  }) => {
    await interceptThirdParty(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/blog", { waitUntil: "load" });

    const banner = page.locator("[data-consent-banner]");
    await expect(banner).toBeVisible();
    await page.waitForTimeout(500);

    const bannerBox = await banner.boundingBox();
    expect(bannerBox).not.toBeNull();
    expect(bannerBox!.x).toBeGreaterThanOrEqual(0);
    expect(bannerBox!.x + bannerBox!.width).toBeLessThanOrEqual(390);
    // Spec 5 §5: banner must not cover more than 1/3 of 390x844 viewport
    expect(bannerBox!.height).toBeLessThanOrEqual(Math.floor(844 / 3));

    for (const label of [
      bgUi.consent.necessaryOnly,
      bgUi.consent.acceptAll,
      bgUi.consent.settings,
    ]) {
      const btnBox = await banner.getByRole("button", { name: label }).boundingBox();
      expect(btnBox, label).not.toBeNull();
      expect(btnBox!.width, `${label} width`).toBeGreaterThanOrEqual(24);
      expect(btnBox!.height, `${label} height`).toBeGreaterThanOrEqual(24);
      expect(btnBox!.x + btnBox!.width, `${label} right edge`).toBeLessThanOrEqual(
        bannerBox!.x + bannerBox!.width + 1,
      );
    }

    // Variant B check: dismissing announcement bar writes only to sessionStorage (no localStorage or cookie)
    await page
      .locator('[data-announcement-slot="global"]')
      .getByRole("button", { name: bgUi.announcement.closeAria })
      .click();

    const storage = await page.evaluate((key) => ({
      session: window.sessionStorage.getItem(key),
      local: window.localStorage.getItem(key),
      cookie: document.cookie,
    }), ANNOUNCEMENT_DISMISSED_KEY);
    expect(storage.session).toBe("1");
    expect(storage.local).toBeNull();
    expect(storage.cookie).not.toContain(ANNOUNCEMENT_DISMISSED_KEY);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });
});
