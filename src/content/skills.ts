import type { SkillGroup } from "./schema";

/**
 * Skills grouped as a systems map. Source of truth: Edward's resume, plus
 * technologies self-evidently used in this repository (noted per-skill).
 *
 * JARVIS: add skills to the right group; create a new group only when a
 * genuinely new discipline appears.
 */
export const skillGroups: SkillGroup[] = [
  {
    id: "ai-systems",
    label: "AI Systems",
    blurb: "Turning models into products — agents, providers, feedback loops.",
    skills: [
      { name: "OpenAI Realtime", note: "live voice acceptance in JARVIS" },
      { name: "LLM provider design", note: "provider-pluggable services with local fallback" },
      { name: "Reinforcement learning", note: "DQN / Double DQN from scratch" },
      { name: "Agent orchestration", note: "JARVIS, contentOS" },
      { name: "AI code review systems", note: "PRSense" },
    ],
  },
  {
    id: "full-stack",
    label: "Full-Stack Engineering",
    blurb: "Typed frontends to queue-backed backends.",
    skills: [
      { name: "TypeScript" },
      { name: "React" },
      { name: "Next.js", note: "this site" },
      { name: "FastAPI" },
      { name: "Python" },
      { name: "SQLAlchemy" },
      { name: "Pydantic" },
      { name: "WebSockets", note: "live telemetry & interview streams" },
    ],
  },
  {
    id: "ml-data",
    label: "ML & Data",
    blurb: "Research tooling with honest metrics.",
    skills: [
      { name: "PyTorch" },
      { name: "scikit-learn" },
      { name: "NumPy" },
      { name: "pandas" },
      { name: "OpenCV", note: "real-time robot vision" },
      { name: "SQL" },
      { name: "MATLAB" },
    ],
  },
  {
    id: "systems",
    label: "Systems & Coursework",
    blurb: "Fundamentals under the applications.",
    skills: [
      { name: "C++" },
      { name: "Java", note: "FRC robot code" },
      { name: "Data structures & algorithms" },
      { name: "Discrete mathematics" },
      { name: "Linear algebra" },
    ],
  },
  {
    id: "infra",
    label: "Infra & DevTools",
    blurb: "Containers, persistence, migrations, and local verification across the full-stack projects.",
    skills: [
      { name: "Docker" },
      { name: "PostgreSQL" },
      { name: "Redis / RQ" },
      { name: "Alembic" },
      { name: "Git / GitHub" },
      { name: "CI/CD" },
      { name: "Linux" },
      { name: "PowerShell" },
    ],
  },
  {
    id: "product-ui",
    label: "Product & UI",
    blurb: "Interfaces that explain systems — dashboards, replays, motion.",
    skills: [
      { name: "Tailwind CSS", note: "this site" },
      { name: "Motion", note: "this site" },
      { name: "GSAP", note: "this site" },
      { name: "Telemetry dashboards", note: "RLArena, PRSense" },
      { name: "Design systems", note: "this site" },
    ],
  },
];
