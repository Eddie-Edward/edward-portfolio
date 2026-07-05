# edward-portfolio

Edward Lei's personal site — a cinematic, animated portfolio presenting Edward as an AI systems
builder and engineering student. Built to be updated by humans *or* by JARVIS (Edward's personal
AI system) through a structured content contract.

## Stack

- **Next.js (App Router) + TypeScript + Tailwind CSS v4**
- **Motion** (`motion/react`) — component transitions, hover/press physics, scroll reveals
- **GSAP + @gsap/react** — cinematic hero timeline, scroll-scrubbed sequences, constellation draw-in
- **Zod** — every content file validates against `src/content/schema.ts`
- **Playwright** — smoke + API + responsive/accessibility checks

## Run locally

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Quality gates

```bash
pnpm lint               # ESLint
pnpm content:check      # Zod schemas + integrity + private-data/secret scan
pnpm build              # production build
pnpm manifest:generate  # refresh public/jarvis-site-manifest.json
pnpm test:e2e           # Playwright smoke tests (installs: npx playwright install chromium)
```

## Where things live

| Path | Purpose |
| --- | --- |
| `src/content/` | **All site content** — typed, Zod-validated. Edit these, never the UI, to change facts. |
| `src/app/` | Pages + read-only API routes (`/api/...`). |
| `src/components/` | Design system + sections. |
| `src/lib/` | Motion/GSAP tokens, manifest builder. |
| `docs/` | Content model, JARVIS update guide & contract, design/animation systems. |
| `scripts/` | `validate-content.ts`, `generate-site-manifest.ts`. |
| `tests/e2e/` | Playwright suites. |

## JARVIS compatibility

JARVIS updates this site by editing `src/content/*.ts` (never rendered HTML), then running
`pnpm content:check`. Machine-readable entry points:

- `GET /api/jarvis/portfolio-context` — full public content bundle
- `GET /api/site-manifest` · `public/jarvis-site-manifest.json`
- `docs/jarvis-update-guide.md` · `docs/jarvis-portfolio-contract.md`

## Honesty & privacy rules

No invented achievements, metrics, or employment. Uncertain details are marked `source: "todo"`.
No analytics, no tracking, no database. Never commit phone numbers, street addresses, raw resume
text, or secrets — `pnpm content:check` scans for all of these.
