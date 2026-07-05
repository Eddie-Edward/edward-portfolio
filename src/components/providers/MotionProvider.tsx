"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Global Motion configuration. `reducedMotion="user"` makes every Motion
 * animation on the site automatically respect prefers-reduced-motion:
 * transform/layout animations are disabled while opacity/color still work.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
