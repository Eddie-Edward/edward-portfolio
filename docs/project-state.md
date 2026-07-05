# Project state

_Last updated: 2026-07-05 (v3 constellation motion polish)._

## Latest local commit

`91bafce` — "Tune portfolio constellation motion" (branch `main`; history: `5c0e3c1` initial
build → `6bd5494` browsing polish → `91bafce` motion tuning). Not yet pushed to GitHub.

## Current features

- **Hero**: GSAP entrance timeline, orbital SVG field (CSS ambient rotation, pointer
  parallax, off-screen pause), content-driven status chip. Approved by Edward.
- **Constellation** (`#systems`): interactive orbital map — JARVIS fixed at center, 10
  project nodes with Lissajous drift (dot + button + label move as one unit), living
  connection edges tracking node positions via a visibility-gated GSAP ticker, freeze on
  hover/focus, detail panel, mobile node-list fallback.
- **Selected Work** (`#work`): `WorkBrowser` filter chips (Featured/Shipped/Active/AI
  Systems/Full-Stack/Robotics/Research/Previews) with live counts + AnimatePresence
  popLayout grid.
- **Timeline** (`#timeline`): scroll-scrubbed progress line + achievements grid.
- **Skills, Roadmap, Contact**, case-study pages (`/projects/{jarvis-os,rlarena,prsense,
  interviewcopilot}`), styled 404.
- **Content layer**: 10 Zod-validated files in `src/content/`; `content:check` gates
  schemas, cross-file integrity, PII/secret scan (recursive), and manifest drift.
- **Read-only API**: 6 force-static routes incl. `/api/jarvis/portfolio-context`.
- **Tests**: 33 passing Playwright tests (rendering, filters, drift + living edges,
  reduced motion, keyboard, overflow at 4 widths, API shape, no private data).

## Finished

Everything above. Lint/content:check/build/e2e all green at `91bafce`. Reduced-motion,
no-JS fallback, and JARVIS compatibility layer complete (contract v1.0.0).

## Optional / open

- Push to GitHub + Vercel deploy (no origin remote configured yet).
- Edward sign-offs: "shipped" wording; constellation motion feel; `source:"todo"` preview
  projects (CareerOS, FrameZero, Agent Ops Daily, Trading Research) need real details or
  removal; public resume PDF for the links.ts placeholder.
- Nice-to-haves: OG image, axe-core CI pass, "Archive" chip when archived work exists,
  optional `domains` schema field for precise filter-lens control, edge shimmer.

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
