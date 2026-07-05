"use client";

import { motion } from "motion/react";
import { useRef } from "react";

import { content } from "@/content";
import type { TimelineEntry } from "@/content/schema";
import { gsap, NO_MOTION_PREFERENCE, useGSAP } from "@/lib/gsap";
import { DUR, EASE_OUT, VIEWPORT_ONCE } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

/**
 * Scroll-progressive timeline. The gradient line fills as you scroll
 * (GSAP ScrollTrigger scrub); entries reveal with Motion. With reduced
 * motion the line renders complete and entries simply fade.
 */

const KIND_STYLES: Record<TimelineEntry["kind"], { label: string; className: string }> = {
  education: { label: "Education", className: "text-nebula-bright" },
  work: { label: "Work", className: "text-signal" },
  project: { label: "Project", className: "text-accent" },
  milestone: { label: "Milestone", className: "text-ink" },
};

export function Timeline() {
  const scopeRef = useRef<HTMLDivElement>(null);
  const entries = content.timeline;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_MOTION_PREFERENCE, () => {
        gsap.fromTo(
          "[data-timeline-fill]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: scopeRef.current,
              start: "top 70%",
              end: "bottom 60%",
              scrub: 0.6,
            },
          },
        );
      });
    },
    { scope: scopeRef },
  );

  return (
    <div ref={scopeRef} className="relative">
      {/* Track + animated fill */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-[11px] w-px bg-line md:left-1/2 md:-translate-x-1/2"
      />
      <div
        data-timeline-fill
        aria-hidden
        className="absolute inset-y-0 left-[11px] w-px origin-top bg-gradient-to-b from-accent via-nebula to-accent md:left-1/2 md:-translate-x-1/2"
      />

      {/* role="list" restores list semantics under Tailwind preflight's
          list-style:none (WebKit/VoiceOver drops them otherwise). */}
      <ol role="list" className="flex flex-col gap-10">
        {entries.map((entry, i) => {
          const kind = KIND_STYLES[entry.kind];
          const rightSide = i % 2 === 1;
          return (
            <li key={entry.id} className="relative">
              <span
                aria-hidden
                className={cn(
                  "node-pulse absolute top-2 left-[7px] size-2.5 rounded-full md:left-1/2 md:-translate-x-1/2",
                  entry.kind === "work" ? "bg-signal" : entry.kind === "education" ? "bg-nebula-bright" : "bg-accent",
                )}
              />
              <motion.div
                data-reveal
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: DUR.base, ease: EASE_OUT }}
                className={cn(
                  "glass ml-10 rounded-xl p-5 md:ml-0 md:w-[calc(50%-2.5rem)]",
                  rightSide && "md:ml-[calc(50%+2.5rem)]",
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs text-accent">{entry.period}</span>
                  <span className={cn("font-mono text-[10px] tracking-widest uppercase", kind.className)}>
                    {kind.label}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold">{entry.title}</h3>
                {entry.org ? (
                  <p className="mt-0.5 text-xs text-dim">
                    {entry.org}
                    {entry.location ? ` · ${entry.location}` : ""}
                  </p>
                ) : null}
                <p className="mt-3 text-sm leading-relaxed text-mist">{entry.summary}</p>
                {entry.details.length > 0 ? (
                  <ul role="list" className="mt-3 space-y-1.5">
                    {entry.details.map((d) => (
                      <li key={d} className="flex gap-2 text-[13px] leading-relaxed text-mist">
                        <span className="mt-1 text-accent" aria-hidden>
                          ◆
                        </span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </motion.div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
