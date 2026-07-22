import type { Profile } from "./schema";

/**
 * Edward's profile. Source of truth: Edward's resume (2026).
 *
 * JARVIS: edit fields freely, but keep claims verifiable. Never add a phone
 * number or street address here — this file is published verbatim.
 */
export const profile: Profile = {
  name: "Edward Lei",
  shortName: "Edward",
  headline: "AI Systems Builder",
  subheadline:
    "Computer Science Engineering student at the University of Michigan",
  mission:
    "I build AI systems end to end — agents, platforms, and developer tools that turn models into working products.",
  currentStatus: "Software Intern @ Shift Digital · Building JARVIS OS",
  location: "Ann Arbor, MI",
  email: "eddiel@umich.edu",
  bio: [
    "I'm Edward — a computer science engineering student at the University of Michigan (B.S.E. Computer Science, minors in Mathematics and Entrepreneurship, class of 2028) who builds software and AI systems end to end.",
    "In June 2026 I built three full-stack platforms: a reinforcement-learning training arena, a repo-aware code-review tool, and a provider-pluggable interview-preparation system. Each uses a React/TypeScript frontend, a FastAPI backend, PostgreSQL/Redis infrastructure, and Docker.",
    "Right now I'm a software intern at Shift Digital, and I'm building JARVIS — a personal AI operating system for orchestrating my projects. This site is built for it: every fact lives in a structured content layer designed for JARVIS to update.",
  ],
  education: {
    school: "University of Michigan",
    degree: "B.S.E. Computer Science",
    minors: ["Mathematics", "Entrepreneurship"],
    location: "Ann Arbor, MI",
    expectedGraduation: "May 2028",
  },
};
