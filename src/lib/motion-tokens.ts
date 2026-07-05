/**
 * Motion tokens — the shared vocabulary for every Motion (motion/react)
 * animation on the site. Import these instead of inventing per-component
 * values, so the whole site moves with one voice.
 * See docs/animation-system.md.
 */
import type { Transition } from "motion/react";

/** Signature ease for entrances — decisive start, soft landing. */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const DUR = {
  fast: 0.25,
  base: 0.55,
  slow: 0.9,
} as const;

/** Springs for physical, interruptible motion (hover, press, panels). */
export const SPRING_SNAPPY: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 30,
};

export const SPRING_SOFT: Transition = {
  type: "spring",
  stiffness: 170,
  damping: 26,
};

/** Standard whileInView viewport config — reveal once, slightly early. */
export const VIEWPORT_ONCE = { once: true, amount: 0.2 } as const;

export const STAGGER = {
  tight: 0.06,
  base: 0.1,
} as const;

/** Shared reveal variants for section content. */
export const riseVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: DUR.base,
      ease: EASE_OUT,
      delay: i * STAGGER.base,
    },
  }),
};
