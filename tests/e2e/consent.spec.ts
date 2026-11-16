import { expect, test, type Page } from "@playwright/test";
import { changeConsent, dataLayer, events, prepare, stubCookiebot } from "./helpers";

const LANDING = "/?utm_source=qa&utm_medium=cpc&utm_campaign=qa_test&gclid=TEST";
const GRANTED = { preferences: true, statistics: true, marketing: true };
const DENIED = { preferences: false, statistics: false, marketing: false };

async function cookieNames(page: Page): Promise<string[]> {
  return (await page.context().cookies()).map((cookie) => cookie.name);
}

async function attributionCookie(page: Page) {
  const cookie = (await page.context().cookies()).find((item) => item.name === "wb_attr");
  return cookie ? JSON.parse(decodeURIComponent(cookie.value)) : null;
}

/** Walks landing → pricing → contact, sends the form and returns the request body. */
async function submitContact(page: Page) {
  await page.locator('.desktop-nav a[href="/pricing"]').click();
  await expect(page).toHaveURL(/\/pricing$/);
  await page.locator('.desktop-actions a[href="/contact"]').click();
  await expect(page).toHaveURL(/\/contact$/);
  const request = page.waitForRequest((item) => item.url().endsWith("/api/lead"));
  await page.getByLabel("Full name").fill("Consent Tester");
  await page.getByLabel("Email").fill("consent.tester@example.com");
  await page.getByLabel("Reason for contact").selectOption("general");
  await page.getByLabel("How can we help?").fill("Testing consent.");
  await page.getByRole("button", { name: "Get in touch" }).click();
  const body = (await request).postDataJSON();
  await expect(page.locator('[data-form-success="contact"]')).toBeVisible();
  return body;
}

test("GTM starts with the IDs first, then gtm.js, then page_view", async ({ page }) => {
  const requests = await prepare(page);
  await page.goto("/");
  await expect.poll(() => events(page, "page_view")).toHaveLength(1);
  const layer = await dataLayer(page);
  const config = layer.findIndex((entry) => "cookiebot_id" in entry);
  const start = layer.findIndex((entry) => entry.event === "gtm.js");
  const view = layer.findIndex((entry) => entry.event === "page_view");
  expect(config).toBe(0);
  expect(start).toBe(1);
  expect(view).toBeGreaterThan(start);
  await expect.poll(() => requests.filter((url) => url.includes("gtm.js?id=GTM-E2ETEST")).length).toBe(1);
  await expect(page.locator('noscript iframe[src*="ns.html?id=GTM-E2ETEST"]')).toHaveCount(0);
  expect(await page.content()).toContain("ns.html?id=GTM-E2ETEST");
});

test("no choice: no analytics cookies, only UTM leaves with the form", async ({ page }) => {
  await prepare(page);
  await page.goto(LANDING);
  const body = await submitContact(page);

  expect(body.consent).toEqual({ statistics: false, marketing: false, preferences: false });
  expect(body.attribution).toEqual({
    first: { utm_source: "qa", utm_medium: "cpc", utm_campaign: "qa_test" },
    last: { utm_source: "qa", utm_medium: "cpc", utm_campaign: "qa_test" },
  });
  expect(JSON.stringify(body)).not.toContain("TEST");
  expect(body.posthog_distinct_id).toBeUndefined();

  const names = await cookieNames(page);
  expect(names).not.toContain("wb_attr");
  expect(names.filter((name) => /^(ph_|_ga|_gcl|_fb|_clck|_clsk|li_)/.test(name))).toEqual([]);
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith("ph_")))).toEqual([]);
  expect(await events(page, "page_view")).toHaveLength(3);
});

test("declined: same result as no choice", async ({ page }) => {
  await prepare(page);
  await stubCookiebot(page, DENIED);
  await page.goto(LANDING);
  const body = await submitContact(page);

  expect(body.consent).toEqual({ statistics: false, marketing: false, preferences: false });
  expect(JSON.stringify(body.attribution)).not.toContain("TEST");
  expect(await cookieNames(page)).not.toContain("wb_attr");
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith("ph_")))).toEqual([]);
});

test("accepted: attribution cookie, click ID and consent reach the server", async ({ page }) => {
  const requests = await prepare(page);
  await stubCookiebot(page, GRANTED);
  await page.goto(LANDING);

  // PostHog starts with persistence on and talks only to the first-party proxy.
  await expect
    .poll(() => page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith("ph_"))), {
      timeout: 15_000,
    })
    .toEqual(["ph_phc_e2e_test_key_posthog"]);
  await expect.poll(() => requests.some((url) => /\/ingest\/(e|batch|i\/v0\/e|flags)/.test(url))).toBe(true);
  expect(requests.some((url) => url.includes("posthog.com"))).toBe(false);

  await expect.poll(() => attributionCookie(page)).not.toBeNull();
  const stored = await attributionCookie(page);
  expect(stored.first).toMatchObject({ utm_source: "qa", gclid: "TEST" });
  expect(stored.first.landing_page).toMatch(/^http:\/\/localhost:\d+\/$/);

  const body = await submitContact(page);
  expect(body.consent).toEqual({ statistics: true, marketing: true, preferences: true });
  expect(body.posthog_distinct_id).toBeTruthy();
  expect(body.attribution.first).toMatchObject({ utm_source: "qa", utm_campaign: "qa_test", gclid: "TEST" });
  expect(body.attribution.last).toMatchObject({ utm_source: "qa", gclid: "TEST" });

  // A later visit from another campaign moves last touch only.
  await page.goto("/?utm_source=newsletter&utm_medium=email");
  await expect.poll(async () => (await attributionCookie(page))?.last?.utm_source).toBe("newsletter");
  const later = await attributionCookie(page);
  expect(later.first).toMatchObject({ utm_source: "qa", gclid: "TEST" });
  expect(later.last.gclid).toBeUndefined();
});

test("statistics only: the cookie is written without click IDs", async ({ page }) => {
  await prepare(page);
  await stubCookiebot(page, { preferences: false, statistics: true, marketing: false });
  await page.goto(LANDING);
  await expect.poll(() => attributionCookie(page)).not.toBeNull();
  const stored = await attributionCookie(page);
  expect(stored.first).toMatchObject({ utm_source: "qa" });
  expect(JSON.stringify(stored)).not.toContain("TEST");
});

test("consent changes apply without a reload", async ({ page }) => {
  await prepare(page);
  await stubCookiebot(page, DENIED, false);
  await page.goto(LANDING);
  await expect.poll(() => events(page, "page_view")).toHaveLength(1);
  expect(await cookieNames(page)).not.toContain("wb_attr");

  await changeConsent(page, GRANTED);
  await expect.poll(() => attributionCookie(page)).not.toBeNull();
  expect((await attributionCookie(page)).first).toMatchObject({ utm_source: "qa", gclid: "TEST" });

  await changeConsent(page, DENIED);
  await expect.poll(() => cookieNames(page)).not.toContain("wb_attr");
  await expect
    .poll(() => page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith("ph_"))))
    .toEqual([]);
  expect(await events(page, "page_view")).toHaveLength(1);
});

test("the footer reopens the Cookiebot dialog and is keyboard reachable", async ({ page }) => {
  await prepare(page);
  await stubCookiebot(page, DENIED);
  await page.goto("/");
  const button = page.getByRole("button", { name: "Cookie settings" });
  await button.scrollIntoViewIfNeeded();
  await button.focus();
  await page.keyboard.press("Enter");
  expect(await page.evaluate(() => (window as unknown as Record<string, unknown>).__cookiebotRenewed)).toBe(true);
});

test("the privacy page loads the cookie declaration after a client-side navigation", async ({ page }) => {
  await prepare(page);
  const declaration: string[] = [];
  await page.route(/consent\.cookiebot\.com/, (route) => {
    declaration.push(route.request().url());
    return route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
  });
  await page.goto("/");
  await page.locator('.site-footer a[href="/legal/privacy-policy"]').click();
  await expect(page).toHaveURL(/privacy-policy$/);
  await expect(page.locator("script#CookieDeclaration")).toHaveCount(1);
  await expect.poll(() => declaration).toEqual([
    "https://consent.cookiebot.com/00000000-0000-0000-0000-000000000000/cd.js",
  ]);
});
