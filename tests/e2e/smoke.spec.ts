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

test.describe("selected work browsing", () => {
  test("filter chips narrow the grid to matching projects", async ({ page }) => {
    await page.goto("/");
    await page.locator("#work").scrollIntoViewIfNeeded();
    const cards = page.locator("[id^='project-']");
    const allCount = await cards.count();
    expect(allCount).toBeGreaterThanOrEqual(8);

    await page.getByRole("button", { name: /^Shipped/ }).click();
    await expect.poll(() => cards.count()).toBeLessThan(allCount);
    // Every remaining card must actually be shipped.
    for (const text of await cards.allTextContents()) {
      expect(text).toContain("Shipped");
    }

    await page.getByRole("button", { name: /^All/ }).click();
    await expect.poll(() => cards.count()).toBe(allCount);
  });

  test("filter chips are keyboard operable with toggle semantics", async ({ page }) => {
    await page.goto("/");
    await page.locator("#work").scrollIntoViewIfNeeded();
    const cards = page.locator("[id^='project-']");
    const allCount = await cards.count();

    const featured = page.getByRole("button", { name: /^Featured/ });
    await featured.focus();
    await page.keyboard.press("Enter");
    await expect(featured).toHaveAttribute("aria-current", "true");
    await expect.poll(() => cards.count()).toBeLessThan(allCount);
    await expect.poll(() => cards.count()).toBeGreaterThan(0);

    // Re-activating the current lens returns to All.
    await page.keyboard.press("Enter");
    await expect.poll(() => cards.count()).toBe(allCount);
  });
});

test.describe("constellation interaction", () => {
  test("orbs drift ambiently while in view and freeze under focus", async ({
    page,
    isMobile,
  }) => {
    test.skip(!!isMobile, "the constellation map is desktop-only");
    await page.goto("/#systems");
    const drift = page.locator("[data-drift]").first();
    // Ambient wander engages once the section is on screen (GSAP writes an
    // inline transform to the drift wrapper).
    await expect
      .poll(
        () =>
          drift.evaluate(
            (el) => el.style.transform !== "" && el.style.transform !== "none",
          ),
        { timeout: 10_000 },
      )
      .toBe(true);
    // Keyboard focus freezes the drift — the target must hold still.
    // First [data-drift] belongs to the first non-center project (RLArena).
    await page.getByRole("button", { name: /RLArena/ }).focus();
    await page.waitForTimeout(150); // let the pause land
    const before = await drift.evaluate((el) => el.style.transform);
    await page.waitForTimeout(450);
    const after = await drift.evaluate((el) => el.style.transform);
    expect(after).toBe(before);
  });

  test("drifting nodes stay selectable (keyboard) and freeze on focus", async ({
    page,
    isMobile,
  }) => {
    test.skip(!!isMobile, "the constellation map is desktop-only");
    await page.goto("/");
    await page.locator("#systems").scrollIntoViewIfNeeded();
    // Let the pop-in stagger and ambient drift begin.
    await page.waitForTimeout(1000);

    const node = page.getByRole("button", { name: /PRSense/ });
    await node.focus(); // focusin freezes the drift — target is stable
    await page.keyboard.press("Enter");

    const panel = page.getByRole("region", { name: "Selected system details" });
    await expect(panel).toContainText("PRSense");
    await expect(node).toHaveAttribute("aria-current", "true");
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
