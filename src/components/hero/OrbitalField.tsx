"use client";

import { useEffect, useRef } from "react";

import { gsap, NO_MOTION_PREFERENCE } from "@/lib/gsap";

/**
 * Decorative orbital background for the hero.
 *
 * - Continuous orbit rotation is pure CSS (compositor-friendly, auto-paused
 *   by the prefers-reduced-motion rules in globals.css).
 * - Pointer parallax is GSAP `quickTo`, gated behind no-preference and
 *   fine-pointer media queries.
 * - Stars are seeded (deterministic) so SSR and client markup match.
 */

function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

const rand = seededRandom(20260704);
const STARS = Array.from({ length: 90 }, (_, i) => ({
  x: Math.round(rand() * 1200),
  y: Math.round(rand() * 800),
  r: rand() * 1.1 + 0.3,
  delay: (i % 9) * 0.45,
  bright: rand() > 0.8,
}));

/** Dots riding each orbital ring: [ringRadius, angleDeg, dotRadius, color] */
const SATELLITES: Array<[number, number, number, string]> = [
  [220, 30, 5, "var(--color-accent)"],
  [220, 200, 3, "var(--color-nebula-bright)"],
  [340, 80, 4, "var(--color-nebula-bright)"],
  [340, 270, 6, "var(--color-accent)"],
  [340, 330, 2.5, "var(--color-signal)"],
  [460, 140, 4, "var(--color-accent-bright)"],
  [460, 250, 3, "var(--color-nebula)"],
];

function ringDots(radius: number) {
  return SATELLITES.filter(([r]) => r === radius).map(([r, angle, size, color], i) => {
    const rad = (angle * Math.PI) / 180;
    return (
      <circle
        key={`${r}-${i}`}
        cx={Math.cos(rad) * r}
        cy={Math.sin(rad) * r}
        r={size}
        fill={color}
        opacity={0.9}
      />
    );
  });
}

export function OrbitalField() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Pause ambient CSS loops while the hero is off-screen — non-Chromium
    // engines rasterize animated SVG children on the main thread.
    const observer = new IntersectionObserver(([entry]) => {
      root.classList.toggle("ambient-paused", !entry.isIntersecting);
    });
    observer.observe(root);

    const mm = gsap.matchMedia();
    mm.add(`${NO_MOTION_PREFERENCE} and (pointer: fine)`, () => {
      const layers = root.querySelectorAll<HTMLElement>("[data-parallax]");
      const movers = Array.from(layers).map((layer) => {
        const depth = Number(layer.dataset.parallax ?? 1);
        return {
          x: gsap.quickTo(layer, "x", { duration: 0.9, ease: "power2.out" }),
          y: gsap.quickTo(layer, "y", { duration: 0.9, ease: "power2.out" }),
          depth,
        };
      });
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        for (const m of movers) {
          m.x(nx * 14 * m.depth);
          m.y(ny * 10 * m.depth);
        }
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    });
    return () => {
      observer.disconnect();
      mm.revert();
    };
  }, []);

  return (
    <div ref={rootRef} aria-hidden className="absolute inset-0 overflow-hidden">
      {/* Nebula glows */}
      <div
        data-parallax="0.6"
        className="absolute -top-40 left-1/4 h-[34rem] w-[34rem] rounded-full bg-nebula/20 blur-[120px]"
      />
      <div
        data-parallax="1"
        className="absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-[110px]"
      />

      <svg
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        {/* Starfield — only a subset twinkles, to bound continuous repaint */}
        <g data-svg-stars>
          {STARS.map((s, i) => {
            const twinkles = s.bright || i % 4 === 0;
            return (
              <circle
                key={i}
                cx={s.x}
                cy={s.y}
                r={s.r}
                fill={s.bright ? "var(--color-accent-bright)" : "var(--color-ink)"}
                opacity={s.bright ? 0.9 : 0.45}
                className={twinkles ? "star-twinkle" : undefined}
                style={twinkles ? { animationDelay: `${s.delay}s` } : undefined}
              />
            );
          })}
        </g>

        {/* Orbital plane: circles squashed into ellipses, tilted.
            Each ring's outline lives INSIDE its rotating group so the group's
            bounding box (fill-box) is centered on the ring center — dots stay
            on their rings as the group spins. Rotating the circle itself is a
            visual no-op. */}
        <g transform="translate(600 430) rotate(-14) scale(1 0.42)">
          <g className="orbit-slow">
            <circle r="220" fill="none" stroke="var(--color-line)" strokeWidth="1.4" opacity="0.9" />
            {ringDots(220)}
          </g>
          <g className="orbit-reverse">
            <circle r="340" fill="none" stroke="var(--color-line)" strokeWidth="1.2" opacity="0.7" />
            {ringDots(340)}
          </g>
          <g className="orbit-slower">
            <circle r="460" fill="none" stroke="var(--color-line)" strokeWidth="1" opacity="0.5" />
            {ringDots(460)}
          </g>

          {/* Core */}
          <circle r="26" fill="url(#core-glow)" />
          <circle r="7" fill="var(--color-accent-bright)" />
        </g>

        <defs>
          <radialGradient id="core-glow">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* Bottom fade into the page */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-void" />
    </div>
  );
}
