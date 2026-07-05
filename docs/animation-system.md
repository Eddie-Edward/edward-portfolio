# Animation system

Two engines, deliberately divided. **Motion** (`motion/react`) owns component-level state —
things that respond to the user. **GSAP** (+ ScrollTrigger via `@gsap/react`) owns cinematic
sequences — things that respond to time and scroll. CSS owns infinite ambient loops.

## Division of labor

| Concern | Engine | Where |
| --- | --- | --- |
| Scroll reveals (sections, cards, headings) | Motion `whileInView` | `Reveal`, `ProjectCard`, `Timeline` entries |
| Hover / press physics | Motion springs | `GlowButton`, constellation nodes, cards |
| Panel swap on node selection | Motion `AnimatePresence` | `ProjectConstellation` detail panel |
| Nav scroll-progress beam | Motion `useScroll` + `useSpring` | `SiteNav` |
| Hero entrance sequence | GSAP timeline | `Hero` (masked line reveals, staggered CTAs) |
| Hero scroll-out parallax | GSAP ScrollTrigger (scrub) | `Hero` |
| Constellation ring/line draw-in | GSAP ScrollTrigger + stroke-dash | `ProjectConstellation` |
| Timeline progress fill | GSAP ScrollTrigger (scrub) | `Timeline` |
| Pointer parallax on hero field | GSAP `quickTo` | `OrbitalField` |
| Infinite orbit rotation, twinkle, pulses | Pure CSS keyframes | `globals.css` |

## Shared tokens

- Motion: `src/lib/motion-tokens.ts` — `EASE_OUT` (signature curve), `DUR`, `SPRING_SNAPPY`,
  `SPRING_SOFT`, `riseVariants`, `VIEWPORT_ONCE`. Components import these; no ad-hoc values.
- GSAP: `src/lib/gsap.ts` — single registration point, `power3.out` default ease, and the
  `NO_MOTION_PREFERENCE` media string every GSAP effect must be gated behind.

## Reduced motion (three layers)

1. **Motion**: `MotionConfig reducedMotion="user"` in `MotionProvider` — transforms disabled
   globally, opacity fades remain.
2. **GSAP**: every animation is created inside `gsap.matchMedia().add("(prefers-reduced-motion:
   no-preference)", ...)` — with reduce set, nothing is created and content renders in its
   final, fully visible state (`from`-style tweens only).
3. **CSS**: `@media (prefers-reduced-motion: reduce)` kills all ambient keyframe loops, and
   `scroll-behavior` falls back to auto.

## Performance rules

- Animate only `transform` and `opacity`. No layout properties, no filters mid-animation.
- Infinite loops live in CSS (compositor thread), not JS.
- Pointer-follow uses `gsap.quickTo` (pre-allocated tweens), gated to fine pointers.
- Scroll-linked values go through Motion springs or ScrollTrigger scrub — never per-frame React
  state (`useState` in `onUpdate` is banned).
- Blur/glow costs: `backdrop-filter` limited to nav + panels; large glows are static gradients,
  not animated shadows.
- Everything is `once: true` where re-triggering adds nothing.

## Adding a new animated component

1. Client component (`"use client"`), import tokens from `motion-tokens.ts` / `gsap.ts`.
2. User-responsive state → Motion. Scroll/time choreography → GSAP inside `useGSAP` +
   `matchMedia` gate, scoped with a ref.
3. Never read a MotionValue during render; never import from `framer-motion`.
4. Check it at 390px width and with reduced motion before shipping.
