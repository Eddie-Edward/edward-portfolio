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
 *
 * Featured set (matches the current resume): JARVIS, LockIn,
 * InterviewCopilot, RLArena. Constellation slots on the same orbit keep
 * ≥25° separation (enforced by validateContentIntegrity).
 */
export const projects: Project[] = [
  // ── Center: the control plane ────────────────────────────────────────────
  {
    slug: "jarvis-os",
    name: "JARVIS OS",
    tagline: "Personal AI companion and engineering control plane",
    category: "ai-systems",
    status: "active",
    featured: true,
    source: "local",
    period: "2026 — Present",
    role: "Creator & Developer",
    summary:
      "A Windows-first desktop AI system that unifies conversation, voice, approved memory, action proposals, and engineering-session orchestration behind one local control plane. The project remains private and in active development.",
    highlights: [
      "5,800+ automated tests green across more than 180 logged development iterations at the last verified checkpoint.",
      "OpenAI Realtime streaming voice uses server-minted ephemeral credentials so permanent API keys do not reach the client.",
      "Press-to-interrupt, approval-gated local actions behind an Emergency Stop, and a mock two-project engineering-fleet pilot are implemented.",
    ],
    stack: ["TypeScript", "OpenAI Realtime", "AI agents", "packaged desktop runtime"],
    links: [],
    connections: ["edward-portfolio", "careeros", "contentos", "rlarena"],
    constellation: { orbit: 0, angle: 0, size: "lg" },
    caseStudy: {
      problem:
        "Edward's projects, assistants, and automation workflows were split across separate tools with no shared conversation, approval, or engineering-control layer.",
      built: [
        "A Windows-first desktop companion with unified text and voice conversations, approved memory, project status, and local action proposals.",
        "OpenAI Realtime streaming voice with server-minted ephemeral credentials; permanent API keys remain server-side.",
        "An approval-gated action path with Emergency Stop, press-to-interrupt, and a mock two-project engineering-fleet pilot.",
      ],
      engineering: [
        "5,800+ automated tests green across more than 180 logged development iterations at the last verified checkpoint.",
        "Typecheck, lint, security scan, build, desktop-build, and desktop-package gates were required before local merge.",
        "A live acceptance run measured approximately 557 ms to first audio.",
      ],
      outcome:
        "In active development. Unified conversation and the OpenAI Realtime foundation are working; wake word, acoustic barge-in, and trusted cross-device use remain incomplete.",
      future:
        "Complete physical audio acceptance and keep JARVIS focused on personal context, approvals, and orchestration while CareerOS and other systems retain their domain logic.",
    },
  },

  // ── Orbit 1: the four featured resume projects ───────────────────────────
  {
    slug: "lockin",
    name: "LockIn",
    tagline: "Native iOS behavior-enforcement system",
    category: "platform",
    status: "active",
    featured: true,
    source: "local",
    period: "Jul 2026 — Present",
    role: "Creator & Developer",
    summary:
      "A native iOS behavior-enforcement app for alarms and morning missions. Its portable Swift 6 domain core is working on Windows; Apple-framework integration and physical-device acceptance remain in progress.",
    highlights: [
      "Swift 6 strict-concurrency core with an actor-based mission state machine and idempotent completion under races.",
      "Deterministic DST-safe alarm scheduling and reconciliation.",
      "Versioned HMAC-SHA256 QR verification with constant-time comparison and key rotation; 128 passing tests across 17 suites.",
    ],
    stack: ["Swift 6", "SwiftPM", "Strict concurrency", "Actors", "HMAC-SHA256"],
    links: [],
    connections: ["jarvis-os"],
    constellation: { orbit: 1, angle: 20, size: "lg" },
    caseStudy: {
      problem:
        "Alarm apps can schedule notifications, but they do not reliably enforce a multi-step morning mission across time changes, duplicate events, and reconstruction.",
      built: [
        "A portable Swift package containing alarm planning, reconciliation, mission-state, QR-verification, and step-fallback domain logic.",
        "An actor-based mission coordinator with idempotent completion under duplicate, simultaneous, expiry, and reconstruction races.",
        "Versioned HMAC-SHA256 QR enrollment and verification with constant-time comparison and key rotation.",
      ],
      engineering: [
        "Strict Swift concurrency, protocol-driven adapters, an injected clock, and pure planners keep the domain testable on Windows and portable to iOS.",
        "Alarm reconciliation retains valid owned alarms, repairs missing alarms, cancels stale owned alarms, and cannot target foreign alarms.",
        "128 tests pass across 17 suites, with debug and release builds green at the last verified checkpoint.",
      ],
      outcome:
        "The portable M1A domain core works on Windows. Native SwiftUI, AlarmKit, Apple persistence, and physical-device acceptance are not complete.",
      future:
        "Complete M1B in Xcode on macOS while preserving the validated portable core and milestone order.",
    },
  },
  {
    slug: "interviewcopilot",
    name: "InterviewCopilot",
    tagline: "Provider-pluggable interview preparation",
    category: "platform",
    status: "shipped",
    featured: true,
    source: "resume",
    period: "Jun 2026",
    role: "Creator & Developer",
    summary:
      "A full-stack AI interview platform that simulates SWE, AI/ML, data-science, and behavioral interviews — adaptive follow-ups, knowledge-gap tracking, and structured feedback reports paired with study plans.",
    highlights: [
      "Provider-pluggable interview and evaluation services with deterministic local defaults and environment-gated external-provider stubs.",
      "Adaptive follow-ups, knowledge-gap tracking, and structured feedback with study plans.",
      "32/32 backend tests passed at the last directly verified checkpoint.",
    ],
    stack: [
      "React",
      "TypeScript",
      "FastAPI",
      "PostgreSQL",
      "Redis/RQ",
      "WebSockets",
      "Docker",
      "Provider interfaces",
    ],
    // Public repository link removed 2026-07-21: the previous GitHub URL
    // returned 404. Restore only with a working URL from Edward.
    links: [],
    connections: ["rlarena", "careeros"],
    constellation: { orbit: 1, angle: 110, size: "lg" },
    caseStudy: {
      problem:
        "Interview prep tools are mostly static question banks. Real interviews adapt to your answers. Edward built an interviewer that does the same — and tells you exactly where your knowledge gaps are.",
      built: [
        "A full-stack platform simulating SWE, AI/ML, data-science, and behavioral interviews over WebSockets.",
        "Provider-pluggable interview and evaluation services with deterministic local defaults and environment-gated external-provider stubs.",
        "Adaptive follow-up questioning, knowledge-gap tracking, and structured feedback reports paired with study plans.",
      ],
      engineering: [
        "Pydantic JSON validation on every LLM response — malformed model output never reaches the UI.",
        "Retry handling and environment-based secret management.",
        "32/32 backend tests passed at the last directly verified checkpoint.",
      ],
      outcome:
        "Working local MVP at the last verified checkpoint. Public repository link pending correction.",
      future:
        "Feed interview performance into CareerOS so prep, applications, and feedback share one loop.",
    },
  },
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
    constellation: { orbit: 1, angle: 200, size: "lg" },
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
        "Built and public on GitHub. Trains, replays, compares, and ranks Snake agents in real time.",
      future:
        "More environments and algorithms, and richer benchmark suites against stronger baselines.",
    },
  },

  // ── Orbit 2: shipped case studies + systems in progress ──────────────────
  {
    slug: "careeros",
    name: "CareerOS",
    tagline: "Application preparation and tracking system",
    category: "automation",
    status: "active",
    featured: false,
    // Verified 2026-07-21 against the local repo (C:\Users\edwar\Projects\
    // careerOS): provenance-first job records, human final-Submit boundary,
    // and the historical 422/422 checkpoint in docs/current-phase-15-plan.md.
    source: "local",
    period: "2026 — Present",
    role: "Creator & Developer",
    summary:
      "A provenance-first career workflow for capturing job postings, tailoring one-page application materials from approved facts, reviewing them for ATS, recruiter, and factual risk, and stopping at a final human Submit boundary.",
    highlights: [
      "Job records preserve source evidence, normalized requirements, and unresolved fields.",
      "Resume and cover-letter workflows are designed around an approved candidate-fact source rather than invented claims.",
      "Historical repository checkpoint: 422/422 tests passing; the current repository must be reverified before stronger public claims.",
    ],
    stack: ["TypeScript", "AI agents"],
    links: [],
    connections: ["interviewcopilot", "jarvis-os"],
    constellation: { orbit: 2, angle: 35, size: "md" },
    todo: "Current public copy is intentionally limited to verified architecture and the historical test checkpoint.",
  },
  {
    slug: "contentos",
    name: "contentOS",
    tagline: "Multi-agent content operations system",
    category: "automation",
    status: "active",
    featured: false,
    source: "local",
    period: "2025 — Present",
    role: "Creator & Developer",
    summary:
      "A TypeScript monorepo for planning, reviewing, and tracking content work through specialized agent roles, a shared orchestrator, Prisma/PostgreSQL persistence, and queue-backed workers.",
    highlights: [
      "Specialist roles cover strategy, briefs, compliance, QA, growth analysis, and memory.",
      "Next.js, Prisma/PostgreSQL, and worker packages are separated inside the monorepo.",
      "FrameZero and Agent Ops Daily remain operating experiments within contentOS rather than separate portfolio projects.",
    ],
    stack: ["TypeScript", "Next.js", "Prisma", "PostgreSQL", "AI agents"],
    links: [],
    connections: ["jarvis-os"],
    constellation: { orbit: 2, angle: 125, size: "md" },
    todo: "TODO(Edward): confirm public description and add a link if the repo becomes public.",
  },
  {
    slug: "prsense",
    name: "PRSense",
    tagline: "Repo-aware AI code review",
    category: "devtool",
    status: "shipped",
    featured: false,
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
    constellation: { orbit: 2, angle: 215, size: "md" },
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
        "Built and public on GitHub. Validated on a real diff from RLArena, surfacing security, maintainability, and testing issues.",
      future:
        "Broader provider support and tighter integration into PR workflows.",
    },
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
    constellation: { orbit: 2, angle: 305, size: "sm" },
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
    constellation: { orbit: 3, angle: 260, size: "sm" },
  },
];
