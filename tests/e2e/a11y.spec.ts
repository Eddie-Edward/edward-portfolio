import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Automated accessibility gate: axe-core over the key pages. Serious and
 * critical violations fail the build; reduced motion is emulated so
 * in-flight entrance animations can't hide content from the scan.
 */

const PAGES = ["/", "/projects/jarvis-os", "/projects/lockin"];

test.describe("axe accessibility scan", () => {
  test.skip(({ isMobile }) => !!isMobile, "scan once per page on desktop");

  for (const path of PAGES) {
    test(`no serious or critical violations on ${path}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(path);
      // Let whileInView reveals settle so axe sees final visible states.
      await page.evaluate(async () => {
        const step = window.innerHeight;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(400);

      const results = await new AxeBuilder({ page }).analyze();
      const blocking = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      expect(
        blocking.map((v) => `${v.id}: ${v.help} (${v.nodes.length} nodes)`),
        `axe must find no serious/critical issues on ${path}`,
      ).toEqual([]);
    });
  }
});
