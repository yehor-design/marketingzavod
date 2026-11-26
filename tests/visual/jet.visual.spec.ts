import fs from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { posts } from "../../lib/blog";
import { legalDocuments } from "../../lib/legal";
import { careerSlugs, updateSlugs } from "../../lib/routes";

const VISUAL_ORIGIN = "http://localhost:3101";
const FROZEN_TIME = new Date("2026-11-26T12:00:00Z");
const FROZEN_DECIDED_AT = Math.floor(FROZEN_TIME.getTime() / 1000) - 60;
const YOUTUBE_POSTER_FALLBACK = fs.readFileSync(
  path.join(process.cwd(), "public/updates/may.jpg"),
);

const VIEWPORTS = [
  { name: "390", width: 390, height: 844 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1440", width: 1440, height: 900 },
] as const;

type VisualRoute = {
  name: string;
  path: string;
  expectedStatus?: number;
};

const ROUTES: VisualRoute[] = [
  { name: "home", path: "/" },
  { name: "pricing", path: "/pricing" },
  { name: "about", path: "/about" },
  { name: "contact", path: "/contact" },
  { name: "careers", path: "/careers" },
  { name: "career-detail", path: `/careers/${careerSlugs[0]}` },
  { name: "blog", path: "/blog" },
  { name: "blog-detail", path: `/blog/${posts[0].slug}` },
  ...legalDocuments.map((doc) => ({
    name: `legal-${doc.slug}`,
    path: `/legal/${doc.slug}`,
  })),
  { name: "updates", path: "/updates" },
  { name: "update-detail", path: `/updates/${updateSlugs[0]}` },
  { name: "waitlist", path: "/waitlist" },
  { name: "checkout", path: "/checkout" },
  { name: "not-found", path: "/visual-not-found-check", expectedStatus: 404 },
  { name: "styleguide", path: "/dev/styleguide" },
];

async function prepareVisualPage(page: Page, choice: "necessary" | "none") {
  await page.clock.setFixedTime(FROZEN_TIME);

  if (choice === "necessary") {
    await page.context().addCookies([
      {
        name: "mz_consent",
        value: `1.s0m0.${FROZEN_DECIDED_AT}.0f8c2b1d9e7a4c6b8d0e1f2a3b4c5d6e`,
        url: VISUAL_ORIGIN,
      },
    ]);
  }

  await page.route(/googletagmanager\.com/, (route) =>
    route.fulfill({ status: 200, contentType: "application/javascript", body: "" }),
  );
  await page.route(/amplitude\.com/, (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "{}" }),
  );
  await page.route(/\/_vercel\//, (route) =>
    route.fulfill({ status: 200, contentType: "application/javascript", body: "" }),
  );
  // Keep /updates offline and deterministic when rendering YouTube thumbnail covers.
  await page.route(/i\.ytimg\.com/, (route) =>
    route.fulfill({
      status: 200,
      contentType: "image/jpeg",
      body: YOUTUBE_POSTER_FALLBACK,
    }),
  );
}

async function settlePage(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    const images = Array.from(document.querySelectorAll("img"));
    await Promise.all(
      images.map((img) => {
        if (img.complete) {
          return Promise.resolve();
        }
        return new Promise<void>((resolve) => {
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
        });
      }),
    );
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  });
}

function visualMasks(page: Page) {
  // Masks unstable canvas shaders/dithers (GodRays, Dither, Halftone, PulseGradient)
  // and autoplaying preview video on /checkout.
  return [page.locator("canvas"), page.locator("video")];
}

test.describe("Jet visual baselines (consent accepted)", () => {
  for (const route of ROUTES) {
    for (const viewport of VIEWPORTS) {
      test(`${route.name} @ ${viewport.name}px`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await prepareVisualPage(page, "necessary");

        const response = await page.goto(route.path, { waitUntil: "networkidle" });
        expect(response?.status()).toBe(route.expectedStatus ?? 200);
        await expect(page.locator("[data-consent-banner]")).toHaveCount(0);
        await settlePage(page);

        await expect(page).toHaveScreenshot(`${route.name}-${viewport.name}.png`, {
          fullPage: true,
          maxDiffPixelRatio: 0.001,
          animations: "disabled",
          mask: visualMasks(page),
        });
      });
    }
  }
});

test.describe("Jet visual baselines (consent banner open)", () => {
  for (const viewport of VIEWPORTS) {
    test(`consent-banner-open @ ${viewport.name}px`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await prepareVisualPage(page, "none");

      const response = await page.goto("/", { waitUntil: "networkidle" });
      expect(response?.status()).toBe(200);
      await expect(page.locator("[data-consent-banner]")).toBeVisible();
      await settlePage(page);

      await expect(page).toHaveScreenshot(`consent-banner-open-${viewport.name}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.001,
        animations: "disabled",
        mask: visualMasks(page),
      });
    });
  }
});
