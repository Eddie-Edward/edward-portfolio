import type { Link } from "./schema";

/**
 * Public links. JARVIS: update hrefs here — the UI, API, and manifest all
 * read from this file. Never link to private documents.
 */
export const links: Link[] = [
  {
    label: "GitHub",
    href: "https://github.com/Eddie-Edward",
    kind: "github",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/lei-edward",
    kind: "linkedin",
  },
  {
    label: "Email",
    href: "mailto:eddiel@umich.edu",
    kind: "email",
  },
  {
    label: "Resume",
    href: "#",
    kind: "resume",
    todo: "TODO(Edward): host a public, phone-number-free resume PDF (e.g. /resume.pdf in /public) and point this href at it.",
  },
];
