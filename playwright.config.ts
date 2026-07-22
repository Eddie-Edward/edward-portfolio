import { defineConfig, devices } from "@playwright/test";

/**
 * Smoke-test config. Boots the Next.js dev server and runs the e2e suite
 * against it. Keep this fast — it is a QA gate, not a full regression suite.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // One retry everywhere: full-page visual snapshots contend with API tests
  // on the single dev server and can surface transient ECONNRESETs. Real
  // failures still fail; genuine flakes get reported as "flaky".
  retries: 1,
  reporter: [["list"]],
  timeout: 60_000,
  use: {
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "chromium-mobile",
      // A Chromium-based device profile so a single browser install suffices.
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: {
    command: "npx next dev -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
