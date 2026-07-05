# Content model

Every fact rendered on this site lives in `src/content/`. The UI, the API routes, and the
manifest all import from `src/content/index.ts`, which parses each file through the Zod schemas
in `src/content/schema.ts`. **If it isn't in a content file, the site doesn't say it.**

## Files

| File | Exports | Holds |
| --- | --- | --- |
| `schema.ts` | Zod schemas + TS types | The shape of everything below. Change with care — see the contract doc. |
| `profile.ts` | `profile` | Name, headline, mission, bio paragraphs, education. |
| `projects.ts` | `projects` | Every project: status, stack, highlights, constellation slot, optional case study. |
| `timeline.ts` | `timeline` | Chronological entries (education / work / project / milestone). |
| `skills.ts` | `skillGroups` | Skill groups for the systems map. |
| `achievements.ts` | `achievements` | Source-cited achievements ("proof of work" grid). |
| `coursework.ts` | `coursework` | Selected coursework chips. |
| `roadmap.ts` | `roadmap` | Now / next / later directions. |
| `links.ts` | `links` | Public profile links (GitHub, LinkedIn, email, resume). |
| `site-config.ts` | `siteConfig` | Site name, description, nav, `contentVersion`, JARVIS contract info. |
| `index.ts` | `content`, helpers | Validated aggregate + integrity checks. Do not bypass it. |

## The `source` field

Nothing on this site is invented. Most content types carry a `source`:

- `"resume"` — verified against Edward's resume.
- `"local"` — verified against a repository on Edward's machine.
- `"site"` — self-evident from this repository.
- `"todo"` — **placeholder**. The UI renders these conservatively (preview notes, no invented
  details) and the `todo` string says what Edward still needs to confirm.

When in doubt, use `"todo"` and write the open question into the `todo` field.

## Key sub-shapes

### Project constellation slot

```ts
constellation: { orbit: 0-3, angle: 0-360, size: "sm" | "md" | "lg" }
```

- `orbit 0` is the center — reserved for JARVIS OS.
- Orbits 1–3 are rings outward (featured work sits on orbit 1).
- `angle` is degrees counter-clockwise from 3 o'clock. Pick an angle ≥ 25° away from existing
  nodes on the same orbit so labels don't collide.

### Case studies

A project with a `caseStudy` object gets a page at `/projects/<slug>` with five sections:
`problem`, `built[]`, `engineering[]`, `outcome`, `future`. Featured projects should have one
(the integrity check enforces this, except for `source: "todo"` previews).

### Timeline ordering

`timeline.ts` must stay sorted oldest → newest by `sortKey` (`YYYY` or `YYYY-MM`). The
integrity check fails if it isn't.

## Validation

```bash
pnpm content:check
```

runs four gates: Zod schema parse → cross-file integrity (connection slugs exist, no duplicate
ids/slugs in any collection, chronological order, featured-implies-case-study) → recursive
safety scan (no phone numbers, street addresses, or secret-shaped strings anywhere under
`src/content/`, `public/`, or `docs/`) → manifest freshness (the committed
`public/jarvis-site-manifest.json` must match the content layer; regenerate with
`pnpm manifest:generate`).

The same parsing runs at build time, so invalid content also fails `pnpm build`.
