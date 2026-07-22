import { z } from "zod";

/**
 * Content schemas — the single source of truth for the shape of every
 * content file in `src/content/`.
 *
 * JARVIS contract: any programmatic update to the content layer MUST
 * validate against these schemas (`pnpm content:check`) before commit.
 * See docs/jarvis-portfolio-contract.md.
 */

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

export const linkKindSchema = z.enum([
  "github",
  "linkedin",
  "email",
  "resume",
  "website",
  "demo",
  "other",
]);

export const linkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  kind: linkKindSchema,
  /** Marks placeholder links that Edward/JARVIS still needs to fill in. */
  todo: z.string().optional(),
});

/** Where a claim comes from. Nothing on this site should be invented. */
export const sourceSchema = z.enum([
  "resume", // verified against Edward's resume
  "local", // verified against a local repository on Edward's machine
  "site", // self-evident from this repository
  "todo", // placeholder — needs Edward's confirmation before it is trusted
]);

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export const educationSchema = z.object({
  school: z.string(),
  degree: z.string(),
  minors: z.array(z.string()).default([]),
  location: z.string(),
  expectedGraduation: z.string(),
});

export const profileSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
  headline: z.string().min(1),
  subheadline: z.string().min(1),
  /** One-sentence mission shown in the hero. */
  mission: z.string().min(1),
  /** Short "what's happening now" line for the hero status chip. */
  currentStatus: z.string().optional(),
  location: z.string(),
  /** Public professional email only. Never a phone number or street address. */
  email: z.string().email(),
  bio: z.array(z.string().min(1)).min(1),
  education: educationSchema,
});

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export const projectStatusSchema = z.enum([
  "shipped", // built, working, public or demonstrable
  "active", // under active development
  "in-progress", // early build
  "research", // exploratory / private research
  "archived",
]);

export const projectCategorySchema = z.enum([
  "ai-systems",
  "platform",
  "devtool",
  "automation",
  "robotics",
  "research",
  "site",
]);

/** Position of a project node in the constellation visualization. */
export const constellationSchema = z.object({
  /** 0 = center, 1..3 = orbital rings outward. */
  orbit: z.number().int().min(0).max(3),
  /** Degrees around the ring, 0 = 3 o'clock, counter-clockwise. */
  angle: z.number().min(0).max(360),
  size: z.enum(["sm", "md", "lg"]),
});

export const caseStudySchema = z.object({
  problem: z.string().min(1),
  built: z.array(z.string().min(1)).min(1),
  engineering: z.array(z.string().min(1)).min(1),
  outcome: z.string().min(1),
  future: z.string().min(1),
});

export const projectSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case"),
  name: z.string().min(1),
  tagline: z.string().min(1),
  category: projectCategorySchema,
  status: projectStatusSchema,
  /** Featured projects appear on the inner orbit and get case-study pages. */
  featured: z.boolean(),
  source: sourceSchema,
  period: z.string().min(1),
  role: z.string().min(1),
  summary: z.string().min(1),
  highlights: z.array(z.string().min(1)).default([]),
  stack: z.array(z.string().min(1)).min(1),
  links: z.array(linkSchema).default([]),
  /** Slugs of related projects — rendered as constellation connections. */
  connections: z.array(z.string()).default([]),
  constellation: constellationSchema,
  caseStudy: caseStudySchema.optional(),
  /** Editable note about what still needs Edward's confirmation. */
  todo: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Timeline
// ---------------------------------------------------------------------------

export const timelineKindSchema = z.enum([
  "education",
  "work",
  "project",
  "milestone",
]);

export const timelineEntrySchema = z.object({
  id: z.string().min(1),
  /** Human-readable period, e.g. "Jun 2026 — Present". */
  period: z.string().min(1),
  /** Sort key, ISO-ish: "2026-06". Later = closer to now. */
  sortKey: z.string().regex(/^\d{4}(-\d{2})?$/),
  title: z.string().min(1),
  org: z.string().optional(),
  location: z.string().optional(),
  kind: timelineKindSchema,
  summary: z.string().min(1),
  details: z.array(z.string().min(1)).default([]),
  source: sourceSchema,
  todo: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

export const skillSchema = z.object({
  name: z.string().min(1),
  note: z.string().optional(),
});

export const skillGroupSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  blurb: z.string().min(1),
  skills: z.array(skillSchema).min(1),
});

// ---------------------------------------------------------------------------
// Achievements / coursework / roadmap
// ---------------------------------------------------------------------------

export const achievementSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  context: z.string().optional(),
  source: sourceSchema,
});

export const courseworkSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  note: z.string().optional(),
  source: sourceSchema,
});

export const roadmapItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  horizon: z.enum(["now", "next", "later"]),
  source: sourceSchema,
});

// ---------------------------------------------------------------------------
// Section copy
// ---------------------------------------------------------------------------

/**
 * Editorial copy for a homepage section. Lives in src/content/sections.ts so
 * JARVIS edits headings/ledes as structured content, never component JSX.
 */
export const sectionCopySchema = z.object({
  kicker: z.string().min(1),
  title: z.string().min(1),
  lede: z.string().min(1),
});

export const sectionsSchema = z.object({
  systems: sectionCopySchema,
  work: sectionCopySchema,
  timeline: sectionCopySchema,
  skills: sectionCopySchema,
  roadmap: sectionCopySchema,
  contact: sectionCopySchema,
});

// ---------------------------------------------------------------------------
// Site config
// ---------------------------------------------------------------------------

export const siteConfigSchema = z.object({
  siteName: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  /** Bump when content meaningfully changes. JARVIS reads this. */
  contentVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  nav: z
    .array(z.object({ label: z.string().min(1), href: z.string().min(1) }))
    .min(1),
  jarvis: z.object({
    contractVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
    manifestPath: z.string().min(1),
    updateGuidePath: z.string().min(1),
    contentDir: z.string().min(1),
  }),
});

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

export type Link = z.infer<typeof linkSchema>;
export type Source = z.infer<typeof sourceSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type Project = z.infer<typeof projectSchema>;
export type ProjectStatus = z.infer<typeof projectStatusSchema>;
export type CaseStudy = z.infer<typeof caseStudySchema>;
export type TimelineEntry = z.infer<typeof timelineEntrySchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type Achievement = z.infer<typeof achievementSchema>;
export type Coursework = z.infer<typeof courseworkSchema>;
export type RoadmapItem = z.infer<typeof roadmapItemSchema>;
export type SectionCopy = z.infer<typeof sectionCopySchema>;
export type Sections = z.infer<typeof sectionsSchema>;
export type SiteConfig = z.infer<typeof siteConfigSchema>;
