import { expect, test, type Page } from "@playwright/test";
import { dataLayer, events, prepare, storeConsent } from "./helpers";

const banner = (page: Page) => page.locator("[data-consent-banner]");
const panel = (page: Page) => page.locator("[data-consent-settings]");
const LANDING = "/?utm_source=qa&utm_medium=cpc&utm_campaign=qa_test&gclid=TEST";

function luminance([red, green, blue]: number[]) {
  const channel = (value: number) => {
    const srgb = value / 255;
    return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue);
}

function contrast(first: number[], second: number[]) {
  const lighter = Math.max(luminance(first), luminance(second));
  const darker = Math.min(luminance(first), luminance(second));
  return (lighter + 0.05) / (darker + 0.05);
}

/** Shell of a navbar or consent button, ignoring the label width. */
async function buttonShell(locator: ReturnType<Page["locator"]>) {
  return locator.evaluate((node) => {
    const style = getComputedStyle(node);
    const roll = node.querySelector(".roll");
    const rollStyle = roll ? getComputedStyle(roll) : null;
    return {
      height: style.height,
      backgroundColor: style.backgroundColor,
      color: style.color,
      fontSize: style.fontSize,
      fontFamily: style.fontFamily,
      fontWeight: style.fontWeight,
      fontVariationSettings: style.fontVariationSettings,
      lineHeight: style.lineHeight,
      letterSpacing: style.letterSpacing,
      padding: style.padding,
      borderRadius: style.borderRadius,
      borderTopWidth: style.borderTopWidth,
      cursor: style.cursor,
      rollFontSize: rollStyle?.fontSize ?? "",
      rollLineHeight: rollStyle?.lineHeight ?? "",
      rollFontFamily: rollStyle?.fontFamily ?? "",
      rollFontWeight: rollStyle?.fontWeight ?? "",
      rollFontVariation: rollStyle?.fontVariationSettings ?? "",
      rollLetterSpacing: rollStyle?.letterSpacing ?? "",
      hasRing: node.querySelector(".gray-pill-ring") !== null,
    };
  });
}

async function consentCookie(page: Page): Promise<string | undefined> {
  return (await page.context().cookies()).find((cookie) => cookie.name === "wb_consent")?.value;
}

test("first visit: a small banner with two equal choices and a link to the details", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await prepare(page, { choice: "none" });
  await page.goto("/");

  await expect(banner(page)).toBeVisible();
  await expect(banner(page).getByRole("heading", { name: "Cookie consent" })).toBeAttached();
  await expect(banner(page)).toContainText("We use cookies for analytics and ads, some set by our partners.");
  await expect(banner(page).getByRole("link", { name: "Learn more about cookies" })).toHaveAttribute(
    "href",
    "/legal/privacy-policy#cookies",
  );

  const necessary = banner(page).getByRole("button", { name: "Necessary only" });
  const accept = banner(page).getByRole("button", { name: "Accept all" });
  const settings = banner(page).getByRole("button", { name: "Settings" });
  const join = page.locator('.desktop-actions a[href="/waitlist"]');
  const contact = page.locator('.desktop-actions a[href="/contact"]');
  // Accept all matches Join waitlist. The other banner buttons match Contact.
  // Labels keep their own width: the buttons are not stretched into columns.
  expect(await buttonShell(accept)).toEqual(await buttonShell(join));
  expect(await buttonShell(necessary)).toEqual(await buttonShell(contact));
  expect(await buttonShell(settings)).toEqual(await buttonShell(contact));
  const [necessaryBox, acceptBox, bannerBox] = [
    await necessary.boundingBox(),
    await accept.boundingBox(),
    await banner(page).boundingBox(),
  ];
  expect(necessaryBox?.height).toBe(acceptBox?.height);
  expect((necessaryBox?.width ?? 0) - (acceptBox?.width ?? 0)).toBeGreaterThan(8);
  expect(acceptBox?.width ?? 0).toBeLessThan((bannerBox?.width ?? 0) - 24);
  const copySize = await banner(page).locator("p").evaluate((node) => getComputedStyle(node).fontSize);
  expect(copySize).toBe("12px");

  // Fixed in a corner: it does not push the page down.
  expect(await banner(page).evaluate((node) => getComputedStyle(node).position)).toBe("fixed");
  expect(errors).toEqual([]);
});

test("first visit: the banner is on every kind of page", async ({ page }) => {
  await prepare(page, { choice: "none" });
  for (const path of ["/checkout", "/legal/privacy-policy", "/this-page-does-not-exist", "/pricing"]) {
    await page.goto(path);
    await expect(banner(page), path).toBeVisible();
  }
});

/** Bodies of the consent log requests the page sends. */
function consentLog(page: Page): Array<Record<string, unknown>> {
  const records: Array<Record<string, unknown>> = [];
  page.on("request", (request) => {
    if (request.url().endsWith("/api/consent") && request.method() === "POST") {
      records.push(JSON.parse(request.postData() ?? "{}"));
    }
  });
  return records;
}

test("accept all: one click stores the choice, starts GTM and the banner stays away", async ({ page }) => {
  const requests = await prepare(page, { choice: "none" });
  const records = consentLog(page);
  await page.goto("/");
  await expect.poll(() => events(page, "page_view")).toHaveLength(1);
  await banner(page).getByRole("button", { name: "Accept all" }).click();

  // A11: exactly one log record, with no personal data.
  await expect.poll(() => records.length).toBe(1);
  const id = (await consentCookie(page))?.split(".")[3];
  expect(records[0]).toEqual({
    id,
    version: 1,
    statistics: true,
    marketing: true,
    source: "banner",
    decided_at: expect.any(Number),
  });

  await expect(banner(page)).toHaveCount(0);
  expect(await consentCookie(page)).toMatch(/^1\.s1m1\.\d+\.[0-9a-f]{32}$/);

  const layer = await dataLayer(page);
  const update = layer.findIndex((entry) => entry.event === "consent_update");
  expect(layer[update]).toEqual({ event: "consent_update", consent_statistics: true, consent_marketing: true });
  // The default goes in before the page_view that was already queued.
  expect(layer[1]).toMatchObject({ 0: "consent", 1: "default", 2: { analytics_storage: "granted", ad_storage: "granted" } });
  expect(layer.findIndex((entry) => entry.event === "page_view")).toBeGreaterThan(1);
  await expect.poll(() => requests.filter((url) => url.includes("gtm.js?id=GTM-E2ETEST")).length).toBe(1);
  await expect.poll(() => requests.filter((url) => url.includes("/ingest/")).length, { timeout: 10_000 }).toBeGreaterThan(0);

  await page.goto("/pricing");
  await expect.poll(() => events(page, "page_view")).toHaveLength(1);
  await expect(banner(page)).toHaveCount(0);
});

test("necessary only: one click stores the refusal and nothing third-party loads", async ({ page }) => {
  const requests = await prepare(page, { choice: "none" });
  await page.goto("/");
  await banner(page).getByRole("button", { name: "Necessary only" }).click();

  await expect(banner(page)).toHaveCount(0);
  expect(await consentCookie(page)).toMatch(/^1\.s0m0\.\d+\.[0-9a-f]{32}$/);
  await page.waitForTimeout(4500);
  expect(requests.filter((url) => /googletagmanager|\/ingest\/|speed-insights|amplitude|posthog\.com/.test(url))).toEqual([]);
  expect((await page.context().cookies()).map((cookie) => cookie.name)).toEqual(["wb_consent"]);

  await page.goto("/about");
  await expect(banner(page)).toHaveCount(0);
});

test("keyboard: the banner comes first and a choice moves focus to the page", async ({ page }) => {
  await prepare(page, { choice: "none" });
  await page.goto("/");
  await expect(banner(page)).toBeVisible();

  await page.keyboard.press("Tab");
  await expect(banner(page).getByRole("link", { name: "Learn more about cookies" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(banner(page).getByRole("button", { name: "Necessary only" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(banner(page).getByRole("button", { name: "Accept all" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(banner(page).getByRole("button", { name: "Settings" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Enter");

  await expect(banner(page)).toHaveCount(0);
  await expect(page.locator("main")).toBeFocused();
  expect(await consentCookie(page)).toMatch(/^1\.s1m1\./);
});

test("settings from the banner: statistics only, and click IDs stay out of the cookie", async ({ page }) => {
  const requests = await prepare(page, { choice: "none" });
  await page.goto(LANDING);
  await expect.poll(() => events(page, "page_view")).toHaveLength(1);
  await banner(page).getByRole("button", { name: "Settings" }).click();

  await expect(panel(page)).toBeVisible();
  await expect(panel(page).getByRole("heading", { name: "Cookie settings" })).toBeVisible();
  const titleSize = await panel(page)
    .getByRole("heading", { name: "Cookie settings" })
    .evaluate((node) => getComputedStyle(node).fontSize);
  expect(titleSize).toBe("14px");
  const join = page.locator('.desktop-actions a[href="/waitlist"]');
  const contact = page.locator('.desktop-actions a[href="/contact"]');
  expect(await buttonShell(panel(page).getByRole("button", { name: "Accept all" }))).toEqual(await buttonShell(join));
  expect(await buttonShell(panel(page).getByRole("button", { name: "Save choices" }))).toEqual(
    await buttonShell(contact),
  );
  const necessary = panel(page).getByRole("switch", { name: "Necessary" });
  const statistics = panel(page).getByRole("switch", { name: "Statistics" });
  const marketing = panel(page).getByRole("switch", { name: "Marketing" });
  await expect(necessary).toHaveAttribute("aria-checked", "true");
  await expect(necessary).toHaveAttribute("aria-disabled", "true");
  await expect(statistics).toHaveAttribute("aria-checked", "false");
  await expect(marketing).toHaveAttribute("aria-checked", "false");
  await expect(statistics).toBeFocused();
  const switchLook = (locator: ReturnType<Page["locator"]>) =>
    locator.evaluate((node) => {
      const style = getComputedStyle(node);
      const thumb = node.querySelector("[data-slot=switch-thumb]");
      const thumbStyle = thumb ? getComputedStyle(thumb) : null;
      const overBlack = (color: string) => {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const context = canvas.getContext("2d");
        if (!context) {
          return [0, 0, 0];
        }
        context.fillStyle = "#000";
        context.fillRect(0, 0, 1, 1);
        context.fillStyle = color;
        context.fillRect(0, 0, 1, 1);
        const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;
        return [red, green, blue];
      };
      return {
        opacity: style.opacity,
        width: Number.parseFloat(style.width),
        height: Number.parseFloat(style.height),
        trackRgb: overBlack(style.backgroundColor),
        thumbRgb: overBlack(thumbStyle?.backgroundColor ?? "rgba(0, 0, 0, 0)"),
      };
    });
  const necessaryLook = await switchLook(necessary);
  const statisticsLook = await switchLook(statistics);
  const marketingLook = await switchLook(marketing);
  expect(necessaryLook.opacity).toBe("1");
  expect(statisticsLook.opacity).toBe("1");
  expect(marketingLook.opacity).toBe("1");
  expect(contrast(necessaryLook.trackRgb, [0, 0, 0])).toBeGreaterThanOrEqual(3);
  expect(contrast(statisticsLook.trackRgb, [0, 0, 0])).toBeGreaterThanOrEqual(3);
  expect(contrast(marketingLook.trackRgb, [0, 0, 0])).toBeGreaterThanOrEqual(3);
  expect(contrast(necessaryLook.thumbRgb, necessaryLook.trackRgb)).toBeGreaterThanOrEqual(3);
  expect(contrast(statisticsLook.thumbRgb, statisticsLook.trackRgb)).toBeGreaterThanOrEqual(3);
  expect(contrast(marketingLook.thumbRgb, marketingLook.trackRgb)).toBeGreaterThanOrEqual(3);
  expect(luminance(necessaryLook.trackRgb)).toBeGreaterThan(luminance(statisticsLook.trackRgb));
  expect(necessaryLook.width).toBeGreaterThan(24);
  expect(necessaryLook.height).toBeGreaterThan(14);
  const descriptionSize = await panel(page)
    .getByText("Necessary cookies keep the site working and are always on.", { exact: false })
    .evaluate((node) => getComputedStyle(node).fontSize);
  expect(descriptionSize).toBe("12px");
  await expect(panel(page)).toContainText("Google Analytics, PostHog, Amplitude, Vercel Speed Insights");

  await statistics.click();
  await expect.poll(async () => {
    const statisticsOn = await switchLook(statistics);
    return (
      statisticsOn.opacity === "1" &&
      contrast(statisticsOn.trackRgb, [0, 0, 0]) >= 3 &&
      contrast(statisticsOn.thumbRgb, statisticsOn.trackRgb) >= 3 &&
      luminance(statisticsOn.trackRgb) > luminance(necessaryLook.trackRgb)
    );
  }).toBe(true);
  await panel(page).getByRole("button", { name: "Save choices" }).click();

  await expect(panel(page)).toBeHidden();
  await expect(banner(page)).toHaveCount(0);
  expect(await consentCookie(page)).toMatch(/^1\.s1m0\./);
  const attribution = (await page.context().cookies()).find((cookie) => cookie.name === "wb_attr")?.value ?? "";
  expect(decodeURIComponent(attribution)).toContain("qa_test");
  expect(decodeURIComponent(attribution)).not.toContain("TEST");
  const updates = (await dataLayer(page)).filter((entry) => entry.event === "consent_update");
  expect(updates).toEqual([{ event: "consent_update", consent_statistics: true, consent_marketing: false }]);
  await expect.poll(() => requests.filter((url) => url.includes("gtm.js?id=GTM-E2ETEST")).length).toBe(1);
});

test("withdrawal from the footer removes stored data and reloads the page", async ({ page }) => {
  const requests = await prepare(page, { choice: "none" });
  const records = consentLog(page);
  await storeConsent(page, true, true);
  await page.goto(LANDING);
  await expect.poll(() => events(page, "page_view")).toHaveLength(1);
  await page.context().addCookies(
    ["_ga", "_ga_TEST", "_gcl_au", "_fbp", "_clck"].map((name) => ({ name, value: "1", url: "http://localhost:3100" })),
  );
  // Keys the real PostHog, Amplitude and Meta pixel leave on production.
  await page.evaluate(() => {
    localStorage.setItem("ph_phc_e2e_test_key_posthog", "{}");
    localStorage.setItem("amplitude.engagement.e2e", "{}");
    localStorage.setItem("lastExternalReferrer", "google");
    localStorage.setItem("lastExternalReferrerTime", "1");
  });
  expect((await page.context().cookies()).map((cookie) => cookie.name)).toContain("wb_attr");

  await page.locator(".site-footer").getByRole("button", { name: "Cookie settings" }).click();
  await expect(panel(page).getByRole("switch", { name: "Statistics" })).toHaveAttribute("aria-checked", "true");
  await expect(panel(page).getByRole("switch", { name: "Marketing" })).toHaveAttribute("aria-checked", "true");

  const reloaded = page.waitForEvent("load");
  await panel(page).getByRole("button", { name: "Necessary only" }).click();
  await reloaded;
  // Count only what the reloaded page asks for: the old page's lazy loaders
  // may still have been running when the button was pressed.
  requests.length = 0;
  await expect.poll(() => events(page, "page_view")).toHaveLength(1);
  await page.waitForTimeout(4500);

  expect((await page.context().cookies()).map((cookie) => cookie.name)).toEqual(["wb_consent"]);
  expect(await consentCookie(page)).toMatch(/^1\.s0m0\./);
  // The record of the withdrawal survives the reload.
  expect(records).toEqual([expect.objectContaining({ statistics: false, marketing: false, source: "settings" })]);
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
  expect(requests.filter((url) => /googletagmanager|\/ingest\/|speed-insights/.test(url))).toEqual([]);
  await expect(banner(page)).toHaveCount(0);
});

test("keyboard: Escape closes the panel without a choice and returns focus", async ({ page }) => {
  await prepare(page, { choice: "none" });
  await page.goto("/");
  const settings = banner(page).getByRole("button", { name: "Settings" });
  await settings.focus();
  await page.keyboard.press("Enter");

  const statistics = panel(page).getByRole("switch", { name: "Statistics" });
  await expect(statistics).toBeFocused();
  await page.keyboard.press("Space");
  await expect(statistics).toHaveAttribute("aria-checked", "true");
  await page.keyboard.press("Escape");

  await expect(panel(page)).toBeHidden();
  await expect(settings).toBeFocused();
  await expect(banner(page)).toBeVisible();
  expect(await consentCookie(page)).toBeUndefined();
});

test("necessary only: the footer offers Cookie settings with the stored choice", async ({ page }) => {
  await prepare(page);
  await page.goto("/");
  await page.locator(".site-footer").getByRole("button", { name: "Cookie settings" }).click();
  await expect(panel(page)).toBeVisible();
  await expect(panel(page).getByRole("switch", { name: "Statistics" })).toHaveAttribute("aria-checked", "false");
  await panel(page).getByRole("button", { name: "Close" }).click();
  await expect(panel(page)).toBeHidden();
});

test("Learn more leads to the cookie section, which describes what the site does", async ({ page }) => {
  await prepare(page, { choice: "none" });
  await page.goto("/");
  await banner(page).getByRole("link", { name: "Learn more about cookies" }).click();
  await expect(page).toHaveURL(/\/legal\/privacy-policy#cookies$/);

  const heading = page.locator("h2#cookies");
  await expect(heading).toHaveText("4. Cookies & Tracking");
  await expect(heading).toBeInViewport();
  // The banner stays until the visitor chooses.
  await expect(banner(page)).toBeVisible();

  const policy = page.locator("article, main").first();
  for (const text of ["Necessary only", "180 days", "Cookie settings", "Amplitude", "Vercel Speed Insights", "wb_consent"]) {
    await expect(policy).toContainText(text);
  }
  await expect(policy).not.toContainText("runs without consent");
  await expect(policy).not.toContainText("preferences, statistics and marketing");
});
