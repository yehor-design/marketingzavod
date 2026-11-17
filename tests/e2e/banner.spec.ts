import { expect, test, type Page } from "@playwright/test";
import { dataLayer, events, prepare } from "./helpers";

const banner = (page: Page) => page.locator("[data-consent-banner]");

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
  expect(a?.width).toBe(b?.width);
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
  await page.keyboard.press("Enter");

  await expect(banner(page)).toHaveCount(0);
  await expect(page.locator("main")).toBeFocused();
  expect(await consentCookie(page)).toMatch(/^1\.s1m1\./);
});
