import { z } from "zod";

import { achievements } from "./achievements";
import { coursework } from "./coursework";
import { links } from "./links";
import { profile } from "./profile";
import { projects } from "./projects";
import { roadmap } from "./roadmap";
import {
  achievementSchema,
  courseworkSchema,
  linkSchema,
  profileSchema,
  projectSchema,
  roadmapItemSchema,
  sectionsSchema,
  siteConfigSchema,
  skillGroupSchema,
  timelineEntrySchema,
} from "./schema";
import { sections } from "./sections";
import { siteConfig } from "./site-config";
import { skillGroups } from "./skills";
import { timeline } from "./timeline";

/**
 * Single validated entry point for all site content.
 *
 * Everything the UI and the API render is parsed through the Zod schemas
 * here, so a malformed content edit fails loudly at build/dev time instead
 * of shipping silently. `scripts/validate-content.ts` reuses this module.
 */

function parse<S extends z.ZodTypeAny>(
  schema: S,
  data: unknown,
  label: string,
): z.output<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid content in ${label}:\n${issues}`);
  }
  return result.data;
}

export const content = {
  profile: parse(profileSchema, profile, "src/content/profile.ts"),
  links: parse(z.array(linkSchema), links, "src/content/links.ts"),
  projects: parse(z.array(projectSchema), projects, "src/content/projects.ts"),
  timeline: parse(
    z.array(timelineEntrySchema),
    timeline,
    "src/content/timeline.ts",
  ),
  skillGroups: parse(
    z.array(skillGroupSchema),
    skillGroups,
    "src/content/skills.ts",
  ),
  achievements: parse(
    z.array(achievementSchema),
    achievements,
    "src/content/achievements.ts",
  ),
  coursework: parse(
    z.array(courseworkSchema),
    coursework,
    "src/content/coursework.ts",
  ),
  roadmap: parse(z.array(roadmapItemSchema), roadmap, "src/content/roadmap.ts"),
  sections: parse(sectionsSchema, sections, "src/content/sections.ts"),
  siteConfig: parse(siteConfigSchema, siteConfig, "src/content/site-config.ts"),
} as const;

/** Cross-file consistency checks beyond per-file schemas. */
export function validateContentIntegrity(): string[] {
  const errors: string[] = [];
  const slugs = new Set(content.projects.map((p) => p.slug));

  if (slugs.size !== content.projects.length) {
    errors.push("projects: duplicate slugs detected");
  }

  for (const project of content.projects) {
    for (const connection of project.connections) {
      if (!slugs.has(connection)) {
        errors.push(
          `projects: "${project.slug}" connects to unknown slug "${connection}"`,
        );
      }
    }
    if (project.featured && !project.caseStudy && project.source !== "todo") {
      errors.push(
        `projects: featured project "${project.slug}" is missing a case study`,
      );
    }
  }

  const idCollections: Array<[string, ReadonlyArray<{ id: string }>]> = [
    ["timeline", content.timeline],
    ["skills", content.skillGroups],
    ["achievements", content.achievements],
    ["coursework", content.coursework],
    ["roadmap", content.roadmap],
  ];
  for (const [label, items] of idCollections) {
    if (new Set(items.map((item) => item.id)).size !== items.length) {
      errors.push(`${label}: duplicate ids detected`);
    }
  }

  // Constellation legibility: nodes sharing an orbit need ≥25° separation
  // or their labels collide (docs/jarvis-update-guide.md).
  const byOrbit = new Map<number, Array<{ slug: string; angle: number }>>();
  for (const p of content.projects) {
    if (p.constellation.orbit === 0) continue; // single center node
    const ring = byOrbit.get(p.constellation.orbit) ?? [];
    ring.push({ slug: p.slug, angle: p.constellation.angle });
    byOrbit.set(p.constellation.orbit, ring);
  }
  for (const [orbit, ring] of byOrbit) {
    if (ring.length < 2) continue;
    const sortedRing = [...ring].sort((a, b) => a.angle - b.angle);
    for (let i = 0; i < sortedRing.length; i++) {
      const a = sortedRing[i];
      const b = sortedRing[(i + 1) % sortedRing.length];
      // Neighboring gap along the ring; the last pair wraps through 360°.
      const separation =
        i === sortedRing.length - 1 ? 360 - (a.angle - b.angle) : b.angle - a.angle;
      if (separation < 25) {
        errors.push(
          `projects: orbit ${orbit} nodes "${a.slug}" and "${b.slug}" are only ${separation}° apart (min 25°)`,
        );
      }
    }
  }

  const sortKeys = content.timeline.map((t) => t.sortKey);
  const sorted = [...sortKeys].sort();
  if (JSON.stringify(sortKeys) !== JSON.stringify(sorted)) {
    errors.push("timeline: entries are not in chronological order (sortKey)");
  }

  return errors;
}

export const featuredProjects = content.projects.filter((p) => p.featured);
export const caseStudyProjects = content.projects.filter((p) => p.caseStudy);

export function getProject(slug: string) {
  return content.projects.find((p) => p.slug === slug);
}
