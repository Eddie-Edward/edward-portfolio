"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { SPRING_SNAPPY } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

/**
 * Primary CTA link. Motion handles hover/press physics; the glow is CSS.
 */
export function GlowButton({
  href,
  children,
  variant = "primary",
  external = false,
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
  className?: string;
}) {
  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      whileHover={{ scale: 1.04, y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={SPRING_SNAPPY}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-6 py-3 font-display text-sm font-medium tracking-wide",
        variant === "primary"
          ? "glow-accent bg-gradient-to-r from-accent to-nebula text-void"
          : "glass text-ink hover:border-accent/60",
        className,
      )}
    >
      {children}
    </motion.a>
  );
}
