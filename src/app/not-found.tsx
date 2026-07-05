import { GlowButton } from "@/components/ui/GlowButton";

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-mono text-xs tracking-[0.35em] text-dim uppercase">404 · Lost in orbit</p>
      <h1 className="text-gradient font-display text-5xl font-bold">Nothing out here.</h1>
      <p className="max-w-md text-mist">
        This coordinate isn&apos;t part of the constellation. Head back to the systems map.
      </p>
      <GlowButton href="/">Return home</GlowButton>
    </main>
  );
}
