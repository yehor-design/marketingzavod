import type { Page } from "@playwright/test";

export type Entry = Record<string, unknown> & { event?: string };

let ipCounter = 0;

/**
 * Keeps the test offline: GTM, Amplitude and Vercel requests are answered locally and
 * recorded. Each page also gets its own client address, so the lead API's
 * rate limit never couples one test to another.
 *
 * Test builds show the consent banner. Unless a test is about the first visit
 * (choice "none"), the visitor has already chosen "Necessary only": tracking
 * then behaves exactly as with no choice, and the banner stays out of the way.
 */
export async function prepare(page: Page, { choice = "necessary" }: { choice?: "none" | "necessary" } = {}) {
  const requests: string[] = [];
  if (choice === "necessary") {
    await storeConsent(page, false, false);
  }
  ipCounter += 1;
  await page.setExtraHTTPHeaders({
    "x-forwarded-for": `198.51.${Math.floor(Math.random() * 250)}.${(ipCounter % 250) + 1}`,
  });
  await page.route(/googletagmanager\.com/, (route) => {
    requests.push(route.request().url());
    return route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
  });
  // Amplitude events, Session Replay and its remote config. Nothing may reach them before consent.
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

/** Stores a consent choice the way the banner does, before the page loads. */
export async function storeConsent(page: Page, statistics: boolean, marketing: boolean) {
  const decidedAt = Math.floor(Date.now() / 1000) - 60;
  await page.context().addCookies([
    {
      name: "mz_consent",
      value: `1.s${statistics ? 1 : 0}m${marketing ? 1 : 0}.${decidedAt}.0f8c2b1d9e7a4c6b8d0e1f2a3b4c5d6e`,
      url: "http://localhost:3100",
    },
  ]);
}

export async function dataLayer(page: Page): Promise<Entry[]> {
  return page.evaluate(() => JSON.parse(JSON.stringify(window.dataLayer ?? [])) as Entry[]);
}

export async function events(page: Page, name: string): Promise<Entry[]> {
  return (await dataLayer(page)).filter((entry) => entry.event === name);
}

/** Opens the contact reason list and chooses one option by its visible label. */
export async function chooseContactReason(page: Page, label: string) {
  await page.getByRole("combobox", { name: "Reason for contact" }).click();
  await page.getByRole("option", { name: label, exact: true }).click();
}

/** Stops link clicks from leaving the page. The tracker listens earlier, in the capture phase. */
export async function freezeNavigation(page: Page) {
  await page.evaluate(() => document.addEventListener("click", (event) => event.preventDefault()));
}

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
