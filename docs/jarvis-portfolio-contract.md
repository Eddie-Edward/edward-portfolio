# JARVIS ↔ portfolio contract

**Contract version: 1.0.0** (mirrored in `src/content/site-config.ts` → `jarvis.contractVersion`)

This document is the stable interface between Edward's portfolio and JARVIS. Code and docs may
evolve freely; the guarantees below only change with a contract version bump.

## Guarantees this repo makes to JARVIS

1. **Single content source.** All rendered facts come from `src/content/*.ts`, validated by
   `src/content/schema.ts`. No facts are hardcoded in components.
2. **Stable entry points.**
   - `src/content/` — the editable surface
   - `pnpm content:check` — the validation gate (exit code 0 = safe)
   - `pnpm manifest:generate` — refreshes `public/jarvis-site-manifest.json`
   - `GET /api/health`, `/api/site-manifest`, `/api/projects`, `/api/timeline`, `/api/skills`,
     `/api/jarvis/portfolio-context`
3. **Read-only web surface.** No route mutates state. There is no admin UI, no auth, no
   database. The only write path is a git commit to this repo.
4. **Envelope stability.** API responses are `{ meta: { endpoint, contentVersion,
   contractVersion, readOnly }, data: ... }`. `portfolio-context` additionally carries
   `agentGuidance`. Fields are additive within a contract major version.
5. **Version signals.** `contentVersion` changes whenever content changes; `contractVersion`
   changes only when this contract changes.

## Obligations JARVIS accepts

1. Consume `/api/jarvis/portfolio-context` or the content files — never scrape rendered HTML.
2. Follow `docs/jarvis-update-guide.md` for every edit; always run `pnpm content:check` and
   `pnpm manifest:generate` before committing.
3. Never weaken schemas, integrity checks, or the safety scan to make an edit pass.
4. Never introduce: unverified claims, phone numbers, street addresses, raw resume text,
   secrets, analytics/tracking, write endpoints, or a database.
5. Use explicit git pathspecs; never `git add .`.
6. Treat `source: "todo"` entries as unconfirmed — JARVIS may fill them in only with
   information Edward has verified in conversation or via a trusted repo.

## Schema evolution

- **Additive optional fields** → patch/minor contract bump; old content stays valid.
- **New required fields / renames / removals** → major contract bump; update every content
  file, this doc, the update guide, and `jarvis.contractVersion` in the same commit.

## Trusted Projects binding (future)

When JARVIS gains Trusted Projects support, bind this repo with:

- root: `C:\Users\edwar\Projects\edward-portfolio`
- capabilities: read all; write limited to `src/content/**`, `public/jarvis-site-manifest.json`
- required checks: `pnpm content:check && pnpm build`
- commit style: `content: <what changed>` with explicit pathspecs
