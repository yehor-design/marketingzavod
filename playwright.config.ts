import { defineConfig, devices } from "@playwright/test";
import { EDITION, isBg } from "./lib/edition";

const PORT = isBg ? 3102 : 3100;

const jetProject = {
  name: "jet",
  testIgnore: ["**/bg/**"],
  use: { ...devices["Desktop Chrome"] },
};

const bgProject = {
  name: "bg",
  testMatch: ["**/bg/**/*.spec.ts"],
  use: { ...devices["Desktop Chrome"] },
};

/**
 * End-to-end tests run against a production build with tracking in debug mode
 * and placeholder IDs. Every third-party request is intercepted in the tests,
 * so nothing reaches a real analytics account.
 *
 * The active edition (`jet` by default, or `bg` via NEXT_PUBLIC_SITE_EDITION=bg)
 * selects both the Next.js build edition and the matching Playwright project.
 */
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: { baseURL: `http://localhost:${PORT}`, trace: "on-first-retry" },
  projects: isBg ? [bgProject] : [jetProject],
  webServer: {
    command: `npm run build && npm run start -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
    env: {
      NEXT_PUBLIC_SITE_EDITION: EDITION,
      NEXT_PUBLIC_TRACKING_DEBUG: "true",
      NEXT_PUBLIC_GTM_ID: "GTM-E2ETEST",
      // A placeholder key, so the tests can prove Amplitude waits for consent.
      NEXT_PUBLIC_AMPLITUDE_API_KEY: "e2e_amplitude_key",
    },
  },
});
