import { expect, test } from "@playwright/test";
import { careerSlugs, updateSlugs } from "../../../lib/routes";

const JET_ONLY_ROUTES = [
  "/careers",
  `/careers/${careerSlugs[0]}`,
  "/updates",
  `/updates/${updateSlugs[0]}`,
  "/waitlist",
  "/checkout",
];

test.describe("bg edition route isolation (CR-04, CR-31)", () => {
  for (const route of JET_ONLY_ROUTES) {
    test(`returns HTTP 404 for Jet-only route ${route}`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(404);
    });
  }
});
