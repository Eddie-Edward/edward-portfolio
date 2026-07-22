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
