import { NextResponse } from "next/server";

import { content } from "@/content";
import { apiMeta } from "@/lib/api";

/**
 * The full public content bundle, shaped for agent consumption.
 * JARVIS should read this instead of scraping rendered HTML.
 * Everything here is already public on the site — no private data.
 */
export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({
    meta: apiMeta("/api/jarvis/portfolio-context"),
    data: {
      profile: content.profile,
      links: content.links,
      projects: content.projects,
      timeline: content.timeline,
      skillGroups: content.skillGroups,
      achievements: content.achievements,
      coursework: content.coursework,
      roadmap: content.roadmap,
      siteConfig: content.siteConfig,
    },
    agentGuidance: {
      updateMechanism:
        "Edit files under src/content/ (see docs/jarvis-update-guide.md), validate with `pnpm content:check`, then commit via pull request.",
      honestyRules: [
        "Never add achievements, metrics, or employment that Edward cannot verify.",
        "Uncertain details use source:'todo' plus an explicit `todo` note.",
        "Never include phone numbers, street addresses, secrets, or raw resume text.",
      ],
      schema: "src/content/schema.ts",
      contract: "docs/jarvis-portfolio-contract.md",
    },
  });
}
