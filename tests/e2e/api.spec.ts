import { expect, test } from "@playwright/test";

test.describe("read-only API", () => {
  test.skip(({ isMobile }) => !!isMobile, "API shape does not vary by device");

  test("/api/health responds ok with versions", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.status).toBe("ok");
    expect(body.meta.readOnly).toBe(true);
    expect(body.meta.contentVersion).toMatch(/^\d+\.\d+\.\d+$/);
  });

  test("/api/projects returns the full project list", async ({ request }) => {
    const res = await request.get("/api/projects");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThanOrEqual(8);
    const slugs = body.data.map((p: { slug: string }) => p.slug);
    expect(slugs).toContain("rlarena");
    expect(slugs).toContain("jarvis-os");
  });

  test("/api/timeline returns chronological entries", async ({ request }) => {
    const res = await request.get("/api/timeline");
    const body = await res.json();
    expect(body.data.length).toBeGreaterThanOrEqual(6);
    const keys = body.data.map((t: { sortKey: string }) => t.sortKey);
    expect([...keys].sort()).toEqual(keys);
  });

  test("/api/skills returns skill groups", async ({ request }) => {
    const res = await request.get("/api/skills");
    const body = await res.json();
    expect(body.data.length).toBeGreaterThanOrEqual(4);
    expect(body.data[0].skills.length).toBeGreaterThan(0);
  });

  test("/api/site-manifest describes the content contract", async ({ request }) => {
    const res = await request.get("/api/site-manifest");
    const body = await res.json();
    expect(body.data.contentDir).toBe("src/content");
    expect(body.data.validateCommand).toContain("content:check");
    expect(body.data.contentFiles.length).toBeGreaterThanOrEqual(9);
  });

  test("/api/jarvis/portfolio-context is complete and private-data-free", async ({ request }) => {
    const res = await request.get("/api/jarvis/portfolio-context");
    expect(res.status()).toBe(200);
    const text = await res.text();
    const body = JSON.parse(text);
    for (const key of ["profile", "links", "projects", "timeline", "skillGroups", "roadmap"]) {
      expect(body.data[key]).toBeTruthy();
    }
    expect(body.agentGuidance.updateMechanism).toContain("src/content");
    // Never leak phone numbers or key-shaped strings.
    expect(text).not.toMatch(/\(\d{3}\)\s?\d{3}[-.\s]?\d{4}/);
    expect(text).not.toMatch(/\b\d{3}[-.]\d{3}[-.]\d{4}\b/);
    expect(text).not.toMatch(/sk-ant-/);
  });

  test("API endpoints reject writes", async ({ request }) => {
    for (const path of ["/api/projects", "/api/jarvis/portfolio-context"]) {
      const res = await request.post(path, { data: { hack: true } });
      expect([405, 404]).toContain(res.status());
    }
  });
});
