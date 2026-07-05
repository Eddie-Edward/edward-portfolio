# Deployment notes

## Requirements

- Node 20+ and pnpm. No database, no environment variables, no secrets — the site is fully
  static-friendly with a handful of read-only JSON routes.

## Recommended: Vercel

1. Push this repo to GitHub (public or private).
2. Import into Vercel — framework auto-detected (Next.js). Build command `pnpm build`, no env
   vars needed.
3. Set the production domain; update `docs/` references if a canonical URL matters later.

Any Node host works the same way: `pnpm install && pnpm build && pnpm start`.

## Pre-deploy checklist

```bash
pnpm lint
pnpm content:check
pnpm manifest:generate   # commit the refreshed manifest
pnpm build
pnpm test:e2e            # optional but recommended (npx playwright install chromium first)
```

## Post-deploy sanity

- `GET /api/health` → `{ data: { status: "ok" } }`
- `GET /api/jarvis/portfolio-context` → full bundle, correct `contentVersion`
- `/` renders with animations; `/projects/rlarena` renders; `/does-not-exist` → styled 404
- Check once with OS "reduce motion" enabled.

## Explicitly out of scope in v1 (by design)

- Analytics or tracking of any kind
- Databases, auth, admin UIs, write endpoints
- Serving the raw resume (only a sanitized PDF may ever go in `public/`)

## Known operational notes

- `public/jarvis-site-manifest.json` is generated — regenerate after content changes rather
  than editing by hand (`pnpm content:check` fails on a stale manifest).
- API routes are statically generated (`export const dynamic = "force-static"`); content
  changes require a redeploy (that's the contract — content lives in the repo).
