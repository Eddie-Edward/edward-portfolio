"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useRef, useState } from "react";

import { StatusBadge, Chip } from "@/components/ui/Badge";
import { content } from "@/content";
import type { Project } from "@/content/schema";
import { gsap, NO_MOTION_PREFERENCE, useGSAP } from "@/lib/gsap";
import { DUR, EASE_OUT, SPRING_SNAPPY, SPRING_SOFT } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

/**
 * The project constellation: every system as a node on an orbital map.
 *
 * - Orbit rings + connection lines: SVG underlay, drawn in by GSAP when the
 *   section scrolls into view.
 * - Nodes: real <button>s (keyboard/screen-reader friendly) animated with
 *   Motion — pop-in stagger, hover/press physics, selection ring.
 * - Detail panel: AnimatePresence crossfade keyed by selected project.
 * - Mobile (< lg): the map is replaced by a compact node list that anchors
 *   to the canonical project cards in #work.
 */

const ORBIT_RADII = [0, 24, 36, 46]; // % of container

function nodePosition(project: Project) {
  const r = ORBIT_RADII[project.constellation.orbit];
  const rad = (project.constellation.angle * Math.PI) / 180;
  return {
    x: 50 + r * Math.cos(rad),
    y: 50 - r * Math.sin(rad),
  };
}

const DOT_SIZE: Record<string, string> = {
  lg: "size-5",
  md: "size-4",
  sm: "size-3",
};

/**
 * Stagger comes from the parent (delayChildren/staggerChildren) so the
 * per-node `visible` transition carries no delay — gesture-end (hover-out)
 * re-enters `visible` and must spring back immediately.
 */
const containerVariants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.15, staggerChildren: 0.07 } },
};

const nodeVariants = {
  hidden: { opacity: 0, scale: 0.4 },
  visible: { opacity: 1, scale: 1, transition: SPRING_SOFT },
};

export function ProjectConstellation() {
  const scopeRef = useRef<HTMLDivElement>(null);
  const projects = content.projects;
  const [selectedSlug, setSelectedSlug] = useState(projects[0]?.slug ?? "");
  const selected = projects.find((p) => p.slug === selectedSlug) ?? projects[0];

  const positions = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    for (const p of projects) map.set(p.slug, nodePosition(p));
    return map;
  }, [projects]);

  const connections = useMemo(() => {
    const seen = new Set<string>();
    const pairs: Array<{ from: { x: number; y: number }; to: { x: number; y: number }; key: string }> = [];
    for (const p of projects) {
      for (const other of p.connections) {
        const key = [p.slug, other].sort().join("|");
        if (seen.has(key)) continue;
        seen.add(key);
        const from = positions.get(p.slug);
        const to = positions.get(other);
        if (from && to) pairs.push({ from, to, key });
      }
    }
    return pairs;
  }, [projects, positions]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_MOTION_PREFERENCE, () => {
        gsap.from("[data-orbit-ring]", {
          scale: 0.85,
          opacity: 0,
          transformOrigin: "50% 50%",
          duration: 1.1,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: scopeRef.current, start: "top 72%" },
        });
        gsap.from("[data-conn-line]", {
          strokeDashoffset: 1,
          duration: 1.3,
          stagger: 0.07,
          ease: "power2.inOut",
          scrollTrigger: { trigger: scopeRef.current, start: "top 65%" },
        });
      });
    },
    { scope: scopeRef },
  );

  return (
    <div ref={scopeRef} className="grid items-start gap-8 xl:grid-cols-[3fr_2fr] xl:gap-12">
      {/* ── Map (lg and up) ─────────────────────────────────────────────── */}
      <div className="relative mx-auto hidden aspect-square w-full max-w-[760px] lg:block">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
          className="absolute inset-0 h-full w-full overflow-visible"
        >
          {ORBIT_RADII.slice(1).map((r) => (
            <circle
              key={r}
              data-orbit-ring
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke="var(--color-line)"
              strokeWidth="0.18"
            />
          ))}
          {connections.map((c) => (
            <line
              key={c.key}
              data-conn-line
              x1={c.from.x}
              y1={c.from.y}
              x2={c.to.x}
              y2={c.to.y}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={0}
              stroke="color-mix(in srgb, var(--color-accent) 35%, transparent)"
              strokeWidth="0.16"
            />
          ))}
        </svg>

        <motion.div
          data-reveal
          className="absolute inset-0"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {projects.map((project) => {
            const pos = positions.get(project.slug)!;
            const isCenter = project.constellation.orbit === 0;
            const isSelected = project.slug === selectedSlug;
            return (
              /* Anchoring wrapper is NOT animated — Motion writes inline
                 transforms on the button, which would clobber CSS translate
                 utilities. The button's box is just the dot, so the dot
                 center lands exactly on the ring point; the label hangs
                 below without affecting geometry. */
              <div
                key={project.slug}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                <motion.button
                  type="button"
                  variants={nodeVariants}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.94 }}
                  transition={SPRING_SNAPPY}
                  onClick={() => setSelectedSlug(project.slug)}
                  aria-current={isSelected ? "true" : undefined}
                  aria-label={`${project.name} — ${project.tagline}`}
                  className="relative flex items-center justify-center"
                >
                  {isCenter ? (
                    <span
                      className={cn(
                        "glow-accent node-pulse flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-accent to-nebula font-display text-[11px] font-bold tracking-widest text-void",
                        isSelected && "ring-2 ring-accent-bright ring-offset-2 ring-offset-void",
                      )}
                    >
                      JARVIS
                    </span>
                  ) : (
                    <span
                      className={cn(
                        "rounded-full",
                        DOT_SIZE[project.constellation.size],
                        project.status === "shipped" ? "glow-accent bg-accent" : "glow-nebula bg-nebula-bright",
                        isSelected && "ring-2 ring-accent-bright ring-offset-2 ring-offset-void",
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      "absolute top-full left-1/2 mt-2 -translate-x-1/2 font-mono text-[11px] whitespace-nowrap transition-colors",
                      isSelected ? "text-ink" : "text-dim",
                    )}
                  >
                    {project.name}
                  </span>
                </motion.button>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* ── Mobile node list ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 lg:hidden">
        {projects.map((project) => (
          <a
            key={project.slug}
            href={`#project-${project.slug}`}
            className="glass flex items-center gap-3 rounded-xl px-4 py-3"
          >
            <span
              className={cn(
                "size-2.5 shrink-0 rounded-full",
                project.status === "shipped" ? "bg-accent" : "bg-nebula-bright",
              )}
              aria-hidden
            />
            <span className="min-w-0">
              <span className="block truncate font-display text-sm font-medium">{project.name}</span>
              <span className="block truncate text-xs text-dim">{project.tagline}</span>
            </span>
          </a>
        ))}
      </div>

      {/* ── Detail panel (lg and up) ──────────────────────────────────────
          No aria-live: updates are always user-initiated (click/Enter on a
          node), so announcing the whole panel on every change is noise. */}
      <div className="hidden lg:block" role="region" aria-label="Selected system details">
        <AnimatePresence mode="wait">
          <motion.article
            key={selected.slug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: DUR.fast, ease: EASE_OUT }}
            className="glass-strong rounded-2xl p-7"
          >
            <div className="flex items-center justify-between gap-4">
              <StatusBadge status={selected.status} />
              <span className="font-mono text-[11px] text-dim">{selected.period}</span>
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold">{selected.name}</h3>
            <p className="mt-1 text-sm text-accent">{selected.tagline}</p>
            <p className="mt-4 text-sm leading-relaxed text-mist">{selected.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {selected.stack.map((tech) => (
                <Chip key={tech}>{tech}</Chip>
              ))}
            </div>
            {selected.todo ? (
              <p className="mt-4 font-mono text-[11px] text-dim">
                ◌ Some details are still being written — treat this entry as a preview.
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {selected.caseStudy ? (
                <Link
                  href={`/projects/${selected.slug}`}
                  className="font-display text-sm font-medium text-accent hover:text-accent-bright"
                >
                  Read the case study →
                </Link>
              ) : null}
              {selected.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-mist hover:text-ink"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  );
}
