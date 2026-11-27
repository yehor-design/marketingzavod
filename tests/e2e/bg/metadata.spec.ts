import { expect, test } from "@playwright/test";
import { BG_ROUTE_METADATA, BG_SITE_METADATA, stripBgTitleSuffix } from "@/content/bg/metadata";
import { SITE_URL } from "@/lib/site";

test.describe("BG metadata & <head> tags (CR-17…CR-20, CR-23, CR-52, CR-A6)", () => {
  test("home page renders verbatim file 30 metadata, home OG card, and clean canonical without query params", async ({
    page,
  }) => {
    const response = await page.goto("/?utm_source=test&tema=pilot", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    await expect(page.locator("html")).toHaveAttribute("lang", "bg");
    await expect(page).toHaveTitle(BG_ROUTE_METADATA.home.title);

    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      BG_ROUTE_METADATA.home.description,
    );
    await expect(page.locator('meta[name="application-name"]')).toHaveAttribute(
      "content",
      BG_SITE_METADATA.siteName,
    );
    const canonicalHref = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonicalHref?.replace(/\/$/, "")).toBe(SITE_URL);
    expect(canonicalHref).not.toContain("?");
    expect(canonicalHref).not.toContain("utm_source");

    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
      "content",
      BG_SITE_METADATA.siteName,
    );
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "bg_BG");
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      BG_SITE_METADATA.homeCard.title,
    );
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      "content",
      BG_SITE_METADATA.homeCard.description,
    );
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      "content",
      BG_SITE_METADATA.homeCard.title,
    );
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute(
      "content",
      BG_SITE_METADATA.homeCard.description,
    );
  });

  test("blog index strips suffix in og:title and uses file 30 title, description, and canonical", async ({
    page,
  }) => {
    const response = await page.goto("/blog", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    await expect(page.locator("html")).toHaveAttribute("lang", "bg");
    await expect(page).toHaveTitle(BG_ROUTE_METADATA.blog.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      BG_ROUTE_METADATA.blog.description,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${SITE_URL}/blog`,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      stripBgTitleSuffix(BG_ROUTE_METADATA.blog.title),
    );
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "bg_BG");
  });

  test("404 route returns HTTP 404 with lang=bg, file 30 title, fallback description, and noindex", async ({
    page,
  }) => {
    const response = await page.goto("/neisnuvashta-stranitsa-cr-a6", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBe(404);

    await expect(page.locator("html")).toHaveAttribute("lang", "bg");
    await expect(page).toHaveTitle(BG_ROUTE_METADATA.notFound.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      BG_SITE_METADATA.defaultDescription,
    );
    const robotsValues = await page
      .locator('meta[name="robots"]')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("content") ?? ""));
    expect(robotsValues.length).toBeGreaterThan(0);
    expect(robotsValues.every((value) => value.includes("noindex"))).toBe(true);
  });
});
