import { expect, test, type Page } from "@playwright/test";
import { dataLayer, events, prepare, storeConsent } from "./helpers";

const banner = (page: Page) => page.locator("[data-consent-banner]");
const panel = (page: Page) => page.locator("[data-consent-settings]");
const LANDING = "/?utm_source=qa&utm_medium=cpc&utm_campaign=qa_test&gclid=TEST";

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
  const [a, b] = [await necessary.boundingBox(), await accept.boundingBox()];
  // Equal up to subpixel rounding.
  expect(Math.abs((a?.width ?? 0) - (b?.width ?? 0))).toBeLessThan(0.5);
  expect(a?.height).toBe(b?.height);
  const look = (selector: string) =>
    banner(page)
      .getByRole("button", { name: selector })
      .evaluate((node) => {
        const style = getComputedStyle(node);
        return [style.backgroundColor, style.color, style.fontSize, style.borderRadius].join(" ");
      });
  expect(await look("Necessary only")).toBe(await look("Accept all"));

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

test("accept all: one click stores the choice, starts GTM and the banner stays away", async ({ page }) => {
  const requests = await prepare(page, { choice: "none" });
  await page.goto("/");
  await expect.poll(() => events(page, "page_view")).toHaveLength(1);
  await banner(page).getByRole("button", { name: "Accept all" }).click();

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
  const necessary = panel(page).getByRole("switch", { name: "Necessary" });
  const statistics = panel(page).getByRole("switch", { name: "Statistics" });
  const marketing = panel(page).getByRole("switch", { name: "Marketing" });
  await expect(necessary).toHaveAttribute("aria-checked", "true");
  await expect(necessary).toHaveAttribute("aria-disabled", "true");
  await expect(statistics).toHaveAttribute("aria-checked", "false");
  await expect(marketing).toHaveAttribute("aria-checked", "false");
  await expect(statistics).toBeFocused();
  await expect(panel(page)).toContainText("Google Analytics, PostHog, Microsoft Clarity, Amplitude, Vercel Speed Insights");

  await statistics.click();
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
  await storeConsent(page, true, true);
  await page.goto(LANDING);
  await expect.poll(() => events(page, "page_view")).toHaveLength(1);
  await page.context().addCookies(
    ["_ga", "_ga_TEST", "_gcl_au", "_fbp", "_clck"].map((name) => ({ name, value: "1", url: "http://localhost:3100" })),
  );
  await page.evaluate(() => localStorage.setItem("ph_phc_e2e_test_key_posthog", "{}"));
  expect((await page.context().cookies()).map((cookie) => cookie.name)).toContain("wb_attr");

  await page.locator(".site-footer").getByRole("button", { name: "Cookie settings" }).click();
  await expect(panel(page).getByRole("switch", { name: "Statistics" })).toHaveAttribute("aria-checked", "true");
  await expect(panel(page).getByRole("switch", { name: "Marketing" })).toHaveAttribute("aria-checked", "true");

  requests.length = 0;
  const reloaded = page.waitForEvent("load");
  await panel(page).getByRole("button", { name: "Necessary only" }).click();
  await reloaded;
  await expect.poll(() => events(page, "page_view")).toHaveLength(1);
  await page.waitForTimeout(4500);

  expect((await page.context().cookies()).map((cookie) => cookie.name)).toEqual(["wb_consent"]);
  expect(await consentCookie(page)).toMatch(/^1\.s0m0\./);
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
