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
  siteConfigSchema,
  skillGroupSchema,
  timelineEntrySchema,
} from "./schema";
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
