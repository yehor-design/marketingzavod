import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

/**
 * End-to-end tests run against a production build with tracking in debug mode
 * and placeholder IDs. Every third-party request is intercepted in the tests,
 * so nothing reaches a real analytics account.
 */
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: { baseURL: `http://localhost:${PORT}`, trace: "on-first-retry" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run build && npm run start -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
    env: {
      NEXT_PUBLIC_TRACKING_DEBUG: "true",
      NEXT_PUBLIC_GTM_ID: "GTM-E2ETEST",
      NEXT_PUBLIC_POSTHOG_KEY: "phc_e2e_test_key",
      NEXT_PUBLIC_POSTHOG_HOST: "https://eu.i.posthog.com",
      // Keeps a real project token from .env.local out of the test build.
      NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN: "",
      NEXT_PUBLIC_AMPLITUDE_API_KEY: "",
    },
  },
});
