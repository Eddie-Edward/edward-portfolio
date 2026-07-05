"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { riseVariants, VIEWPORT_ONCE } from "@/lib/motion-tokens";

/**
 * Standard scroll-reveal wrapper (Motion). Content rises and fades in once
 * when it enters the viewport. `index` staggers siblings.
 * Reduced motion: handled globally by MotionConfig — falls back to fade.
 */
export function Reveal({
  children,
  index = 0,
  className,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  return (
    <motion.div
      data-reveal
      className={className}
      variants={riseVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      custom={index}
    >
      {children}
    </motion.div>
  );
}
