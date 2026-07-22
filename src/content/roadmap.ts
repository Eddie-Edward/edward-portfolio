import type { RoadmapItem } from "./schema";

/**
 * Where Edward's work is heading. These are directions, not claims of
 * completed work — the UI labels them accordingly.
 * JARVIS: move items between horizons as work progresses.
 */
export const roadmap: RoadmapItem[] = [
  {
    id: "jarvis-deepening",
    title: "JARVIS as a real operating layer",
    description:
      "Grow JARVIS from a personal AI desktop into the orchestration layer for every project — including keeping this site's content current automatically.",
    horizon: "now",
    source: "local",
  },
  {
    id: "portfolio-autopilot",
    title: "Self-updating portfolio",
    description:
      "JARVIS reads this repo's content contract, drafts content updates as structured edits, validates them, and opens changes for review — no hand-edited HTML ever.",
    horizon: "now",
    source: "site",
  },
  {
    id: "career-automation",
    title: "Resume & job-search automation",
    description:
      "CareerOS: turn applications into a pipeline — tailored resumes, tracked postings, and interview prep that feeds back into InterviewCopilot.",
    horizon: "next",
    source: "todo",
  },
  {
    id: "trading-research",
    title: "Trading research system",
    description:
      "A private research stack for market data, signals, and backtesting — built with the same telemetry-first approach as RLArena.",
    horizon: "next",
    source: "todo",
  },
  {
    id: "content-systems",
    title: "Content operations system",
    description:
      "Continue contentOS as the shared system for research, planning, review, scheduling, and measurement. FrameZero and Agent Ops Daily remain experiments within that system.",
    horizon: "later",
    source: "todo",
  },
];
