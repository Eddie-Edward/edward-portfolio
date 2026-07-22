import type { Achievement } from "./schema";

/**
 * Verified achievements. Every entry cites its source — nothing here is
 * invented. JARVIS: only add entries Edward can back up.
 */
export const achievements: Achievement[] = [
  {
    id: "three-platforms",
    text: "Built three full-stack AI platforms in June 2026 — RLArena, PRSense, and InterviewCopilot.",
    context: "Each: React/TypeScript, FastAPI, PostgreSQL, Redis/RQ, Docker.",
    source: "resume",
  },
  {
    id: "interviewcopilot-tests",
    text: "Verified InterviewCopilot's backend with 32/32 passing tests at the last directly verified checkpoint.",
    context: "Pydantic JSON validation, retry handling, env-based secret management.",
    source: "resume",
  },
  {
    id: "frc-mentorship",
    text: "Led and mentored 14 junior programmers as FRC lead programmer.",
    context: "Object-oriented programming, Git workflows, debugging, weekly code reviews.",
    source: "resume",
  },
  {
    id: "frc-auto-scoring",
    text: "Reduced autonomous scoring error by ~27% across 50+ trial runs with an AprilTag-based vision system.",
    context: "FRC 2025 robot — localization and adaptive strategy.",
    source: "resume",
  },
  {
    id: "frc-navigation",
    text: "Improved autonomous navigation accuracy by ~40% with a real-time AprilTag pose estimator.",
    context: "FRC 2024 robot — computer vision in the control loop.",
    source: "resume",
  },
  {
    id: "ucs-endpoints",
    text: "Deployed, configured, and troubleshot 300+ endpoints across a school district.",
    context: "Utica Community Schools, 2024–2025.",
    source: "resume",
  },
];
