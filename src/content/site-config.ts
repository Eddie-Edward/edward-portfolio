import type { SiteConfig } from "./schema";

/**
 * Global site configuration. JARVIS: bump `contentVersion` whenever you
 * change any file in src/content/ so downstream consumers can detect drift.
 */
export const siteConfig: SiteConfig = {
  siteName: "Edward Lei",
  tagline: "AI systems builder · engineering student",
  description:
    "Edward Lei builds AI systems end to end — agents, platforms, and developer tools. CS Engineering at the University of Michigan.",
  contentVersion: "1.1.0",
  // Root-relative so the nav works from case-study pages too, not just "/".
  nav: [
    { label: "Systems", href: "/#systems" },
    { label: "Work", href: "/#work" },
    { label: "Timeline", href: "/#timeline" },
    { label: "Skills", href: "/#skills" },
    { label: "Roadmap", href: "/#roadmap" },
    { label: "Contact", href: "/#contact" },
  ],
  jarvis: {
    contractVersion: "1.0.0",
    manifestPath: "/jarvis-site-manifest.json",
    updateGuidePath: "docs/jarvis-update-guide.md",
    contentDir: "src/content",
  },
};
