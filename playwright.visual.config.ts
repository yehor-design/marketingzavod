import { defineConfig, devices } from "@playwright/test";

const PORT = 3101;

/**
 * Visual regression tests for the English (jet) edition.
 * Kept separate from playwright.config.ts so `npm run test:e2e` stays unchanged.
 *
 * Baselines live in tests/visual/__snapshots__/{platform}/ and are checked at
 * 390, 1024 and 1440 px with reduced motion, frozen clock and canvas/video masks.
 */
export default defineConfig({
  testDir: "tests/visual",
  timeout: 90_000,
  snapshotPathTemplate: "{testDir}/__snapshots__/{platform}/{arg}{ext}",
  outputDir: "test-results/visual",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never", outputFolder: "playwright-visual-report" }]]
    : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    reducedMotion: "reduce",
    trace: "on-first-retry",
  },
  expect: {
    timeout: 30_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.001,
      animations: "disabled",
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `npm run build && npm run start -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
    env: {
      NEXT_PUBLIC_TRACKING_DEBUG: "true",
      NEXT_PUBLIC_GTM_ID: "GTM-E2ETEST",
      NEXT_PUBLIC_AMPLITUDE_API_KEY: "e2e_amplitude_key",
    },
  },
});
