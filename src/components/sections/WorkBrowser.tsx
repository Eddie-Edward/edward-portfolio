"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

import { ProjectCard } from "@/components/sections/ProjectCard";
import { content } from "@/content";
import type { Project } from "@/content/schema";
import { EASE_OUT, riseVariants, VIEWPORT_ONCE } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

/**
 * Selected Work browser: filter chips + the canonical project grid.
 *
 * Built to scale as Edward ships more projects — the chips narrow the grid
 * by lens instead of forcing an ever-longer stack. Filters are pure view
 * predicates over schema fields (status/category/featured/source); every
 * fact still comes from src/content/projects.ts, and new projects slot into
 * the right lenses automatically.
 *
 * Motion: chips toggle a filtered list rendered through AnimatePresence
 * popLayout — leavers fade/scale out, stayers glide to their new grid slot
 * (layout), enterers rise in with the standard reveal stagger. Reduced
 * motion (MotionConfig "user") collapses all of it to plain fades.
 */

type FilterDef = {
  id: string;
  label: string;
  match: (p: Project) => boolean;
};

/**
 * `category` encodes form factor (platform/devtool/…), so the domain-style
 * "AI Systems" lens also reads AI signals from the structured tagline/stack
 * strings — RLArena (PyTorch), PRSense ("AI code review"), etc. belong there
 * even though their category is platform/devtool.
 */
const AI_SIGNAL = /\bai\b|llm|claude|pytorch|agent|reinforcement/i;

/**
 * Lenses are heuristic views, not a taxonomy: chips with zero matches stay
 * hidden, `archived` work remains reachable through All + its category lens,
 * and new schema-valid projects surface automatically wherever they match.
 */
const FILTERS: FilterDef[] = [
  { id: "all", label: "All", match: () => true },
  { id: "featured", label: "Featured", match: (p) => p.featured },
  { id: "shipped", label: "Shipped", match: (p) => p.status === "shipped" },
  {
    id: "active",
    label: "Active",
    match: (p) => p.status === "active" || p.status === "in-progress",
  },
  {
    id: "ai-systems",
    label: "AI Systems",
    match: (p) =>
      p.category === "ai-systems" ||
      p.category === "automation" ||
      AI_SIGNAL.test(p.tagline) ||
      p.stack.some((tech) => AI_SIGNAL.test(tech)),
  },
  {
    id: "full-stack",
    label: "Full-Stack",
    match: (p) => p.category === "platform" || p.category === "devtool" || p.category === "site",
  },
  { id: "robotics", label: "Robotics", match: (p) => p.category === "robotics" },
  {
    id: "research",
    label: "Research",
    match: (p) => p.category === "research" || p.status === "research",
  },
  { id: "previews", label: "Previews", match: (p) => p.source === "todo" },
];

export function WorkBrowser() {
  const projects = content.projects;
  const [activeFilter, setActiveFilter] = useState("all");

  const counts = useMemo(
    () => new Map(FILTERS.map((f) => [f.id, projects.filter(f.match).length])),
    [projects],
  );

  const filter = FILTERS.find((f) => f.id === activeFilter) ?? FILTERS[0];
  const visible = projects.filter(filter.match);

  // The mobile constellation list anchors to #project-<slug> cards. A card
  // hidden by the active filter would make those anchors dead ends — reset
  // to "all" and finish the scroll once the card has remounted.
  useEffect(() => {
    const revealAnchorTarget = () => {
      const hash = window.location.hash;
      if (!hash.startsWith("#project-")) return;
      setActiveFilter("all");
      window.setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView();
      }, 80);
    };
    window.addEventListener("hashchange", revealAnchorTarget);
    return () => window.removeEventListener("hashchange", revealAnchorTarget);
  }, []);

  return (
    <div>
      {/* ── Filter chips ──────────────────────────────────────────────── */}
      <div role="group" aria-label="Filter systems" className="mb-10 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const count = counts.get(f.id) ?? 0;
          if (count === 0) return null; // chips appear as matching work exists
          const isActive = f.id === activeFilter;
          return (
            <button
              key={f.id}
              type="button"
              // Re-tapping the active lens returns to All; aria-current (not
              // aria-pressed) — this is a current-selection marker, not a
              // freely un-pressable toggle.
              onClick={() => setActiveFilter(isActive && f.id !== "all" ? "all" : f.id)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "rounded-full border px-3.5 py-2 font-mono text-xs whitespace-nowrap transition-colors sm:py-1.5",
                isActive
                  ? "border-accent/60 bg-accent/10 text-accent"
                  : "border-line text-mist hover:border-dim/60 hover:text-ink",
              )}
            >
              {f.label}
              <span className={cn("ml-1.5", isActive ? "text-accent/70" : "text-dim")}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* aria-atomic so the whole sentence is announced, not the mutated
          number node alone; single template string keeps it one text node. */}
      <p aria-live="polite" aria-atomic="true" className="sr-only">
        {`Showing ${visible.length} of ${projects.length} systems`}
      </p>

      {/* ── Grid ──────────────────────────────────────────────────────── */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((project, i) => (
            <motion.div
              key={project.slug}
              data-reveal
              // position-only: boolean layout would also scale-animate size
              // changes and visibly distort card text during filter moves.
              layout="position"
              variants={riseVariants}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
              exit={{
                opacity: 0,
                scale: 0.96,
                transition: { duration: 0.18, ease: EASE_OUT },
              }}
              custom={i % 3}
              className="h-full"
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {visible.length === 0 ? (
        <p className="glass rounded-xl px-5 py-8 text-center font-mono text-sm text-dim">
          No systems match this lens yet.
        </p>
      ) : null}
    </div>
  );
}
