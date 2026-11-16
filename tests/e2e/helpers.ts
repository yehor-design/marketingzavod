import type { Page } from "@playwright/test";

export type Entry = Record<string, unknown> & { event?: string };

type Consent = { preferences: boolean; statistics: boolean; marketing: boolean };

let ipCounter = 0;

/**
 * Keeps the test offline: GTM and PostHog requests are answered locally and
 * recorded. Each page also gets its own client address, so the lead API's
 * rate limit never couples one test to another.
 */
export async function prepare(page: Page) {
  const requests: string[] = [];
  ipCounter += 1;
  await page.setExtraHTTPHeaders({
    "x-forwarded-for": `198.51.${Math.floor(Math.random() * 250)}.${(ipCounter % 250) + 1}`,
  });
  await page.route(/googletagmanager\.com/, (route) => {
    requests.push(route.request().url());
    return route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
  });
  await page.route(/\/ingest\//, (route) => {
    requests.push(route.request().url());
    return route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
  });
  await page.route(/\/_vercel\//, (route) =>
    route.fulfill({ status: 200, contentType: "application/javascript", body: "" }),
  );
  return requests;
}

/** Puts a Cookiebot double on the page before any script runs. */
export async function stubCookiebot(page: Page, consent: Consent, answered = true) {
  await page.addInitScript(
    ({ consent, answered }) => {
      (window as unknown as Record<string, unknown>).Cookiebot = {
        consent: { necessary: true, ...consent },
        hasResponse: answered,
        renew() {
          (window as unknown as Record<string, unknown>).__cookiebotRenewed = true;
        },
      };
    },
    { consent, answered },
  );
}

/** Changes the visitor's choice the way Cookiebot does: new state, then its event. */
export async function changeConsent(page: Page, consent: Consent) {
  await page.evaluate((next) => {
    const cookiebot = (window as unknown as { Cookiebot: { consent: Record<string, boolean> } }).Cookiebot;
    cookiebot.consent = { necessary: true, ...next };
    window.dispatchEvent(new Event(next.statistics || next.marketing ? "CookiebotOnAccept" : "CookiebotOnDecline"));
  }, consent);
}

export async function dataLayer(page: Page): Promise<Entry[]> {
  return page.evaluate(() => JSON.parse(JSON.stringify(window.dataLayer ?? [])) as Entry[]);
}

export async function events(page: Page, name: string): Promise<Entry[]> {
  return (await dataLayer(page)).filter((entry) => entry.event === name);
}

/** Stops link clicks from leaving the page. The tracker listens earlier, in the capture phase. */
export async function freezeNavigation(page: Page) {
  await page.evaluate(() => document.addEventListener("click", (event) => event.preventDefault()));
}

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
