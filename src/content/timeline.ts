import type { TimelineEntry } from "./schema";

/**
 * Timeline entries, oldest → newest (the UI renders them in this order and
 * animates progression on scroll). `sortKey` keeps ordering honest.
 *
 * JARVIS: append new milestones at the end; run `pnpm content:check`.
 */
export const timeline: TimelineEntry[] = [
  {
    id: "frc-2024",
    period: "Dec 2023 — Jun 2024",
    sortKey: "2023-12",
    title: "Vision Localization System — FRC Lead Programmer",
    org: "Crevolution Robotics",
    location: "Sterling Heights, MI",
    kind: "project",
    summary:
      "Built a real-time robot position estimator using AprilTags and computer vision, improving autonomous navigation accuracy by ~40% in field testing.",
    details: [
      "Implemented the pose estimator inside the robot control loop for precise autonomous command execution under match conditions.",
    ],
    source: "resume",
  },
  {
    id: "ucs-support",
    period: "Jun 2024 — Aug 2025",
    sortKey: "2024-06",
    title: "Technology & Software Support Specialist",
    org: "Utica Community Schools",
    location: "Sterling Heights, MI",
    kind: "work",
    summary:
      "Resolved 15+ weekly support tickets across Google Workspace, classroom apps, laptops, iPads, printers, and staff systems.",
    details: [
      "Deployed, configured, and troubleshot 300+ endpoints.",
      "Authored 10+ quick-reference guides that reduced recurring setup and support time.",
    ],
    source: "resume",
  },
  {
    id: "frc-2025",
    period: "Dec 2024 — Jun 2025",
    sortKey: "2024-12",
    title: "Autonomous Vision System — FRC Lead Programmer",
    org: "Crevolution Robotics",
    location: "Sterling Heights, MI",
    kind: "project",
    summary:
      "Engineered an AprilTag-based autonomous scoring system, reducing auto-scoring error by ~27% across 50+ trial runs.",
    details: [
      "Integrated real-time alignment, targeting, and navigation into autonomous routines.",
      "Led and mentored 14 junior programmers through OOP, Git workflows, debugging, and weekly code reviews.",
    ],
    source: "resume",
  },
  {
    id: "umich-start",
    period: "Aug 2025",
    sortKey: "2025-08",
    title: "Started B.S.E. Computer Science at Michigan",
    org: "University of Michigan",
    location: "Ann Arbor, MI",
    kind: "education",
    summary:
      "Began engineering study — Computer Science with minors in Mathematics and Entrepreneurship. Expected graduation May 2029.",
    details: [
      "Coursework: Data Structures and Algorithms, Discrete Mathematics, Linear Algebra, Computers and Math for AI.",
    ],
    source: "resume",
  },
  {
    id: "ship-month",
    period: "Jun 2026",
    sortKey: "2026-06",
    title: "Shipped three full-stack AI platforms",
    kind: "milestone",
    summary:
      "Designed, built, and shipped RLArena, PRSense, and InterviewCopilot — RL training, AI code review, and AI interview prep — each a full-stack platform with React, FastAPI, PostgreSQL, Redis/RQ, and Docker.",
    details: [
      "RLArena: DQN/Double DQN training with live WebSocket telemetry, replays, and leaderboards.",
      "PRSense: repo-aware diff analysis with explainable, severity-classified findings.",
      "InterviewCopilot: adaptive AI interviews with knowledge-gap tracking and 72 passing backend tests.",
    ],
    source: "resume",
  },
  {
    id: "shift-digital",
    period: "Jun 2026 — Present",
    sortKey: "2026-06",
    title: "Software Intern",
    org: "Shift Digital",
    location: "Birmingham, MI",
    kind: "work",
    summary:
      "Validating dealer-website, inventory, lead-routing, and compliance workflows across 100+ retailer-facing records for automotive OEM digital-marketing programs.",
    details: [
      "Reproduced and triaged 20+ platform defects and translated support issues into implementation notes for engineering teams.",
      "Supported feature and data-quality releases by testing builds, verifying fixes, and confirming acceptance criteria.",
    ],
    source: "resume",
  },
  {
    id: "jarvis-era",
    period: "2026 — Present",
    sortKey: "2026-07",
    title: "Building JARVIS and the agent-systems family",
    kind: "milestone",
    summary:
      "Ongoing work on JARVIS OS — a personal AI operating system — alongside agent-driven systems for content, careers, and research.",
    details: [
      "This portfolio ships JARVIS-compatible from day one: structured content, schema validation, and a read-only API.",
    ],
    source: "local",
    todo: "TODO(Edward): expand as JARVIS milestones become concrete/public.",
  },
  {
    id: "portfolio-launch",
    period: "Jul 2026",
    sortKey: "2026-07",
    title: "Launched this portfolio",
    kind: "milestone",
    summary:
      "A cinematic, JARVIS-updatable home for Edward's systems — Next.js, Motion, GSAP, and a Zod-validated content contract.",
    details: [],
    source: "site",
  },
];
