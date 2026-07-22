# edward-portfolio — agent context

Edward Lei's cinematic portfolio (AI systems builder, UMich CS '28). Next.js 15 App Router +
TS + Tailwind v4 + Motion + GSAP + Zod + Playwright. **Every fact on the site lives in
`src/content/*.ts`** (Zod-validated); UI is a pure function of that content layer. Built to be
updated by JARVIS (Edward's AI system) via structured edits — never by editing rendered HTML.

## Commands

```bash
pnpm install            # deps
pnpm dev                # localhost:3000
pnpm manifest:generate  # refresh public/jarvis-site-manifest.json (run BEFORE content:check)
pnpm content:check      # Zod schemas + integrity + PII/secret scan + manifest drift — must pass
pnpm build              # production build (also validates content)
pnpm test:e2e           # Playwright (needs: npx playwright install chromium)
pnpm lint               # eslint
```

## Content architecture (edit these, never components, to change facts)

- `src/content/schema.ts` — Zod schemas + `source: resume|local|site|todo` provenance
- `src/content/profile.ts` — identity, mission, bio, education, currentStatus
- `src/content/projects.ts` — projects, constellation slots, case studies
- `src/content/timeline.ts` — chronological entries (keep sortKey order)
- `src/content/skills.ts` · `links.ts` · `achievements.ts` · `coursework.ts` · `roadmap.ts`
- `src/content/site-config.ts` — nav, contentVersion (bump on content change), JARVIS contract info

## JARVIS contract

- Contract: `docs/jarvis-portfolio-contract.md` (v1.0.0) · guide: `docs/jarvis-update-guide.md`
- Machine-readable: `public/jarvis-site-manifest.json` + `GET /api/jarvis/portfolio-context`
- APIs are read-only, force-static: `/api/{health,site-manifest,projects,timeline,skills}`

## Safety rules (hard)

Never: secrets, `.env` contents, private street address, phone number, raw resume text,
unsupported/invented claims (use `source:"todo"` + todo note for unverified), public
write/admin endpoints, databases, analytics/tracking. `content:check` scans for violations —
never weaken it to make an edit pass.

## Update workflow

1. Edit `src/content/*` (bump `contentVersion`) → 2. `pnpm manifest:generate` →
3. `pnpm content:check` → 4. `pnpm build` → 5. `pnpm test:e2e` → 6. commit with explicit
pathspecs (never `git add .`).

## Deployment

Personal GitHub repo → Vercel Hobby. No env vars required for v1. See
`docs/deployment-notes.md`.

## Current visual state (as of v3 polish)

- Hero: approved — do not redesign.
- Selected Work filter chips: acceptable — no carousel.
- Constellation motion (drift amplitude/speed, living edges): may still be tuned to taste —
  knobs in `src/components/sections/ProjectConstellation.tsx` (`signedRandom` ranges).
- Jun 2026 platforms use the conservative "built" wording (applied 2026-07-21 per the
  recruiter-readiness plan). "Shipped" may return only with Edward's explicit sign-off.

More: `docs/project-state.md` (current state), `docs/content-model.md`,
`docs/animation-system.md`, `docs/design-system.md`,
`docs/fable-portfolio-implementation-review.md` (honest self-review).
