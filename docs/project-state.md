# Project state

_Last updated: 2026-07-21 (recruiter-readiness rebuild)._

## Latest local commit

Recruiter-readiness rebuild on branch `rebuild/recruiter-readiness`, merged locally to
`main`; history since the last note: `3cc3eb9` truth pass → `a17842f` LockIn + deeper
JARVIS → `0f81a86` reduce preview clutter, default Featured lens → `26463f3` section copy
into content layer + recruiter homepage order → `0d2ebe0` constellation selection
hierarchy → `5691442` OG image/metadata/CI/axe/VRT → review repairs. **Not pushed** — the
live Vercel deployment still shows the pre-rebuild build until Edward reviews and pushes.

## Current features

- **Hero**: GSAP entrance timeline, orbital SVG field (CSS ambient rotation, pointer
  parallax, off-screen pause), content-driven status chip, compact recruiter CTA row
  (Featured work / Resume when hosted / GitHub / Contact). Approved by Edward.
- **Constellation** (`#systems`): interactive orbital map — JARVIS fixed at center, 10
  project nodes with Lissajous drift (dot + button + label move as one unit), living
  connection edges tracking node positions via a visibility-gated GSAP ticker, freeze on
  hover/focus, selection-aware edge hierarchy (edges touching the selected node brighten,
  others recede), one-shot 0.7s selection pulse (disabled under reduced motion),
  featured/secondary node + label hierarchy, detail panel with role + up to 3 evidence
  bullets, mobile node-list fallback (featured-first). Integrity check enforces ≥25°
  same-orbit angle separation.
- **Selected Work** (`#work`): `WorkBrowser` filter chips (Featured/Built/Active/AI
  Systems/Full-Stack/Robotics/Research/Previews) with live counts + AnimatePresence
  popLayout grid; opens on the **Featured** lens by default, All one click away.
- **Homepage order**: hero → about → work (featured default) → timeline → systems
  (constellation) → skills → roadmap → contact; nav matches. Section headings/ledes now
  come from `src/content/sections.ts` instead of component JSX.
- **Timeline** (`#timeline`): scroll-scrubbed progress line + achievements grid.
- **Skills, Roadmap, Contact**, case-study pages (`/projects/{jarvis-os,lockin,rlarena,
  prsense,interviewcopilot}`), styled 404.
- **Metadata/SEO**: build-time typographic OG image (`src/app/opengraph-image.tsx`,
  content-driven), `metadataBase`/canonical/OG/Twitter metadata resolved against the new
  `siteConfig.siteUrl`.
- **Header/footer**: Resume slots appear automatically once a real PDF is hosted; a test
  pins that no dead resume link renders in the meantime.
- **Content layer**: 11 Zod-validated files in `src/content/` (added `sections.ts`);
  `content:check` gates schemas, cross-file integrity, PII/secret scan (recursive), and
  manifest drift.
- **Read-only API**: force-static routes incl. `/api/jarvis/portfolio-context` (now also
  serves `data.sections`).
- **CI**: GitHub Actions (`.github/workflows/ci.yml`) runs frozen install → content:check →
  lint → build → e2e on push/PR.
- **Tests**: Playwright suites `smoke`, `api`, `truth`, `a11y` (axe-core, no serious/
  critical violations), and `visual` (local snapshots at 390/768/1440/1920, win32-only,
  skipped on CI). Retries: 1.

## Projects (10 total)

Featured (4): JARVIS OS, LockIn, InterviewCopilot, RLArena — each has a case study.
PRSense keeps its case study but is no longer featured (orbit 2). CareerOS and contentOS
are substantive verified active entries (contentOS absorbed FrameZero and Agent Ops Daily
as internal experiments rather than standalone preview cards). Trading Research is the
only remaining `source: "todo"` preview project.

## Truth pass (verified facts baked into content)

Graduation: May 2028. InterviewCopilot: 32/32 at last verified checkpoint, provider-
pluggable wording, no repository link (previous URL 404s). JARVIS: TypeScript + OpenAI
Realtime voice + AI agents + packaged desktop runtime (Electron/Claude API claims
removed as unverified). June 2026 platforms: "built," not "shipped," pending Edward's
explicit sign-off.

## Finished

Everything above. Lint/content:check/build/e2e all green at `5691442`. contentVersion is
`1.5.0`. Reduced-motion, no-JS fallback, and JARVIS compatibility layer complete
(contract v1.0.0).

## Optional / open (blocked on Edward)

- Resume PDF to host (unblocks the Resume nav/footer slots and the links.ts placeholder).
- Custom domain (site currently resolves to `https://edward-portfolio-five.vercel.app`).
- InterviewCopilot repository URL (none currently linked — previous URL 404s).
- Sign-off on "shipped" wording for the June 2026 platforms (currently "built").
- Various other confirmations tracked in a NEEDS INPUT checklist presented separately.

## How JARVIS should update this repo

Follow `docs/jarvis-update-guide.md`: edit `src/content/*.ts` only (never components/HTML),
bump `contentVersion`, then `pnpm manifest:generate` → `pnpm content:check` → `pnpm build`,
commit with explicit pathspecs. Read state from `/api/jarvis/portfolio-context` or the
content files — never scrape rendered HTML. Honesty rules are hard requirements
(`docs/jarvis-portfolio-contract.md`).

## What future Claude sessions should inspect first

1. `CLAUDE.md` (root) — commands, rules, current visual state.
2. `docs/fable-portfolio-implementation-review.md` — honest build review, v2/v3 change log,
   known weak spots, disputed-wording notes.
3. `src/content/schema.ts` + `src/content/index.ts` — the contract's foundation.
4. `src/components/sections/ProjectConstellation.tsx` — most complex component (three-layer
   transform architecture, drift + living-edge ticker; read the comments before touching).
5. `scripts/validate-content.ts` — the safety gate; never weaken.
