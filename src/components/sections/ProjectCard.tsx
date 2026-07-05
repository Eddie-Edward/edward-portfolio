"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { StatusBadge, Chip } from "@/components/ui/Badge";
import type { Project } from "@/content/schema";
import { SPRING_SOFT } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

/**
 * Canonical project card: hover lift physics + gradient hairline for
 * featured work. Every fact comes from src/content/projects.ts.
 *
 * Scroll reveal, filter enter/exit, and layout glide are owned by the
 * parent (WorkBrowser) — hover physics must live on its own element so
 * gesture-end never replays a delayed reveal transition.
 */
export function ProjectCard({ project }: { project: Project }) {
  const showTodoNote = project.source === "todo";
  return (
    <motion.article
      id={`project-${project.slug}`}
      whileHover={{ y: -6 }}
      transition={SPRING_SOFT}
      className={cn(
        "glass relative flex h-full scroll-mt-28 flex-col gap-4 overflow-hidden rounded-2xl p-6 transition-colors hover:border-accent/40",
        project.featured && "border-t-2 border-t-accent/60",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <StatusBadge status={project.status} />
        <span className="font-mono text-[11px] text-dim">{project.period}</span>
      </div>

      <div>
        <h3 className="font-display text-xl font-semibold">{project.name}</h3>
        <p className="mt-0.5 text-sm text-accent">{project.tagline}</p>
      </div>

      <p className="text-sm leading-relaxed text-mist">{project.summary}</p>

      {project.highlights.length > 0 ? (
        <ul role="list" className="space-y-1.5">
          {project.highlights.slice(0, 3).map((h) => (
            <li key={h} className="flex gap-2 text-[13px] leading-relaxed text-mist">
              <span className="mt-1 text-accent" aria-hidden>
                ◆
              </span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex flex-wrap gap-1.5">
        {project.stack.slice(0, 6).map((tech) => (
          <Chip key={tech}>{tech}</Chip>
        ))}
        {project.stack.length > 6 ? <Chip>+{project.stack.length - 6}</Chip> : null}
      </div>

      {showTodoNote ? (
        <p className="font-mono text-[11px] text-dim">
          ◌ Preview entry — details pending confirmation.
        </p>
      ) : null}

      <div className="mt-auto flex flex-wrap items-center gap-4 pt-1">
        {project.caseStudy ? (
          <Link
            href={`/projects/${project.slug}`}
            className="font-display text-sm font-medium text-accent hover:text-accent-bright"
          >
            Case study →
          </Link>
        ) : null}
        {project.links.map((link) => (
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
  );
}
