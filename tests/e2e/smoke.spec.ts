import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("renders hero with Edward's name and mission", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Edward Lei");
    // Mission text also appears in the footer — scope to the hero.
    await expect(page.locator("#top").getByText("I build AI systems end to end")).toBeVisible();
  });

  test("renders every major section", async ({ page }) => {
    await page.goto("/");
    for (const id of ["about", "systems", "work", "timeline", "skills", "roadmap", "contact"]) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
  });

  test("renders project cards from the content layer", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator("[id^='project-']");
    expect(await cards.count()).toBeGreaterThanOrEqual(8);
    await expect(page.locator("#project-rlarena")).toContainText("RLArena");
    await expect(page.locator("#project-prsense")).toContainText("PRSense");
    await expect(page.locator("#project-interviewcopilot")).toContainText("InterviewCopilot");
  });

  test("case study page renders from content", async ({ page }) => {
    await page.goto("/projects/rlarena");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("RLArena");
    await expect(page.getByText("Why this exists")).toBeVisible();
    await expect(page.getByText("Engineering decisions")).toBeVisible();
  });

  test("unknown project 404s", async ({ page }) => {
    const response = await page.goto("/projects/not-a-real-project");
    expect(response?.status()).toBe(404);
  });
});

test.describe("responsive: no horizontal overflow", () => {
  test.skip(({ isMobile }) => !!isMobile, "viewport sweep runs on the desktop project only");

  for (const width of [1920, 1440, 1024, 390]) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      // Let entrance animations settle, then measure.
      await page.waitForTimeout(1200);
      const overflow = await page.evaluate(() => {
        const el = document.documentElement;
        return el.scrollWidth - el.clientWidth;
      });
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }
});

test.describe("accessibility", () => {
  test("reduced motion still shows all content", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Edward Lei");
    await page.locator("#skills").scrollIntoViewIfNeeded();
    await expect(page.getByText("The stack behind the systems.")).toBeVisible();
  });

  test("keyboard: skip link appears first and nav is focusable", async ({ page, isMobile }) => {
    test.skip(!!isMobile, "keyboard navigation is a desktop concern");
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.getByText("Skip to content")).toBeFocused();
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBe("A");
  });

  test("no private data in the rendered page", async ({ page }) => {
    await page.goto("/");
    const html = await page.content();
    expect(html).not.toMatch(/\(\d{3}\)\s?\d{3}[-.\s]?\d{4}/);
    expect(html).not.toMatch(/\b\d{3}[-.]\d{3}[-.]\d{4}\b/);
  });
});
