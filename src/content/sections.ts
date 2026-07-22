import type { Sections } from "./schema";

/**
 * Homepage section copy — headings and ledes as structured content, so
 * editorial changes flow through the content layer like every other fact.
 *
 * JARVIS: edit strings here, bump `contentVersion`, run `pnpm content:check`.
 * Keep the tone direct and evidence-led; no marketing adjectives.
 */
export const sections: Sections = {
  work: {
    kicker: "Selected work",
    title: "Selected work, with current status.",
    lede: "Each entry separates working software, active development, and planned work. Filter by lens; preview labels remain visible where evidence is incomplete. Nothing here is inflated.",
  },
  timeline: {
    kicker: "Trajectory",
    title: "From robot vision to systems engineering.",
    lede: "Competition robotics established the systems foundation; recent work extends it into full-stack platforms, developer tools, and personal automation.",
  },
  systems: {
    kicker: "The constellation",
    title: "Systems connected by shared engineering.",
    lede: "The projects share an engineering practice: explicit contracts, automated checks, and visible evidence. JARVIS is the control layer; each domain system keeps ownership of its own data and workflows.",
  },
  skills: {
    kicker: "Systems map",
    title: "Tools grouped by the work they support.",
    lede: "Languages, frameworks, and infrastructure shown in the context where they were used.",
  },
  roadmap: {
    kicker: "Roadmap",
    title: "What I am building next.",
    lede: "Directions, not claims. Items move only when the underlying work changes.",
  },
  contact: {
    kicker: "Contact",
    title: "Open to software and AI engineering internships.",
    lede: "I'm interested in roles where I can build reliable software, evaluate model-backed systems, and work closely with users and engineering teams.",
  },
};
