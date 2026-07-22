"use client";

import { useRef } from "react";

import { OrbitalField } from "@/components/hero/OrbitalField";
import { GlowButton } from "@/components/ui/GlowButton";
import { content } from "@/content";
import { gsap, NO_MOTION_PREFERENCE, useGSAP } from "@/lib/gsap";

/**
 * Cinematic hero. GSAP owns the entrance timeline and the scroll-out
 * parallax; ambient orbit motion is CSS (see OrbitalField). All GSAP work is
 * gated behind prefers-reduced-motion: no-preference — with reduce set, the
 * hero renders fully visible and still.
 */
export function Hero() {
  const scopeRef = useRef<HTMLElement>(null);
  const { profile, links } = content;
  const github = links.find((l) => l.kind === "github");
  const email = links.find((l) => l.kind === "email");
  // "May 2028" → "2028"; derived so a content edit updates the hero too.
  const classYear = profile.education.expectedGraduation.split(" ").pop();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_MOTION_PREFERENCE, () => {
        // NOTE: the entrance animates the INNER field wrapper while the
        // scroll scrub below animates the OUTER one — the same element must
        // never receive opacity from two tweens (start-value capture race).
        const tl = gsap.timeline();
        tl.from("[data-hero-field-inner]", { opacity: 0, scale: 1.05, duration: 1.6, ease: "power2.out" }, 0)
          .from("[data-hero-kicker]", { y: 22, opacity: 0, duration: 0.6 }, 0.25)
          .from(
            "[data-hero-line]",
            { yPercent: 115, duration: 0.95, stagger: 0.14, ease: "power4.out" },
            0.35,
          )
          .from("[data-hero-mission]", { y: 24, opacity: 0, duration: 0.7 }, "-=0.45")
          .from("[data-hero-chip]", { y: 16, opacity: 0, duration: 0.5 }, "-=0.4")
          .from("[data-hero-cta] > *", { y: 16, opacity: 0, duration: 0.5, stagger: 0.09 }, "-=0.35")
          .from("[data-hero-cue]", { opacity: 0, duration: 0.6 }, "-=0.1");

        // Scroll-out: content drifts up and the field dims as you leave.
        gsap.to("[data-hero-content]", {
          y: -70,
          opacity: 0.35,
          ease: "none",
          scrollTrigger: {
            trigger: scopeRef.current,
            start: "top top",
            end: "bottom 30%",
            scrub: true,
          },
        });
        gsap.to("[data-hero-field]", {
          opacity: 0.35,
          ease: "none",
          scrollTrigger: {
            trigger: scopeRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    },
    { scope: scopeRef },
  );

  return (
    <section
      ref={scopeRef}
      id="top"
      className="relative flex min-h-svh items-center overflow-hidden"
    >
      <div data-hero-field className="absolute inset-0">
        <div data-hero-field-inner className="absolute inset-0">
          <OrbitalField />
        </div>
      </div>

      <div
        data-hero-content
        className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-28 pb-20 sm:px-8"
      >
        <p
          data-hero-kicker
          className="mb-6 font-mono text-[11px] tracking-[0.35em] text-dim uppercase sm:text-xs"
        >
          {profile.location} · {profile.education.school} · Class of {classYear}
        </p>

        <h1 className="font-display font-bold tracking-tight">
          <span className="block overflow-hidden">
            <span
              data-hero-line
              className="text-gradient block pb-2 text-5xl sm:text-7xl lg:text-8xl"
            >
              {profile.name}
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              data-hero-line
              className="block pt-1 text-2xl font-medium text-mist sm:text-4xl lg:text-5xl"
            >
              {profile.headline}.
            </span>
          </span>
        </h1>

        <p
          data-hero-mission
          className="mt-7 max-w-2xl text-base leading-relaxed text-mist sm:text-lg"
        >
          {profile.mission}
        </p>

        {profile.currentStatus ? (
          <div data-hero-chip className="mt-7">
            <span className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 font-mono text-xs text-mist">
              <span className="node-pulse size-2 rounded-full bg-signal" aria-hidden />
              Now: {profile.currentStatus}
            </span>
          </div>
        ) : null}

        <div data-hero-cta className="mt-10 flex flex-wrap items-center gap-4">
          <GlowButton href="#systems">Explore the systems ↓</GlowButton>
          {github ? (
            <GlowButton href={github.href} variant="ghost" external>
              GitHub ↗
            </GlowButton>
          ) : null}
          {email ? (
            <GlowButton href={email.href} variant="ghost">
              Email me
            </GlowButton>
          ) : null}
        </div>
      </div>

      <div
        data-hero-cue
        aria-hidden
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center"
      >
        <span className="scroll-cue block font-mono text-xs text-dim">▼</span>
      </div>
    </section>
  );
}
