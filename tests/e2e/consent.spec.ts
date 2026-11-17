import { expect, test, type Page } from "@playwright/test";
import { dataLayer, events, prepare, storeConsent } from "./helpers";

const LANDING = "/?utm_source=qa&utm_medium=cpc&utm_campaign=qa_test&gclid=TEST";

async function cookieNames(page: Page): Promise<string[]> {
  return (await page.context().cookies()).map((cookie) => cookie.name);
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

const DENIED = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
  functionality_storage: "denied",
  personalization_storage: "denied",
  security_storage: "granted",
};
const GRANTED_ALL = {
  ...DENIED,
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
  analytics_storage: "granted",
};

/** Lets lazy loaders (PostHog waits for idle time, up to 4 s) have their chance. */
async function settle(page: Page) {
  await page.waitForTimeout(4500);
}

const thirdParty = (requests: string[]) =>
  requests.filter((url) => /googletagmanager\.com|\/ingest\/|\/_vercel\/speed-insights|amplitude\.com|posthog\.com/.test(url));

test("no choice: the IDs are in the dataLayer, but nothing reaches Google, PostHog or Vercel", async ({ page }) => {
  const requests = await prepare(page, { choice: "none" });
  await page.goto("/");
  await expect.poll(() => events(page, "page_view")).toHaveLength(1);
  await expect(page.locator("[data-consent-banner]")).toBeVisible();
  await settle(page);

  // A1: before a choice nothing at all is stored on the device.
  expect(await page.context().cookies()).toEqual([]);
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);

  const layer = await dataLayer(page);
  expect(layer[0].consent_ready).toBe("false");
  expect(layer.filter((entry) => entry.event === "gtm.js")).toEqual([]);
  expect(layer.filter((entry) => entry[0] === "consent")).toEqual([]);
  expect(thirdParty(requests)).toEqual([]);
  // No <noscript> GTM fallback: without JavaScript there is no consent.
  expect(await page.content()).not.toContain("ns.html?id=");
});

test("stored choice to allow everything: GTM starts with that consent before page_view", async ({ page }) => {
  const requests = await prepare(page);
  await storeConsent(page, true, true);
  await page.goto("/");
  await expect.poll(() => events(page, "page_view")).toHaveLength(1);

  const layer = await dataLayer(page);
  const start = layer.findIndex((entry) => entry.event === "gtm.js");
  const view = layer.findIndex((entry) => entry.event === "page_view");
  expect(layer[0].consent_ready).toBe("false");
  // gtag() pushes its arguments object: consent, default, state.
  expect(layer[1]).toEqual({ 0: "consent", 1: "default", 2: GRANTED_ALL });
  expect(layer[2]).toEqual({ consent_statistics: true, consent_marketing: true });
  expect(start).toBe(3);
  expect(view).toBeGreaterThan(start);
  await expect.poll(() => requests.filter((url) => url.includes("gtm.js?id=GTM-E2ETEST")).length).toBe(1);
  await expect.poll(() => requests.filter((url) => url.includes("/ingest/")).length, { timeout: 10_000 }).toBeGreaterThan(0);
  await expect.poll(() => requests.filter((url) => url.includes("/_vercel/speed-insights")).length).toBeGreaterThan(0);
});

test("stored choice of statistics only: analytics granted, advertising denied", async ({ page }) => {
  const requests = await prepare(page);
  await storeConsent(page, true, false);
  await page.goto("/");
  await expect.poll(() => events(page, "page_view")).toHaveLength(1);

  const layer = await dataLayer(page);
  expect(layer[1]).toEqual({ 0: "consent", 1: "default", 2: { ...DENIED, analytics_storage: "granted" } });
  expect(layer[2]).toEqual({ consent_statistics: true, consent_marketing: false });
  await expect.poll(() => requests.filter((url) => url.includes("gtm.js?id=GTM-E2ETEST")).length).toBe(1);
});

test("stored choice of necessary only: the same as no choice", async ({ page }) => {
  const requests = await prepare(page);
  await storeConsent(page, false, false);
  await page.goto("/");
  await expect.poll(() => events(page, "page_view")).toHaveLength(1);
  await settle(page);

  const layer = await dataLayer(page);
  expect(layer.filter((entry) => entry.event === "gtm.js" || entry[0] === "consent")).toEqual([]);
  expect(thirdParty(requests)).toEqual([]);
});

test("necessary only: no analytics cookies, only UTM leaves with the form", async ({ page }) => {
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
  expect(names).toContain("wb_consent");
  expect(names).not.toContain("wb_attr");
  expect(names.filter((name) => /^(ph_|_ga|_gcl|_fb|_clck|_clsk|li_)/.test(name))).toEqual([]);
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith("ph_")))).toEqual([]);
  expect(await events(page, "page_view")).toHaveLength(3);
});

test("necessary only: Amplitude and PostHog's own hosts are never contacted", async ({ page }) => {
  const requests = await prepare(page);
  await page.goto("/waitlist");
  await page.getByPlaceholder("Enter your email").fill("amplitude.tester@example.com");
  await page.getByRole("button", { name: "Join now" }).click();
  await expect(page.locator('[data-form-success="waitlist"]')).toBeVisible();
  await page.goto("/");
  await expect.poll(() => events(page, "page_view")).toHaveLength(1);

  expect(requests.filter((url) => /amplitude\.com|posthog\.com/.test(url))).toEqual([]);
  const names = await cookieNames(page);
  expect(names.filter((name) => name.startsWith("AMP_"))).toEqual([]);
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith("AMP_")))).toEqual([]);
});
