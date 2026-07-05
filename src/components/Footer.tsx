import { content } from "@/content";

/** Site footer: links, machine-readable endpoints, honesty notes. */
export function Footer() {
  const publicLinks = content.links.filter((l) => l.href !== "#");
  return (
    <footer className="border-t border-line/60 px-5 py-14 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-semibold">
            <span className="text-gradient">EL</span> · {content.profile.name}
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-mist">{content.profile.mission}</p>
        </div>

        <div>
          <p className="mb-3 font-mono text-xs tracking-[0.25em] text-dim uppercase">Links</p>
          <ul className="space-y-2">
            {publicLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target={link.kind === "email" ? undefined : "_blank"}
                  rel={link.kind === "email" ? undefined : "noopener noreferrer"}
                  className="text-sm text-mist transition-colors hover:text-ink"
                >
                  {link.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 font-mono text-xs tracking-[0.25em] text-dim uppercase">
            Machine-readable
          </p>
          <ul className="space-y-2 font-mono text-xs text-mist">
            <li>
              <a href="/api/jarvis/portfolio-context" className="transition-colors hover:text-accent">
                /api/jarvis/portfolio-context
              </a>
            </li>
            <li>
              <a href="/jarvis-site-manifest.json" className="transition-colors hover:text-accent">
                /jarvis-site-manifest.json
              </a>
            </li>
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-dim">
            No analytics. No tracking. Every fact on this site lives in Zod-validated content
            files, so JARVIS can keep it honest.
          </p>
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-6xl border-t border-line/40 pt-6 text-xs text-dim">
        © {new Date().getFullYear()} {content.profile.name} · Built with Next.js, Motion & GSAP ·
        Designed to be updated by JARVIS
      </p>
    </footer>
  );
}
