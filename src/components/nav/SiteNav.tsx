"use client";

import { motion, useScroll, useSpring } from "motion/react";

import { content } from "@/content";
import { DUR, EASE_OUT } from "@/lib/motion-tokens";

/**
 * Fixed glass nav with a scroll-progress beam (Motion useScroll → spring).
 */
export function SiteNav() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });
  const github = content.links.find((l) => l.kind === "github");

  return (
    <motion.header
      data-reveal
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: DUR.base, ease: EASE_OUT, delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      {/* Scroll progress beam */}
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="h-0.5 origin-left bg-gradient-to-r from-accent via-nebula to-accent"
      />
      <div className="glass-strong border-b border-line/60">
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8"
        >
          <a
            href="#top"
            className="flex items-baseline gap-2 font-display text-sm font-semibold tracking-wide"
          >
            <span className="text-gradient text-base">EL</span>
            <span className="hidden text-mist sm:inline">{content.profile.name}</span>
          </a>
          {/* Scrollable on narrow screens: hidden scrollbar + edge fade as
              the affordance that more links exist past the fold. */}
          <div className="relative min-w-0">
            <div className="scrollbar-none flex items-center gap-1 overflow-x-auto pr-6 sm:gap-2 sm:pr-0">
              {content.siteConfig.nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-2.5 py-2 text-xs whitespace-nowrap text-mist transition-colors hover:text-ink sm:py-1.5 sm:text-sm"
                >
                  {item.label}
                </a>
              ))}
              {github ? (
                <a
                  href={github.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 rounded-full border border-line px-3 py-2 font-mono text-xs whitespace-nowrap text-accent transition-colors hover:border-accent/60 sm:py-1.5"
                >
                  GitHub ↗
                </a>
              ) : null}
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-void/90 to-transparent sm:hidden"
            />
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
