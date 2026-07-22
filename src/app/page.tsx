import { Footer } from "@/components/Footer";
import { Hero } from "@/components/hero/Hero";
import { SiteNav } from "@/components/nav/SiteNav";
import { ProjectConstellation } from "@/components/sections/ProjectConstellation";
import { Timeline } from "@/components/sections/Timeline";
import { WorkBrowser } from "@/components/sections/WorkBrowser";
import { Chip } from "@/components/ui/Badge";
import { GlowButton } from "@/components/ui/GlowButton";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { content } from "@/content";

const HORIZONS = [
  { id: "now", label: "Now" },
  { id: "next", label: "Next" },
  { id: "later", label: "Later" },
] as const;

export default function HomePage() {
  const { profile, skillGroups, achievements, coursework, roadmap, links, sections } = content;
  const email = links.find((l) => l.kind === "email");
  const github = links.find((l) => l.kind === "github");
  const linkedin = links.find((l) => l.kind === "linkedin");

  return (
    <>
      <SiteNav />
      <main id="main">
        <Hero />

        {/* ── About ─────────────────────────────────────────────────────── */}
        <Section id="about">
          <h2 className="sr-only">About Edward</h2>
          <div className="grid gap-10 md:grid-cols-[3fr_2fr] md:gap-16">
            <div className="space-y-5">
              {profile.bio.map((paragraph, i) => (
                <Reveal key={i} index={i}>
                  <p className="text-base leading-relaxed text-mist md:text-lg">{paragraph}</p>
                </Reveal>
              ))}
            </div>
            <Reveal index={1}>
              <div className="glass rounded-2xl p-7">
                <p className="font-mono text-xs tracking-[0.25em] text-accent uppercase">
                  Education
                </p>
                <h3 className="mt-3 font-display text-xl font-semibold">
                  {profile.education.school}
                </h3>
                <p className="mt-1 text-sm text-mist">{profile.education.degree}</p>
                <p className="mt-1 text-sm text-dim">
                  Minors: {profile.education.minors.join(" · ")}
                </p>
                <p className="mt-1 font-mono text-xs text-dim">
                  Expected {profile.education.expectedGraduation}
                </p>
                <p className="mt-5 mb-2 font-mono text-[10px] tracking-widest text-dim uppercase">
                  Selected coursework
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {coursework.map((course) => (
                    <Chip key={course.id}>{course.name}</Chip>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Section>

        {/* ── Selected work (featured systems first) ────────────────────── */}
        <Section id="work" wide>
          <SectionHeading
            kicker={sections.work.kicker}
            title={sections.work.title}
            lede={sections.work.lede}
          />
          <WorkBrowser />
        </Section>

        {/* ── Timeline + proof of work ──────────────────────────────────── */}
        <Section id="timeline">
          <SectionHeading
            kicker={sections.timeline.kicker}
            title={sections.timeline.title}
            lede={sections.timeline.lede}
          />
          <Timeline />

          <div className="mt-24">
            <Reveal>
              <h3 className="mb-8 font-mono text-xs font-normal tracking-[0.3em] text-accent uppercase">
                Proof of work
              </h3>
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement, i) => (
                <Reveal key={achievement.id} index={i % 3}>
                  <div className="glass h-full rounded-xl p-5">
                    <span className="font-mono text-xs text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-2 text-sm leading-relaxed text-ink">{achievement.text}</p>
                    {achievement.context ? (
                      <p className="mt-2 text-xs leading-relaxed text-dim">{achievement.context}</p>
                    ) : null}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Systems constellation (secondary systems map) ─────────────── */}
        <Section id="systems" wide className="relative">
          <div aria-hidden className="grid-backdrop absolute inset-0 -z-10 opacity-60" />
          <SectionHeading
            kicker={sections.systems.kicker}
            title={sections.systems.title}
            lede={sections.systems.lede}
          />
          <ProjectConstellation />
        </Section>

        {/* ── Skills / systems map ──────────────────────────────────────── */}
        <Section id="skills">
          <SectionHeading
            kicker={sections.skills.kicker}
            title={sections.skills.title}
            lede={sections.skills.lede}
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {skillGroups.map((group, i) => (
              <Reveal key={group.id} index={i % 3}>
                <div className="glass h-full rounded-2xl p-6">
                  <h3 className="font-display text-lg font-semibold">{group.label}</h3>
                  <p className="mt-1 text-xs text-dim">{group.blurb}</p>
                  <ul role="list" className="mt-4 flex flex-wrap gap-1.5">
                    {group.skills.map((skill) => (
                      <li key={skill.name}>
                        <Chip>
                          {skill.name}
                          {skill.note ? <span className="ml-1 text-dim">· {skill.note}</span> : null}
                        </Chip>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ── Roadmap ───────────────────────────────────────────────────── */}
        <Section id="roadmap">
          <SectionHeading
            kicker={sections.roadmap.kicker}
            title={sections.roadmap.title}
            lede={sections.roadmap.lede}
          />
          <div className="grid gap-5 md:grid-cols-3">
            {HORIZONS.map((horizon, col) => (
              <Reveal key={horizon.id} index={col}>
                <div className="h-full">
                  <h3 className="mb-4 font-mono text-xs font-normal tracking-[0.3em] text-accent uppercase">
                    {horizon.label}
                  </h3>
                  <div className="space-y-4">
                    {roadmap
                      .filter((item) => item.horizon === horizon.id)
                      .map((item) => (
                        <div key={item.id} className="glass rounded-xl p-5">
                          <h4 className="font-display text-base font-semibold">{item.title}</h4>
                          <p className="mt-2 text-sm leading-relaxed text-mist">
                            {item.description}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ── Contact ───────────────────────────────────────────────────── */}
        <Section id="contact" className="pb-32">
          <div className="relative overflow-hidden rounded-3xl">
            <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-nebula/20 via-transparent to-accent/15" />
            <div className="glass-strong relative rounded-3xl px-7 py-16 text-center md:px-16 md:py-20">
              <Reveal>
                <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
                  {sections.contact.kicker}
                </p>
              </Reveal>
              <Reveal index={1}>
                <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
                  {sections.contact.title}
                </h2>
              </Reveal>
              <Reveal index={2}>
                <p className="mx-auto mt-5 max-w-xl text-base text-mist">{sections.contact.lede}</p>
              </Reveal>
              <Reveal index={3}>
                <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                  {email ? <GlowButton href={email.href}>{profile.email}</GlowButton> : null}
                  {github ? (
                    <GlowButton href={github.href} variant="ghost" external>
                      GitHub ↗
                    </GlowButton>
                  ) : null}
                  {linkedin ? (
                    <GlowButton href={linkedin.href} variant="ghost" external>
                      LinkedIn ↗
                    </GlowButton>
                  ) : null}
                </div>
              </Reveal>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
