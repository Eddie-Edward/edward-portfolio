# Fable implementation review — edward-portfolio v1

Self-review by Claude (Fable 5) of the initial build, written for Edward and for a follow-up
Opus audit. Honest by design: this lists what's solid, what's assumed, and what's weak.

## Motion micro-polish v3 (constellation)

Edward found the v2 drift too subtle (±7/±5 ranges straddling zero average out near-static) and
wanted labels moving with their orbs. v3: Lissajous-style wander — independent x/y sine tweens
per node with different durations (6–10s) and guaranteed-magnitude signed targets (±9–15px
horizontal, ±6–11px vertical), so every cycle visibly travels a curved path without ever
orbiting. The label now rides inside the [data-drift] group (dot + button + label move as one
unit; hovering the label also freezes the node). Connection lines are now a living graph: a
single visibility-gated GSAP ticker rewrites each edge endpoint as static anchor + the node's
live drift offset (read from GSAP's cache via `getProperty` — zero layout reads), so edges
track drifting nodes and hold still with frozen ones; endpoints reset to anchors on teardown.
All v2 safeguards kept: lg+ media gate, per-source freeze counting, off-screen pause,
reduced-motion fully static (nodes and lines).

## Polish pass v2 (constellation motion + work browsing)

Per Edward's feedback: (1) constellation orbs got a GSAP ambient drift — low-amplitude sine
wander around each anchor (never full orbits), lg+ only, frozen while hovered/focused (freeze
holds are counted per source so overlapping hover+focus can't fight), paused off-screen, labels
static and now click-forwarding; JARVIS core stays anchored at center. (2) Selected Work became
`WorkBrowser`: filter chips (Featured/Shipped/Active/AI Systems/Full-Stack/Robotics/Research/
Previews) with live counts, `aria-current` selection, re-tap-to-reset, an `aria-atomic` result
announcer, and `AnimatePresence popLayout` + `layout="position"` grid transitions. Filters are
pure view predicates over schema fields — no facts moved into components. A second adversarial
review round (18 agents) ran on this diff; all 15 confirmed findings were fixed pre-commit,
including a mobile display:none animation leak, a focus-vs-scroll drift race, dead mobile
anchors under active filters (hashchange reset), and an AI Systems lens that missed the
flagship AI platforms (multi-signal predicate).

## Adversarial review round (pre-commit)

Before the first commit, a 60-agent review swarm (6 specialist finders × react-next, animation,
css-tailwind, content-safety, a11y, api-contract; every finding challenged by 2 independent
skeptics) produced 25 confirmed findings. All were fixed in the initial commit except two
content-safety claims that were **overruled against the primary source**: the finders alleged
that phrases like "automotive OEM digital-marketing programs", "weekly code reviews", the
uniform three-platform stack, and the Jun 2026 dates were invented — but each appears verbatim
in Edward's resume (the finders only saw a summary; the refuting skeptics and Fable verified
against the actual PDFs). Highlights of what WAS fixed:

- Nav links were dead on case-study pages (bare `#hash` → `/#hash`).
- Tailwind v4 cascade-layer defect: unlayered `.glass` killed every border utility (featured
  hairlines, hover borders) — surface classes now live in `@layer components`.
- Hero orbit dots rotated around the wrong origin (`fill-box` bbox of asymmetric dots) — ring
  outlines moved inside the rotating groups to normalize the bbox.
- GSAP start-value race: hero field opacity was owned by both the entrance tween and the
  scroll scrub — now separate elements.
- Motion gesture-end lag: stagger delays lived inside the `visible` variant, so hover-out
  waited up to ~0.85 s — staggering moved to parent `staggerChildren`; card hover physics moved
  off the reveal element.
- Constellation nodes were mis-anchored (CSS translate clobbered by Motion's inline transform,
  and the dot+label column centered instead of the dot) — anchoring moved to a non-animated
  wrapper with the label positioned absolutely.
- No-JS blank page: Motion's SSR `opacity:0` styles now have a `<noscript>` override via
  `data-reveal`.
- a11y: `aria-pressed`/focus-flood on nodes replaced with `aria-current` + click-only selection
  (no `aria-live`), heading hierarchy repaired, `role="list"` restored where preflight strips
  semantics, 404 page got the `#main` skip-link target, mobile nav got bigger targets + edge
  fade + hidden scrollbar.
- Honesty: invented "at 16" removed from page copy, bio's overstated present-tense JARVIS
  capability softened, hero "Class of 2029" now derived from content.
- Tooling: duplicate-id checks extended to all collections, safety scan made recursive, a
  manifest-drift gate added to `content:check`, API routes marked `force-static`.

## What was built

- Next.js 15 App Router + TypeScript + Tailwind v4 single-page portfolio with case-study
  subpages (`/projects/{jarvis-os,rlarena,prsense,interviewcopilot}`) and a styled 404.
- **Structured content layer**: 10 files in `src/content/`, all parsed through Zod schemas at
  import time (`src/content/index.ts`), plus cross-file integrity checks and a private-data /
  secret scanner (`pnpm content:check`).
- **Read-only API**: `/api/health`, `/api/site-manifest`, `/api/projects`, `/api/timeline`,
  `/api/skills`, `/api/jarvis/portfolio-context` — all GET-only, `{ meta, data }` envelope.
- **JARVIS layer**: update guide, contract doc, content model doc, manifest generator +
  `public/jarvis-site-manifest.json`.
- **Design system**: token-driven (colors/fonts in `@theme inline`), glass/glow/gradient
  utilities, Section/SectionHeading/Reveal/GlowButton/Badge primitives.
- **Animation system**: Motion for component state (reveals, hover physics, AnimatePresence
  panel, nav progress), GSAP for cinematic sequences (hero timeline, hero scroll-out,
  constellation draw-in, timeline scrub fill, pointer parallax), CSS for infinite ambient
  loops. Reduced motion respected at all three layers.
- Playwright smoke + API suites; ESLint; production build verified.

## Motion usage (intentional)

`MotionConfig reducedMotion="user"`; shared tokens in `src/lib/motion-tokens.ts`; `whileInView`
reveals (`Reveal`, cards, timeline entries); spring hover/press on buttons/nodes/cards;
`AnimatePresence mode="wait"` for the constellation detail panel; `useScroll` + `useSpring` nav
progress beam. Imports are from `motion/react` only.

## GSAP usage (intentional)

Single registration in `src/lib/gsap.ts`; every effect inside `gsap.matchMedia()` gated on
`prefers-reduced-motion: no-preference`; hero entrance timeline with masked line reveals;
scrubbed ScrollTriggers for hero scroll-out and timeline fill; stroke-dash line draw for
constellation connections; `quickTo` pointer parallax (fine pointers only). `from`-tweens only,
so no-JS/reduced-motion users see final visible states.

## Content assumptions Edward should review

1. **JARVIS OS entry + case study** (`source: "local"`): described conservatively as a desktop
   AI system in a private repo; verify the one-liner and the framing "orchestrating agents,
   projects, and tools."
2. **contentOS** (`source: "local"`): described from repo structure (agent roles, Prisma,
   monorepo). Verify public framing.
3. **CareerOS / FrameZero / Agent Ops Daily / Trading Research** (`source: "todo"`): minimal
   placeholder entries with visible "preview" notes. Fill in or remove.
4. **Hero status chip** (`profile.currentStatus`): "Software Intern @ Shift Digital · Building
   JARVIS OS" — update in `src/content/profile.ts` when the internship ends.
5. **Resume link** in `links.ts` is `href: "#"` with a TODO — host a sanitized PDF.
6. Bio paragraph 3 now says the site "is built for" JARVIS to update (softened during review
   from a present-tense capability claim).

## Known weak spots (post-review)

1. **Constellation angles are hand-tuned**; a new node at a bad angle can visually collide with
   labels. The update guide warns (≥25° separation) but nothing enforces it.
2. **`sortKey` regex allows `YYYY`**, and string-sorting `"2026"` vs `"2026-06"` places the
   bare year first — correct here, but a fragile convention.
3. **No dedicated OG image**; social embeds will be plain.
4. **Playwright suite is smoke-depth**: no axe-core a11y pass, no visual regression, contrast
   verified by design (token choices) rather than by automated check.
5. **Pre-hydration reveal gap**: on very slow connections, Motion-revealed content is invisible
   until hydration (the `<noscript>` fix covers JS-disabled, not JS-slow). Inherent to
   whileInView reveals; acceptable, but worth knowing.
6. **"Shipped" wording**: the resume says "built" + public GitHub repos for the June 2026
   platforms; the site says "shipped". Fable judged this a fair paraphrase (built + public +
   demonstrable), but it is an editorial word — Edward should consciously sign off.

## Performance risks

- Hero SVG: ~90 stars but only ~30 twinkle, and an IntersectionObserver pauses all ambient
  loops when the hero leaves the viewport. Non-Chromium engines still repaint the SVG while
  the hero is visible — worth a Safari/low-end Lighthouse pass.
- `backdrop-filter` used on nav + several panels; limited count, but stacking more glass
  layers would hurt.
- First Load JS ~226 kB for `/` (Motion + GSAP both present). Deliberate trade for the
  animation system; code-splitting GSAP-only sections is the next lever if needed.

## Accessibility risks

- Reduced motion: covered at Motion/GSAP/CSS layers and smoke-tested, but only via emulation.
- Constellation nodes are real buttons with labels and `aria-pressed`; the detail panel is
  `aria-live="polite"` — focus order is DOM order (center node first), which is logical but
  positions are visual, so screen-reader order ≠ spatial order (mitigated by canonical cards
  in #work).
- `dim` (#7c85a8) on `void` is ~5:1 — fine for labels, do not use for body copy.
- Timeline alternating cards keep left-aligned text (no mirrored reading).

## Files Opus should inspect first

1. `src/content/schema.ts` + `src/content/index.ts` — the contract's foundation.
2. `src/components/sections/ProjectConstellation.tsx` — most complex component (SVG underlay +
   HTML overlay math, GSAP + Motion interplay).
3. `src/components/hero/Hero.tsx` / `OrbitalField.tsx` — GSAP timelines, parallax cleanup.
4. `scripts/validate-content.ts` — the safety gate JARVIS depends on.
5. `src/app/api/jarvis/portfolio-context/route.ts` — the agent-facing surface.

## JARVIS compatibility risks

- The contract assumes JARVIS edits TypeScript files. TS is more fragile than JSON/YAML for
  programmatic edits; if JARVIS-side editing proves error-prone, migrate content to JSON with
  the same schemas (contract-major bump).
- `contentVersion` bumping is procedural (guide) not enforced (no check that content changes
  bump it). A git hook or CI check could enforce.
- The committed manifest can drift from content if `manifest:generate` isn't run; CI should
  regenerate and diff.
