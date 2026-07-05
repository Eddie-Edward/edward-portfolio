/**
 * Central GSAP setup. Every client component that uses GSAP imports from
 * here so ScrollTrigger registration happens exactly once and defaults are
 * consistent. See docs/animation-system.md.
 */
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 0.8 });
}

/** Media query GSAP animations should respect. */
export const NO_MOTION_PREFERENCE = "(prefers-reduced-motion: no-preference)";
export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

export { gsap, ScrollTrigger, useGSAP };
