import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Footer } from "@/components/Footer";
import { SiteNav } from "@/components/nav/SiteNav";
import { StatusBadge, Chip } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { caseStudyProjects, getProject } from "@/content";

/**
 * Case-study pages — statically generated from src/content/projects.ts for
 * every project that defines a `caseStudy`.
 */

export function generateStaticParams() {
  return caseStudyProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: `${project.tagline} — ${project.summary}`,
  };
}

function CaseSection({
  index,
  kicker,
  title,
  children,
}: {
  index: number;
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal index={index % 2}>
      <section className="glass rounded-2xl p-7 md:p-9">
        <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">{kicker}</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">{title}</h2>
        <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-mist">{children}</div>
      </section>
    </Reveal>
  );
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project?.caseStudy) notFound();
  const study = project.caseStudy;

  const siblings = caseStudyProjects;
  const currentIndex = siblings.findIndex((p) => p.slug === project.slug);
  const prev = siblings[(currentIndex - 1 + siblings.length) % siblings.length];
  const next = siblings[(currentIndex + 1) % siblings.length];

  return (
    <>
      <SiteNav />
      <main id="main" className="mx-auto max-w-4xl px-5 pt-32 pb-24 sm:px-8">
        <Reveal>
          <Link
            href="/#work"
            className="font-mono text-xs text-dim transition-colors hover:text-ink"
          >
            ← All systems
          </Link>
        </Reveal>

        <header className="mt-8 mb-12">
          <Reveal>
            <div className="flex flex-wrap items-center gap-4">
              <StatusBadge status={project.status} />
              <span className="font-mono text-xs text-dim">
                {project.period} · {project.role}
              </span>
            </div>
          </Reveal>
          <Reveal index={1}>
            <h1 className="text-gradient mt-4 font-display text-4xl font-bold tracking-tight sm:text-6xl">
              {project.name}
            </h1>
          </Reveal>
          <Reveal index={2}>
            <p className="mt-3 text-lg text-accent">{project.tagline}</p>
          </Reveal>
          <Reveal index={3}>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <Chip key={tech}>{tech}</Chip>
              ))}
            </div>
          </Reveal>
          {project.links.length > 0 ? (
            <Reveal index={4}>
              <div className="mt-6 flex flex-wrap gap-4">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-accent transition-colors hover:text-accent-bright"
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>
            </Reveal>
          ) : null}
          {project.todo ? (
            <Reveal index={5}>
              <p className="mt-6 rounded-lg border border-line bg-surface/40 px-4 py-3 font-mono text-xs text-dim">
                ◌ Preview case study — some details are still being confirmed and may change.
              </p>
            </Reveal>
          ) : null}
        </header>

        <div className="space-y-6">
          <CaseSection index={0} kicker="01 · Problem" title="Why this exists">
            <p>{study.problem}</p>
          </CaseSection>

          <CaseSection index={1} kicker="02 · Build" title="What Edward built">
            <ul role="list" className="space-y-2.5">
              {study.built.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 text-accent" aria-hidden>
                    ◆
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CaseSection>

          <CaseSection index={2} kicker="03 · Depth" title="Engineering decisions">
            <ul role="list" className="space-y-2.5">
              {study.engineering.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 text-nebula-bright" aria-hidden>
                    ◆
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CaseSection>

          <CaseSection index={3} kicker="04 · Outcome" title="Where it stands">
            <p>{study.outcome}</p>
          </CaseSection>

          <CaseSection index={4} kicker="05 · Next" title="Future direction">
            <p>{study.future}</p>
          </CaseSection>
        </div>

        <nav className="mt-14 flex items-center justify-between gap-4" aria-label="Case studies">
          <Link
            href={`/projects/${prev.slug}`}
            className="glass rounded-xl px-5 py-3 text-sm text-mist transition-colors hover:text-ink"
          >
            ← {prev.name}
          </Link>
          <Link
            href={`/projects/${next.slug}`}
            className="glass rounded-xl px-5 py-3 text-right text-sm text-mist transition-colors hover:text-ink"
          >
            {next.name} →
          </Link>
        </nav>
      </main>
      <Footer />
    </>
  );
}
