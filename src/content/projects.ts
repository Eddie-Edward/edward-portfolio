import type { Project } from "./schema";

/**
 * All projects, in display order. This file drives the constellation, the
 * project cards, and the case-study pages.
 *
 * JARVIS: to add a project, append an object that satisfies `projectSchema`
 * (src/content/schema.ts), pick an unused constellation slot, and run
 * `pnpm content:check`. See docs/jarvis-update-guide.md for a worked example.
 *
 * Honesty rules:
 * - `source: "resume"` — verified against Edward's resume.
 * - `source: "local"`  — verified against a repo on Edward's machine.
 * - `source: "todo"`   — placeholder; the UI shows these conservatively and
 *   the `todo` field says what Edward still needs to confirm.
 */
export const projects: Project[] = [
  // ── Center: the orchestrator ─────────────────────────────────────────────
  {
    slug: "jarvis-os",
    name: "JARVIS OS",
    tagline: "A personal AI operating system",
    category: "ai-systems",
    status: "active",
    featured: true,
    source: "local",
    period: "2026 — Present",
    role: "Creator & Developer",
    summary:
      "A desktop AI system that acts as Edward's personal operating layer — orchestrating agents, projects, and tools from one place. JARVIS is being built to maintain the rest of Edward's software, including this site, which exposes a structured content contract JARVIS can update safely.",
    highlights: [
      "Desktop application under active development in a private repository.",
      "Designed to orchestrate Edward's other systems — this portfolio ships a JARVIS compatibility layer (structured content, read-only API, machine-readable manifest).",
    ],
    stack: ["TypeScript", "Electron", "AI agents", "Claude API"],
    links: [],
    connections: ["edward-portfolio", "careeros", "contentos", "rlarena"],
    constellation: { orbit: 0, angle: 0, size: "lg" },
    caseStudy: {
      problem:
        "Personal software sprawls: projects, notes, automations, and agents end up scattered across tools that don't talk to each other. Edward wanted one operating layer — a system that knows about his projects and can act on them.",
      built: [
        "A desktop AI application (private repo) that serves as the command center for Edward's projects and agents.",
        "A compatibility contract with this portfolio: structured content files, Zod validation, a read-only API, and a site manifest JARVIS can read to plan updates.",
      ],
      engineering: [
        "Agent orchestration around the Claude API.",
        "Update safety by design: JARVIS edits typed content files and runs schema validation — it never scrapes or rewrites rendered HTML.",
      ],
      outcome:
        "In active development. This site is the first external system built JARVIS-compatible from day one.",
      future:
        "Bind this repo through JARVIS Trusted Projects so JARVIS can draft, validate, and propose portfolio updates automatically.",
    },
    todo: "TODO(Edward): confirm the public one-line description of JARVIS and add a link if/when any part becomes public.",
  },

  // ── Orbit 1: shipped, resume-verified platforms ──────────────────────────
  {
    slug: "rlarena",
    name: "RLArena",
    tagline: "Full-stack reinforcement learning platform",
    category: "platform",
    status: "shipped",
    featured: true,
    source: "resume",
    period: "Jun 2026",
    role: "Creator & Developer",
    summary:
      "A full-stack RL platform for training, replaying, comparing, and ranking Snake agents in real time — DQN and Double DQN implementations with live WebSocket telemetry streamed into charts, replays, and leaderboards.",
    highlights: [
      "DQN and Double DQN with replay buffers, target networks, epsilon-greedy exploration, and seeded evaluation.",
      "Live WebSocket telemetry for rewards, losses, epsilon, evaluation scores, and game frames.",
      "Model cards, benchmark reports, and per-run metric tracking.",
    ],
    stack: [
      "React",
      "TypeScript",
      "FastAPI",
      "PostgreSQL",
      "Redis/RQ",
      "WebSockets",
      "Docker",
      "PyTorch",
    ],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Eddie-Edward/rlarena-public",
        kind: "github",
      },
    ],
    connections: ["prsense", "interviewcopilot"],
    constellation: { orbit: 1, angle: 20, size: "lg" },
    caseStudy: {
      problem:
        "RL experiments are usually invisible while they run — you launch a training job, wait, and inspect artifacts afterward. Edward wanted training you can watch: live metrics, live frames, and honest comparisons between runs.",
      built: [
        "A training service implementing DQN and Double DQN with replay buffers, target networks, and epsilon-greedy exploration.",
        "Live WebSocket telemetry: rewards, losses, epsilon, evaluation scores, and game frames streamed to the browser in real time.",
        "Replay visualization, run comparison, leaderboard rankings, model cards, and reproducible benchmark reports with seeded evaluation.",
      ],
      engineering: [
        "Queue-backed training jobs (Redis/RQ) so long-running PyTorch work never blocks the API.",
        "Seeded evaluation and per-run metric tracking for honest, reproducible comparisons.",
        "Dockerized services across frontend, API, workers, and database.",
      ],
      outcome:
        "Shipped and public on GitHub. Trains, replays, compares, and ranks Snake agents in real time.",
      future:
        "More environments and algorithms, and richer benchmark suites against stronger baselines.",
    },
  },
  {
    slug: "prsense",
    name: "PRSense",
    tagline: "Repo-aware AI code review",
    category: "devtool",
    status: "shipped",
    featured: true,
    source: "resume",
    period: "Jun 2026",
    role: "Creator & Developer",
    summary:
      "An AI code-review platform that analyzes unified Git diffs with repo context and surfaces explainable findings — severity classification, accept/dismiss tracking, and precision analytics, all through a safe local-first workflow.",
    highlights: [
      "Repo-context retrieval so findings understand the codebase, not just the diff.",
      "Severity classification, accept/dismiss tracking, precision analytics, and Markdown export.",
      "Validated on a real GitHub-style diff from RLArena — surfaced security, maintainability, and testing issues.",
    ],
    stack: [
      "React",
      "TypeScript",
      "FastAPI",
      "PostgreSQL",
      "Redis/RQ",
      "Docker",
    ],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Eddie-Edward/prsense-public",
        kind: "github",
      },
    ],
    connections: ["rlarena"],
    constellation: { orbit: 1, angle: 140, size: "lg" },
    caseStudy: {
      problem:
        "AI code review tools often hallucinate confident nonsense because they only see the diff. Edward built a reviewer that retrieves repo context first and explains every finding it makes.",
      built: [
        "A full-stack review platform that ingests unified Git diffs and analyzes them with local review providers.",
        "Repo-context retrieval, severity classification, and explainable findings with accept/dismiss tracking.",
        "Precision analytics and Markdown export with dashboard visualizations.",
      ],
      engineering: [
        "Local-first review pipeline — code never has to leave the machine to get reviewed.",
        "Queue-backed analysis jobs (Redis/RQ) with PostgreSQL-tracked review state.",
        "Feedback loop: accept/dismiss decisions feed precision analytics per finding category.",
      ],
      outcome:
        "Shipped and public on GitHub. Validated on a real diff from RLArena, surfacing security, maintainability, and testing issues.",
      future:
        "Broader provider support and tighter integration into PR workflows.",
    },
  },
  {
    slug: "interviewcopilot",
    name: "InterviewCopilot",
    tagline: "Claude-powered interview training",
    category: "platform",
    status: "shipped",
    featured: true,
    source: "resume",
    period: "Jun 2026",
    role: "Creator & Developer",
    summary:
      "A full-stack AI interview platform that simulates SWE, AI/ML, data-science, and behavioral interviews — adaptive follow-ups, knowledge-gap tracking, and structured feedback reports paired with study plans.",
    highlights: [
      "Provider-pluggable LLM services with local fallback.",
      "Adaptive follow-ups, knowledge-gap tracking, and structured feedback with study plans.",
      "72 passing tests across Dockerized services.",
    ],
    stack: [
      "React",
      "TypeScript",
      "FastAPI",
      "PostgreSQL",
      "Redis/RQ",
      "WebSockets",
      "Docker",
      "Claude API",
    ],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Eddie-Edward/interviewcopilot",
        kind: "github",
      },
    ],
    connections: ["rlarena", "careeros"],
    constellation: { orbit: 1, angle: 260, size: "lg" },
    caseStudy: {
      problem:
        "Interview prep tools are mostly static question banks. Real interviews adapt to your answers. Edward built an interviewer that does the same — and tells you exactly where your knowledge gaps are.",
      built: [
        "A full-stack platform simulating SWE, AI/ML, data-science, and behavioral interviews over WebSockets.",
        "Provider-pluggable LLM services around the Claude API, with a local fallback provider.",
        "Adaptive follow-up questioning, knowledge-gap tracking, and structured feedback reports paired with study plans.",
      ],
      engineering: [
        "Pydantic JSON validation on every LLM response — malformed model output never reaches the UI.",
        "Retry handling and environment-based secret management.",
        "72 passing tests across Dockerized services.",
      ],
      outcome: "Shipped and public on GitHub.",
      future:
        "Feed interview performance into CareerOS so prep, applications, and feedback share one loop.",
    },
  },

  // ── Orbit 2: systems in progress ─────────────────────────────────────────
  {
    slug: "careeros",
    name: "CareerOS",
    tagline: "Job-search automation system",
    category: "automation",
    status: "in-progress",
    featured: false,
    source: "todo",
    period: "2026",
    role: "Creator & Developer",
    summary:
      "An automation layer for the job search — tracking postings, tailoring materials, and connecting interview prep into one pipeline. Early build.",
    highlights: [],
    stack: ["TypeScript", "AI agents"],
    links: [],
    connections: ["interviewcopilot", "jarvis-os"],
    constellation: { orbit: 2, angle: 60, size: "md" },
    todo: "TODO(Edward): confirm CareerOS scope, status, and stack — details here are intentionally minimal until then.",
  },
  {
    slug: "contentos",
    name: "contentOS",
    tagline: "Multi-agent content pipeline",
    category: "automation",
    status: "in-progress",
    featured: false,
    source: "local",
    period: "2025 — Present",
    role: "Creator & Developer",
    summary:
      "A multi-agent content system: strategist, brief-writer, compliance and QA reviewer agents coordinated by an orchestrator, with a Prisma-backed data layer and a worker queue. In development in a local monorepo.",
    highlights: [
      "Agent roles (niche strategist, brief writer, compliance reviewer, QA reviewer, growth analyst, memory writer) coordinated by an orchestrator.",
      "TypeScript monorepo with a Next.js app, Prisma/PostgreSQL data layer, and queue-backed workers.",
    ],
    stack: ["TypeScript", "Next.js", "Prisma", "PostgreSQL", "AI agents"],
    links: [],
    connections: ["framezero", "agent-ops-daily", "jarvis-os"],
    constellation: { orbit: 2, angle: 130, size: "md" },
    todo: "TODO(Edward): confirm public description and add a link if the repo becomes public.",
  },
  {
    slug: "framezero",
    name: "FrameZero",
    tagline: "Content automation project",
    category: "automation",
    status: "in-progress",
    featured: false,
    source: "todo",
    period: "2026",
    role: "Creator & Developer",
    summary:
      "A content automation project in Edward's agent-systems family. Details coming soon.",
    highlights: [],
    stack: ["TypeScript", "AI agents"],
    links: [],
    connections: ["contentos"],
    constellation: { orbit: 2, angle: 200, size: "sm" },
    todo: "TODO(Edward): describe FrameZero (scope, status, stack) — placeholder entry.",
  },
  {
    slug: "agent-ops-daily",
    name: "Agent Ops Daily",
    tagline: "Agent-operations publication project",
    category: "automation",
    status: "in-progress",
    featured: false,
    source: "todo",
    period: "2026",
    role: "Creator & Developer",
    summary:
      "A recurring publication/automation project about operating AI agents in practice. Details coming soon.",
    highlights: [],
    stack: ["AI agents"],
    links: [],
    connections: ["contentos"],
    constellation: { orbit: 2, angle: 270, size: "sm" },
    todo: "TODO(Edward): describe Agent Ops Daily (format, cadence, status) — placeholder entry.",
  },
  {
    slug: "trading-research",
    name: "Trading Research",
    tagline: "Private market-research stack",
    category: "research",
    status: "research",
    featured: false,
    source: "todo",
    period: "2026",
    role: "Researcher",
    summary:
      "A private research system for market data and strategy experiments — built with the same telemetry-first mindset as RLArena. Not public.",
    highlights: [],
    stack: ["Python", "pandas"],
    links: [],
    connections: ["rlarena"],
    constellation: { orbit: 2, angle: 335, size: "sm" },
    todo: "TODO(Edward): confirm what, if anything, should be said publicly about this system.",
  },

  // ── Orbit 3: earlier verified work + this site ───────────────────────────
  {
    slug: "frc-vision",
    name: "FRC Vision Systems",
    tagline: "AprilTag localization & autonomous scoring",
    category: "robotics",
    status: "shipped",
    featured: false,
    source: "resume",
    period: "Dec 2023 — Jun 2025",
    role: "Lead Programmer",
    summary:
      "Two seasons of competition robotics vision: a real-time AprilTag pose estimator that improved autonomous navigation accuracy by ~40%, then an autonomous scoring system that cut auto-scoring error by ~27% across 50+ trial runs — while leading and mentoring 14 junior programmers.",
    highlights: [
      "Real-time AprilTag pose estimation integrated into the robot control loop (2024 season).",
      "Autonomous scoring with localization and adaptive strategy (2025 season).",
      "Led 14 junior programmers through OOP, Git workflows, debugging, and weekly code reviews.",
    ],
    stack: ["Java", "OpenCV", "WPILib", "PhotonLib", "Computer Vision"],
    links: [
      {
        label: "2025 Robot Code",
        href: "https://github.com/CrevolutionRoboticsProgramming/2025RobotCode",
        kind: "github",
      },
      {
        label: "2024 Robot Code",
        href: "https://github.com/CrevolutionRoboticsProgramming/2024RobotCode",
        kind: "github",
      },
    ],
    connections: [],
    constellation: { orbit: 3, angle: 100, size: "md" },
  },
  {
    slug: "edward-portfolio",
    name: "This Site",
    tagline: "JARVIS-compatible cinematic portfolio",
    category: "site",
    status: "shipped",
    featured: false,
    source: "site",
    period: "Jul 2026",
    role: "Creator & Developer",
    summary:
      "The site you're looking at: Next.js App Router, a Zod-validated content layer, read-only JSON APIs, and a Motion + GSAP animation system — designed so JARVIS can update it by editing structured content files.",
    highlights: [
      "Every fact on this site lives in typed content files with schema validation.",
      "Read-only API exposes projects, timeline, skills, and a JARVIS portfolio context.",
      "Motion handles component/interaction animation; GSAP drives cinematic scroll sequences.",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Motion", "GSAP", "Zod"],
    links: [],
    connections: ["jarvis-os"],
    constellation: { orbit: 3, angle: 250, size: "sm" },
  },
];
