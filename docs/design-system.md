# Design system

The visual language: **orbital, cinematic, technical but human.** Deep-space surfaces, glass
panels, restrained neon accents, mono labels over display headlines. Everything is defined as
tokens in `src/app/globals.css` (Tailwind v4 `@theme inline`).

## Color tokens

| Token | Value | Use |
| --- | --- | --- |
| `void` | `#05060f` | Page background. |
| `abyss` | `#0b0e1e` | Alternate section depth. |
| `surface` | `#11142a` | Glass panel base (used at low alpha). |
| `ink` | `#e8ebf8` | Primary text. |
| `mist` | `#9aa3c4` | Secondary text — body copy on dark. |
| `dim` | `#7c85a8` | Tertiary text — labels, metadata only (AA at small-label sizes; don't use for paragraphs). |
| `line` | `#232945` | Hairlines, orbit rings, borders. |
| `accent` / `accent-bright` | `#22d3ee` / `#7deffc` | Primary accent — shipped work, CTAs, links. |
| `nebula` / `nebula-bright` | `#8b5cf6` / `#b79dfa` | Secondary accent — in-progress work, glows. |
| `signal` | `#fbbf24` | Sparse alerts — "active/now" states only. |

Rule of thumb: accent = done, nebula = becoming, signal = happening now. Never use all three in
one component.

## Typography

- **Display** — Space Grotesk (`font-display`): headlines, buttons, card titles.
- **Body** — Inter (`font-body`): paragraphs.
- **Mono** — JetBrains Mono (`font-mono`): kickers, metadata, chips, machine-ish labels.

Scale (Tailwind classes): hero name `text-5xl → text-8xl`; section titles `text-3xl → text-5xl`;
card titles `text-lg/xl`; body `text-sm → text-lg`; labels/kickers `text-xs` with
`tracking-[0.25em+]` uppercase.

## Surfaces

- `.glass` — translucent panel: surface at ~42% + 1px ink-tinted border + 14px backdrop blur.
- `.glass-strong` — nav, detail panels: more opaque, more blur.
- `.glow-accent` / `.glow-nebula` — layered box-shadow halos. Use on small elements (dots,
  buttons), never on large panels (GPU cost).
- `.text-gradient` — ink → accent → nebula headline gradient.
- `.grid-backdrop` — faint blueprint grid + nebula wash, masked out toward the bottom.

## Primitives (`src/components/ui/`)

- `Section` — anchor id, scroll margin, consistent max-width (`max-w-6xl`, `wide` → `7xl`) and
  vertical rhythm (`py-24/32`).
- `SectionHeading` — kicker + title + optional lede with staggered reveal.
- `Reveal` — standard Motion scroll-reveal wrapper (rise + fade, staggered by `index`).
- `GlowButton` — primary (gradient + glow) and ghost (glass) CTA links with spring physics.
- `StatusBadge` / `Chip` — status dots and mono chips.

## Layout rules

- One page, seven anchored sections (`#about #systems #work #timeline #skills #roadmap
  #contact`) + case-study subpages.
- Mobile-first; the constellation map is desktop-only (`lg+`) and collapses to a node list that
  anchors into the canonical cards.
- `body { overflow-x: clip }` plus per-section max-widths guard against horizontal overflow.
- Focus styles are global (`:focus-visible` → accent outline); a skip link precedes the nav.
