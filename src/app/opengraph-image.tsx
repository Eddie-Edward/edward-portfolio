import { ImageResponse } from "next/og";

import { content } from "@/content";

/**
 * Dedicated Open Graph image, generated at build time from the content
 * layer with Next.js ImageResponse — typographic, no stock or AI art.
 * Served automatically as og:image / twitter:image for every page.
 */
export const alt = `${content.profile.name} — ${content.profile.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const featured = content.projects.filter((p) => p.featured).map((p) => p.name);

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#070810",
          backgroundImage:
            "radial-gradient(circle at 82% 18%, rgba(94,234,212,0.14), transparent 45%), radial-gradient(circle at 15% 85%, rgba(129,140,248,0.16), transparent 50%)",
          color: "#e8ebf5",
          fontSize: 32,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: "#7c85a8",
          }}
        >
          <span>{content.profile.education.school}</span>
          <span>Class of {content.profile.education.expectedGraduation.split(" ").pop()}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: -2,
              color: "#5eead4",
            }}
          >
            {content.profile.name}
          </div>
          <div style={{ fontSize: 44, marginTop: 8, color: "#c6ccdf" }}>
            {content.profile.headline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: 16 }}>
            {featured.map((name) => (
              <div
                key={name}
                style={{
                  display: "flex",
                  padding: "10px 22px",
                  borderRadius: 999,
                  border: "1px solid rgba(124,133,168,0.45)",
                  fontSize: 24,
                  color: "#c6ccdf",
                }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
