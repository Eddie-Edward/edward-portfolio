import { expect, test } from "@playwright/test";

/**
 * Visual regression at the recruiter-readiness target widths. Snapshots are
 * captured under reduced motion (animations collapse to final states) so
 * diffs reflect layout/styling changes, not animation timing.
 *
 * Baselines are rendered on Edward's machine (win32); CI skips this spec —
 * cross-platform font rasterization makes remote snapshots meaningless.
 */

const WIDTHS = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
  { width: 1920, height: 1080 },
];

test.describe("visual regression", () => {
  test.skip(!!process.env.CI, "snapshots are local-only (win32 baselines)");
  test.skip(({ isMobile }) => !!isMobile, "widths are set explicitly");

  for (const { width, height } of WIDTHS) {
    test(`home page at ${width}x${height}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      // Walk the page so whileInView content reaches its final state.
      await page.evaluate(async () => {
        const step = window.innerHeight;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 80));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(600);
      await expect(page).toHaveScreenshot(`home-${width}x${height}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.02,
      });
    });
  }
});
