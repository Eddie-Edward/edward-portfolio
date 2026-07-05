# JARVIS update guide

How JARVIS (or any trusted agent, or Edward by hand) updates this site safely.

## The one rule

**Edit `src/content/*.ts`. Never edit components, pages, or rendered HTML to change facts.**
The UI is a pure function of the content layer.

## Update loop

1. Read the current state: `GET /api/jarvis/portfolio-context` (deployed) or import
   `src/content/index.ts` (in-repo). Never scrape rendered HTML.
2. Edit the relevant file(s) in `src/content/` (worked examples below).
3. Bump `contentVersion` in `src/content/site-config.ts` (patch for copy tweaks, minor for new
   entries, major for schema-affecting changes).
4. Regenerate the manifest: `pnpm manifest:generate`.
5. Validate: `pnpm content:check` — must pass (it also fails on a stale manifest, which is why
   step 4 comes first).
6. Verify the build: `pnpm build`.
7. Commit with explicit pathspecs (never `git add .`), e.g.:
   `git add src/content/projects.ts src/content/site-config.ts public/jarvis-site-manifest.json`

## Worked example: add a project

Append to `src/content/projects.ts`:

```ts
{
  slug: "new-system",                       // kebab-case, unique
  name: "New System",
  tagline: "One-line what-it-is",
  category: "platform",                      // see projectCategorySchema
  status: "in-progress",                     // see projectStatusSchema
  featured: false,                           // featured ⇒ should have a caseStudy
  source: "todo",                            // "resume" | "local" | "site" | "todo"
  period: "Aug 2026",
  role: "Creator & Developer",
  summary: "Two or three sentences. Only verifiable claims.",
  highlights: [],                            // bullet points, verified only
  stack: ["TypeScript"],
  links: [],                                 // add GitHub links when public
  connections: ["jarvis-os"],                // slugs of related projects
  constellation: { orbit: 2, angle: 20, size: "sm" },  // pick a free slot
  todo: "TODO(Edward): confirm scope before removing source:'todo'.",
}
```

Free constellation slots: check existing `orbit`/`angle` pairs in the file — keep ≥ 25° of
separation per ring. Then run steps 3–7.

## Worked example: add a timeline entry

Append to `src/content/timeline.ts` (keep chronological order):

```ts
{
  id: "internship-2027",                     // unique
  period: "May 2027 — Aug 2027",
  sortKey: "2027-05",                        // keeps ordering honest
  title: "Software Engineering Intern",
  org: "Company",
  location: "City, ST",
  kind: "work",                              // education | work | project | milestone
  summary: "One sentence of verified fact.",
  details: ["Optional verified bullets."],
  source: "resume",
}
```

## Worked example: update a link

In `src/content/links.ts`, change the `href`. To publish the resume link: put a public,
phone-number-free PDF at `public/resume.pdf`, set `href: "/resume.pdf"`, and delete the `todo`
field.

## Worked example: update skills

Add `{ name: "New Skill", note: "where it was used" }` to the right group in
`src/content/skills.ts`. Only skills Edward has actually used.

## Honesty rules (hard requirements)

- Never invent achievements, metrics, or employment. If Edward hasn't verified it, use
  `source: "todo"` + a `todo` note; the UI will render it as a preview.
- Never add phone numbers, street addresses, private resume text, or secrets. The safety scan
  in `content:check` will fail the commit — do not weaken the scan to get past it.
- Never build or call write-endpoints on this site. The API is read-only by design; updates go
  through this repo as commits.

## Future: site-update prompt packets

When JARVIS prepares a portfolio update from a conversation with Edward, it should emit a
packet shaped like:

```json
{
  "kind": "portfolio-update",
  "contractVersion": "1.0.0",
  "edits": [
    { "file": "src/content/projects.ts", "operation": "append-project", "payload": { "...": "..." } }
  ],
  "contentVersionBump": "minor",
  "evidence": "what Edward said / which repo verifies this"
}
```

Then apply the edits in-repo and run the update loop above. The `payload` must satisfy the Zod
schema for its target file.
