import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";

import { MotionProvider } from "@/components/providers/MotionProvider";
import { content } from "@/content";

import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${content.profile.name} — ${content.profile.headline}`,
    template: `%s · ${content.profile.name}`,
  },
  description: content.siteConfig.description,
  keywords: [
    "Edward Lei",
    "AI systems",
    "software engineer",
    "University of Michigan",
    "portfolio",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-void font-body text-ink antialiased">
        {/* Motion serializes initial="hidden" into SSR inline styles; with
            JS disabled that content would stay invisible. Every Motion-
            revealed element carries data-reveal so this forces it visible. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important;}`}</style>
        </noscript>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
