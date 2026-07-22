import { expect, test } from "@playwright/test";

/**
 * Truth-alignment regression suite (recruiter-readiness plan, PR 1).
 *
 * Every check here pins a resume/site consistency fix so it cannot silently
 * regress: graduation year, InterviewCopilot's conservative test count and
 * provider wording, and the removal of unsupported Claude API claims and the
 * broken InterviewCopilot repository link.
 */

const FORBIDDEN_CLAIMS: Array<{ label: string; pattern: RegExp }> = [
  { label: "stale graduation year", pattern: /\b(class of |May )?2029\b/ },
  { label: "stale 72-test claim", pattern: /72 passing/i },
  { label: "unsupported Claude-powered claim", pattern: /Claude-powered/i },
  { label: "unsupported Claude API claim", pattern: /Claude API/i },
  {
    label: "broken InterviewCopilot repo link",
    pattern: /github\.com\/Eddie-Edward\/interviewcopilot/i,
  },
  {
    // Conservative default until Edward signs off on stronger wording: the
    // recruiter-facing word is "Built". (The lowercase machine-readable
    // status enum value "shipped" is allowed — this is case-sensitive.)
    label: "unapproved 'Shipped' wording",
    pattern: /Shipped/,
  },
];

const PAGES = ["/", "/projects/interviewcopilot", "/projects/jarvis-os"];

test.describe("truth alignment", () => {
  test.skip(({ isMobile }) => !!isMobile, "content is identical across devices");

  for (const path of PAGES) {
    test(`no stale or unsupported claims on ${path}`, async ({ page }) => {
      await page.goto(path);
      const html = await page.content();
      for (const { label, pattern } of FORBIDDEN_CLAIMS) {
        expect(html, `${path} must not contain ${label}`).not.toMatch(pattern);
      }
    });
  }

  test("machine-readable surfaces carry the corrected facts", async ({ request }) => {
    for (const path of ["/api/jarvis/portfolio-context", "/jarvis-site-manifest.json"]) {
      const res = await request.get(path);
      expect(res.status()).toBe(200);
      const text = await res.text();
      for (const { label, pattern } of FORBIDDEN_CLAIMS) {
        expect(text, `${path} must not contain ${label}`).not.toMatch(pattern);
      }
    }
  });

  test("graduation reads May 2028 in profile and hero", async ({ page, request }) => {
    const res = await request.get("/api/jarvis/portfolio-context");
    const body = await res.json();
    expect(body.data.profile.education.expectedGraduation).toBe("May 2028");

    await page.goto("/");
    // "class of 2028" also appears in the bio copy — scope to the hero.
    await expect(page.locator("#top").getByText("Class of 2028")).toBeVisible();
    await expect(page.getByText("Expected May 2028")).toBeVisible();
  });

  test("featured set is exactly the four resume projects", async ({ request }) => {
    const res = await request.get("/api/projects");
    const body = await res.json();
    const featured = body.data
      .filter((p: { featured: boolean }) => p.featured)
      .map((p: { slug: string }) => p.slug)
      .sort();
    expect(featured).toEqual(["interviewcopilot", "jarvis-os", "lockin", "rlarena"]);
  });

  test("LockIn appears on every surface: card, case study, API, manifest", async ({
    page,
    request,
  }) => {
    await page.goto("/");
    await expect(page.locator("#project-lockin")).toContainText("LockIn");

    await page.goto("/projects/lockin");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("LockIn");
    await expect(page.getByText("Engineering decisions")).toBeVisible();

    const api = await (await request.get("/api/projects")).json();
    const lockin = api.data.find((p: { slug: string }) => p.slug === "lockin");
    expect(lockin).toBeTruthy();
    expect(lockin.featured).toBe(true);
    expect(JSON.stringify(lockin)).toContain("128 passing tests across 17 suites");

    const manifest = await (await request.get("/jarvis-site-manifest.json")).text();
    expect(manifest).toContain("/projects/lockin");
  });

  test("canonical and Open Graph metadata resolve against siteUrl", async ({
    page,
    request,
  }) => {
    await page.goto("/");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://edward-portfolio-five.vercel.app",
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /Edward Lei/,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    const ogImage = await page
      .locator('meta[property="og:image"]')
      .first()
      .getAttribute("content");
    expect(ogImage).toBeTruthy();

    // The dedicated OG image itself renders.
    const res = await request.get("/opengraph-image");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/png");

    // Case-study pages carry their own canonical.
    await page.goto("/projects/lockin");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://edward-portfolio-five.vercel.app/projects/lockin",
    );
  });

  test("no dead resume link is rendered while the PDF is pending", async ({ page }) => {
    await page.goto("/");
    // The placeholder href "#" must never render as a visible Resume link
    // in nav, hero, or footer; it appears only once a real PDF is hosted.
    await expect(page.getByRole("link", { name: /Resume/ })).toHaveCount(0);
  });

  test("section copy is served from the structured content layer", async ({
    page,
    request,
  }) => {
    const body = await (await request.get("/api/jarvis/portfolio-context")).json();
    const sections = body.data.sections;
    for (const key of ["systems", "work", "timeline", "skills", "roadmap", "contact"]) {
      expect(sections[key]?.title, `sections.${key} must exist`).toBeTruthy();
      expect(sections[key]?.lede, `sections.${key} must have a lede`).toBeTruthy();
    }

    // The rendered page uses the same source strings.
    await page.goto("/");
    await expect(page.getByText(sections.work.title)).toBeVisible();
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await expect(page.getByText(sections.contact.title)).toBeVisible();
  });

  test("preview clutter stays controlled", async ({ request }) => {
    const body = await (await request.get("/api/projects")).json();
    const previews = body.data.filter((p: { source: string }) => p.source === "todo");
    expect(previews.length).toBeLessThanOrEqual(2);
    const slugs = body.data.map((p: { slug: string }) => p.slug);
    expect(slugs).not.toContain("framezero");
    expect(slugs).not.toContain("agent-ops-daily");
  });

  test("Selected Work defaults to the featured lens", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: /^Featured/ })).toHaveAttribute(
      "aria-current",
      "true",
    );
    await expect.poll(() => page.locator("[id^='project-']").count()).toBe(4);
  });

  test("InterviewCopilot uses conservative provider wording and 32/32 count", async ({
    request,
  }) => {
    const res = await request.get("/api/projects");
    const body = await res.json();
    const ic = body.data.find((p: { slug: string }) => p.slug === "interviewcopilot");
    expect(ic).toBeTruthy();
    expect(ic.tagline).toBe("Provider-pluggable interview preparation");
    expect(ic.links).toEqual([]);
    expect(JSON.stringify(ic)).toContain("32/32 backend tests");
  });
});
