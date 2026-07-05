import { Reveal } from "@/components/ui/Reveal";

/** Mono kicker + display title + optional lede, with staggered reveal. */
export function SectionHeading({
  kicker,
  title,
  lede,
}: {
  kicker: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="mb-14 max-w-3xl md:mb-20">
      <Reveal>
        <p className="mb-3 font-mono text-xs tracking-[0.3em] text-accent uppercase">
          {kicker}
        </p>
      </Reveal>
      <Reveal index={1}>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl">
          {title}
        </h2>
      </Reveal>
      {lede ? (
        <Reveal index={2}>
          <p className="mt-5 text-base leading-relaxed text-mist md:text-lg">{lede}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
