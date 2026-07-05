"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useRef, useState } from "react";

import { StatusBadge, Chip } from "@/components/ui/Badge";
import { content } from "@/content";
import type { Project } from "@/content/schema";
import { gsap, NO_MOTION_PREFERENCE, ScrollTrigger, useGSAP } from "@/lib/gsap";
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
  const mapRef = useRef<HTMLDivElement>(null);
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
    const pairs: Array<{
      from: { x: number; y: number };
      to: { x: number; y: number };
      fromSlug: string;
      toSlug: string;
      key: string;
    }> = [];
    for (const p of projects) {
      for (const other of p.connections) {
        const key = [p.slug, other].sort().join("|");
        if (seen.has(key)) continue;
        seen.add(key);
        const from = positions.get(p.slug);
        const to = positions.get(other);
        if (from && to) pairs.push({ from, to, fromSlug: p.slug, toSlug: other, key });
      }
    }
    return pairs;
  }, [projects, positions]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // The map is display:none below lg (64rem) — none of its animation
      // work may exist there, so the media gate covers width too and
      // matchMedia rebuilds/reverts everything across the breakpoint.
      mm.add(`${NO_MOTION_PREFERENCE} and (min-width: 64rem)`, () => {
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

        // ── Ambient orb drift ────────────────────────────────────────────
        // Lissajous-style elliptical wander: x and y run as separate sine
        // tweens with different durations, so each node traces a slow,
        // curving path around its anchor — alive, but never a full orbit.
        // Targets have a guaranteed minimum magnitude (a plain random range
        // straddling zero often lands near 0 and reads as static). The
        // whole [data-drift] group moves — dot, button, AND label — so the
        // node reads as one visual unit and the hit target tracks it.
        const signedRandom = (min: number, max: number) => () =>
          gsap.utils.random(min, max) * (gsap.utils.random(0, 1) > 0.5 ? 1 : -1);

        const driftEls = gsap.utils.toArray<HTMLElement>("[data-drift]");
        const drifts = driftEls.map((el, i) => [
          gsap.to(el, {
            x: signedRandom(9, 15),
            duration: () => gsap.utils.random(6, 9),
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            repeatRefresh: true,
            delay: (i % 5) * 0.6,
            paused: true,
          }),
          gsap.to(el, {
            y: signedRandom(6, 11),
            duration: () => gsap.utils.random(7.5, 10),
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            repeatRefresh: true,
            delay: (i % 3) * 0.8,
            paused: true,
          }),
        ]);
        const pauseNode = (i: number) => drifts[i].forEach((t) => t.pause());
        const playNode = (i: number) => drifts[i].forEach((t) => t.play());

        // ── Living edges ─────────────────────────────────────────────────
        // Connection lines track their endpoints' live drift offsets. A
        // single GSAP ticker callback (active only while the section is on
        // screen) reads each node's current x/y straight from GSAP's cache
        // (gsap.getProperty — no layout reads) and rewrites line endpoints
        // as anchor + offset, converted from px to viewBox units. A frozen
        // (hovered/focused) node's offsets stop changing, so its edges hold
        // perfectly still with it — no snapping, no special cases.
        const driftBySlug = new Map(driftEls.map((el) => [el.dataset.drift, el]));
        const lineEls = gsap.utils.toArray<SVGLineElement>("[data-conn-line]");
        const bindings = lineEls.map((line) => ({
          line,
          from: driftBySlug.get(line.dataset.from) ?? null,
          to: driftBySlug.get(line.dataset.to) ?? null,
          fx: Number(line.dataset.fx),
          fy: Number(line.dataset.fy),
          tx: Number(line.dataset.tx),
          ty: Number(line.dataset.ty),
        }));

        // px → viewBox units (viewBox is 0-100 over a square container).
        let unitScale = 100 / (mapRef.current?.clientWidth || 760);
        const resizeObserver = new ResizeObserver(() => {
          unitScale = 100 / (mapRef.current?.clientWidth || 760);
        });
        if (mapRef.current) resizeObserver.observe(mapRef.current);

        const updateLines = () => {
          for (let i = 0; i < bindings.length; i++) {
            const b = bindings[i];
            if (b.from) {
              b.line.setAttribute(
                "x1",
                String(b.fx + Number(gsap.getProperty(b.from, "x")) * unitScale),
              );
              b.line.setAttribute(
                "y1",
                String(b.fy + Number(gsap.getProperty(b.from, "y")) * unitScale),
              );
            }
            if (b.to) {
              b.line.setAttribute(
                "x2",
                String(b.tx + Number(gsap.getProperty(b.to, "x")) * unitScale),
              );
              b.line.setAttribute(
                "y2",
                String(b.ty + Number(gsap.getProperty(b.to, "y")) * unitScale),
              );
            }
          }
        };

        // A node is frozen while ANY source holds it (pointer hover and
        // keyboard focus can overlap) — count holds instead of toggling,
        // so releasing one source never unfreezes the other's.
        const frozen = driftEls.map(() => 0);

        // Tick only while the constellation is on screen — and never
        // resume a node that is currently hovered/focused. The line ticker
        // follows the same visibility gate.
        const visibility = ScrollTrigger.create({
          trigger: scopeRef.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            driftEls.forEach((_, i) => {
              if (self.isActive && frozen[i] === 0) playNode(i);
              else pauseNode(i);
            });
            if (self.isActive) {
              // remove-first: same-callback re-adds must never double-tick.
              gsap.ticker.remove(updateLines);
              gsap.ticker.add(updateLines);
              updateLines();
            } else {
              gsap.ticker.remove(updateLines);
            }
          },
        });

        // Freeze a node the moment the pointer or keyboard focus reaches it
        // — the click/focus target must be perfectly stable. The label now
        // rides inside the drift group, so hovering it freezes the node too.
        const cleanups = driftEls.map((el, i) => {
          const freeze = () => {
            frozen[i] += 1;
            pauseNode(i);
          };
          const release = () => {
            frozen[i] = Math.max(0, frozen[i] - 1);
            if (frozen[i] === 0 && visibility.isActive) playNode(i);
          };
          el.addEventListener("pointerenter", freeze);
          el.addEventListener("pointerleave", release);
          el.addEventListener("focusin", freeze);
          el.addEventListener("focusout", release);
          return () => {
            el.removeEventListener("pointerenter", freeze);
            el.removeEventListener("pointerleave", release);
            el.removeEventListener("focusin", freeze);
            el.removeEventListener("focusout", release);
          };
        });

        return () => {
          cleanups.forEach((fn) => fn());
          gsap.ticker.remove(updateLines);
          resizeObserver.disconnect();
          // setAttribute writes are outside GSAP's revert — restore anchors
          // so a breakpoint/reduced-motion flip never strands drifted lines.
          for (const b of bindings) {
            b.line.setAttribute("x1", String(b.fx));
            b.line.setAttribute("y1", String(b.fy));
            b.line.setAttribute("x2", String(b.tx));
            b.line.setAttribute("y2", String(b.ty));
          }
        };
      });
    },
    { scope: scopeRef },
  );

  return (
    <div ref={scopeRef} className="grid items-start gap-8 xl:grid-cols-[3fr_2fr] xl:gap-12">
      {/* ── Map (lg and up) ─────────────────────────────────────────────── */}
      <div ref={mapRef} className="relative mx-auto hidden aspect-square w-full max-w-[760px] lg:block">
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
            /* data-* anchors + endpoint slugs let the GSAP ticker retarget
               each endpoint to its node's live drift offset (living graph). */
            <line
              key={c.key}
              data-conn-line
              data-from={c.fromSlug}
              data-to={c.toSlug}
              data-fx={c.from.x}
              data-fy={c.from.y}
              data-tx={c.to.x}
              data-ty={c.to.y}
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
              /* Three layers, each owning exactly one transform:
                 1. anchor div — static CSS translate centers the dot on the
                    ring point (never animated; Motion/GSAP would clobber it);
                 2. [data-drift] div — GSAP ambient wander (skipped for the
                    JARVIS core, which stays visually central); the label
                    lives INSIDE it so dot + label drift as one unit;
                 3. motion.button — pop-in variant + hover/press springs. */
              <div
                key={project.slug}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                <div data-drift={isCenter ? undefined : project.slug} className="relative">
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
                  </motion.button>
                  {/* Redundant click affordance riding the drift group: the
                      real control is the button (AT/keyboard use that); the
                      label forwards clicks and moves with its dot. */}
                  <span
                    aria-hidden
                    onClick={() => setSelectedSlug(project.slug)}
                    className={cn(
                      "absolute top-full left-1/2 mt-2 -translate-x-1/2 cursor-pointer font-mono text-[11px] whitespace-nowrap transition-colors",
                      isSelected ? "text-ink" : "text-dim",
                    )}
                  >
                    {project.name}
                  </span>
                </div>
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
                {selected.source === "todo"
                  ? "◌ Preview entry — details pending confirmation."
                  : "◌ Verified project — some public details are still being written."}
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
