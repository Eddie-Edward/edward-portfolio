// NOTE: relative imports (not "@/") so scripts/ can run this through tsx
// without tsconfig path resolution.
import { content } from "../content";

/**
 * Machine-readable description of this site for JARVIS (and any other
 * trusted agent). Served at /api/site-manifest and written to
 * public/jarvis-site-manifest.json by `pnpm manifest:generate`.
 * The shape is versioned by `contractVersion` — see
 * docs/jarvis-portfolio-contract.md before changing it.
 */
export function buildSiteManifest() {
  const { siteConfig } = content;
  return {
    site: siteConfig.siteName,
    siteUrl: siteConfig.siteUrl,
    tagline: siteConfig.tagline,
    contractVersion: siteConfig.jarvis.contractVersion,
    contentVersion: siteConfig.contentVersion,
    updateGuide: siteConfig.jarvis.updateGuidePath,
    contentModel: "docs/content-model.md",
    contract: "docs/jarvis-portfolio-contract.md",
    contentDir: siteConfig.jarvis.contentDir,
    schemaFile: "src/content/schema.ts",
    validateCommand: "pnpm content:check",
    contentFiles: [
      { path: "src/content/profile.ts", holds: "identity, mission, bio, education" },
      { path: "src/content/projects.ts", holds: "all projects, constellation layout, case studies" },
      { path: "src/content/timeline.ts", holds: "chronological education/work/project milestones" },
      { path: "src/content/skills.ts", holds: "skill groups for the systems map" },
      { path: "src/content/achievements.ts", holds: "verified, source-cited achievements" },
      { path: "src/content/coursework.ts", holds: "selected coursework" },
      { path: "src/content/roadmap.ts", holds: "now/next/later directions" },
      { path: "src/content/sections.ts", holds: "homepage section headings and ledes" },
      { path: "src/content/links.ts", holds: "public profile links" },
      { path: "src/content/site-config.ts", holds: "site meta, nav, versions" },
    ],
    api: [
      { path: "/api/health", returns: "liveness + versions" },
      { path: "/api/site-manifest", returns: "this manifest" },
      { path: "/api/projects", returns: "all projects" },
      { path: "/api/timeline", returns: "all timeline entries" },
      { path: "/api/skills", returns: "all skill groups" },
      {
        path: "/api/jarvis/portfolio-context",
        returns: "full public content bundle for agent consumption",
      },
    ],
    pages: [
      { path: "/", holds: "hero, constellation, work, timeline, skills, roadmap, contact" },
      ...content.projects
        .filter((p) => p.caseStudy)
        .map((p) => ({ path: `/projects/${p.slug}`, holds: `case study: ${p.name}` })),
    ],
    counts: {
      projects: content.projects.length,
      caseStudies: content.projects.filter((p) => p.caseStudy).length,
      timelineEntries: content.timeline.length,
      skillGroups: content.skillGroups.length,
      achievements: content.achievements.length,
      roadmapItems: content.roadmap.length,
    },
    rules: [
      "Read-only API — content changes happen via pull requests editing src/content/*.ts.",
      "Every content edit must pass `pnpm content:check` (schemas + integrity + safety scan).",
      "Never add unverified claims: use source:'todo' entries with an explicit todo note.",
      "Never add phone numbers, street addresses, or secrets to content files.",
      "Do not scrape rendered HTML — consume /api/jarvis/portfolio-context instead.",
    ],
  };
}

export type SiteManifest = ReturnType<typeof buildSiteManifest>;
