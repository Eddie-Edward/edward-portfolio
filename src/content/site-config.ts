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
  // Live Vercel deployment; replace with the custom domain when purchased.
  siteUrl: "https://edward-portfolio-five.vercel.app",
  contentVersion: "1.5.0",
  // Root-relative so the nav works from case-study pages too, not just "/".
  // Order mirrors the page's reading order: featured work and evidence
  // first, the systems map second.
  nav: [
    { label: "Work", href: "/#work" },
    { label: "Timeline", href: "/#timeline" },
    { label: "Systems", href: "/#systems" },
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
