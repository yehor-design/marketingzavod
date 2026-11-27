import { expect, test } from "@playwright/test";
import { BG_SITE_METADATA } from "@/content/bg/metadata";

test.describe("BG Open Graph share image (CR-21, DS-25, CR-A11)", () => {
  test("serves a 1200x630 PNG from /opengraph-image", async ({ request }) => {
    const response = await request.get("/opengraph-image");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");

    const bytes = await response.body();
    // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
    expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
    // IHDR chunk width (bytes 16..19) and height (bytes 20..23) big-endian
    expect(bytes.readUInt32BE(16)).toBe(1200);
    expect(bytes.readUInt32BE(20)).toBe(630);
  });

  test("wires og:image and verbatim og:image:alt on / and /blog", async ({ page }) => {
    for (const route of ["/", "/blog"]) {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);

      const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
      expect(ogImage ?? "").toContain("/opengraph-image");
      await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
        "content",
        BG_SITE_METADATA.ogImage.alt,
      );
      await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
        "content",
        "1200",
      );
      await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute(
        "content",
        "630",
      );
    }
  });
});
