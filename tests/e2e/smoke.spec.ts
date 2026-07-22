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
    // Pin to RLArena's drift group by slug — array order must not matter.
    const drift = page.locator("[data-drift='rlarena']");
    // The label rides inside the drift group — dot + name move as one unit.
    await expect(drift.getByText("RLArena")).toBeAttached();
    // Ambient wander engages once the section is on screen, and it must be
    // visibly alive: displacement from the anchor exceeds 5px within one
    // half-cycle (guaranteed-magnitude targets are ≥9px horizontal).
    await expect
      .poll(
        () =>
          drift.evaluate((el) => {
            // GSAP may write translate(), translate3d(), or leave a matrix —
            // the computed style always resolves to matrix/matrix3d.
            const t = getComputedStyle(el).transform;
            const m2 = t.match(/^matrix\(([^)]+)\)$/);
            if (m2) {
              const p = m2[1].split(",").map(Number);
              return Math.hypot(p[4], p[5]);
            }
            const m3 = t.match(/^matrix3d\(([^)]+)\)$/);
            if (m3) {
              const p = m3[1].split(",").map(Number);
              return Math.hypot(p[12], p[13]);
            }
            return 0;
          }),
        { timeout: 15_000 },
      )
      .toBeGreaterThan(5);
    // Living graph: a connection line touching RLArena must have left its
    // static anchor to track the drifting node (endpoints in viewBox units).
    const line = page
      .locator("[data-conn-line][data-from='rlarena'], [data-conn-line][data-to='rlarena']")
      .first();
    const lineDelta = await line.evaluate((el) => {
      const isFrom = el.getAttribute("data-from") === "rlarena";
      const x = Number(el.getAttribute(isFrom ? "x1" : "x2"));
      const y = Number(el.getAttribute(isFrom ? "y1" : "y2"));
      const ax = Number(el.getAttribute(isFrom ? "data-fx" : "data-tx"));
      const ay = Number(el.getAttribute(isFrom ? "data-fy" : "data-ty"));
      return Math.hypot(x - ax, y - ay);
    });
    expect(lineDelta).toBeGreaterThan(0.2);

    // Keyboard focus freezes the drift — the target must hold still,
    // and its connected edges must hold still with it.
    // First [data-drift] belongs to the first non-center project (RLArena).
    await page.getByRole("button", { name: /RLArena/ }).focus();
    await page.waitForTimeout(150); // let the pause land
    const before = await drift.evaluate((el) => el.style.transform);
    const lineBefore = await line.evaluate(
      (el) =>
        `${el.getAttribute("x1")},${el.getAttribute("y1")},${el.getAttribute("x2")},${el.getAttribute("y2")}`,
    );
    await page.waitForTimeout(450);
    const after = await drift.evaluate((el) => el.style.transform);
    const lineAfter = await line.evaluate(
      (el) =>
        `${el.getAttribute("x1")},${el.getAttribute("y1")},${el.getAttribute("x2")},${el.getAttribute("y2")}`,
    );
    expect(after).toBe(before);
    expect(lineAfter).toBe(lineBefore);
  });

  test("reduced motion keeps nodes and lines fully static", async ({ page, isMobile }) => {
    test.skip(!!isMobile, "the constellation map is desktop-only");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/#systems");
    await page.waitForTimeout(1200);
    const driftTransform = await page
      .locator("[data-drift]")
      .first()
      .evaluate((el) => el.style.transform);
    expect(driftTransform === "" || driftTransform === "none").toBe(true);
    const lineDelta = await page
      .locator("[data-conn-line]")
      .first()
      .evaluate((el) =>
        Math.hypot(
          Number(el.getAttribute("x1")) - Number(el.getAttribute("data-fx")),
          Number(el.getAttribute("y1")) - Number(el.getAttribute("data-fy")),
        ),
      );
    expect(lineDelta).toBe(0);
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
