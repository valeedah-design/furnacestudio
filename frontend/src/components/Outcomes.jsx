import { MaskedLine, SectionLabel } from "@/components/Shared";

const OUTCOMES = [
  { n: "01", t: "MORE VISIBILITY", d: "People find you before they find the other guy." },
  { n: "02", t: "MORE TRUST", d: "You look as good as you actually are." },
  { n: "03", t: "MORE BOOKINGS", d: "The phone does its job. The diary fills." },
  { n: "04", t: "MORE CUSTOMERS", d: "Foot traffic starts online." },
  { n: "05", t: "BETTER PERFORMANCE", d: "Fast, findable, measurable. Then improved." },
];

export default function Outcomes() {
  return (
    <section
      id="outcomes"
      data-testid="outcomes-section"
      className="mx-auto max-w-[110rem] px-6 py-32 md:px-10 md:py-48"
    >
      <SectionLabel tone="temper">09 — What comes out</SectionLabel>
      <h2 className="text-[clamp(2.4rem,7vw,7rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">
        <MaskedLine>What comes out</MaskedLine>
        <MaskedLine delay={0.12}>
          <span className="text-outline-temper">matters.</span>
        </MaskedLine>
      </h2>
      <p className="mt-8 max-w-md text-base font-medium text-white/50">
        No invented numbers. Real client results replace these lines as projects ship.
      </p>

      <div className="mt-16 border-b border-white/10 md:mt-20">
        {OUTCOMES.map((o) => (
          <div
            key={o.n}
            data-testid={`outcome-${o.n}`}
            className="group flex flex-col gap-2 border-t border-white/10 py-7 md:flex-row md:items-baseline md:justify-between md:gap-10 md:py-9"
          >
            <div className="flex items-baseline gap-6">
              <span className="text-[11px] font-bold tracking-[0.3em] text-temper/60 transition-colors duration-300 group-hover:text-temper">
                {o.n}
              </span>
              <span className="text-2xl font-extrabold uppercase tracking-tight text-white/80 transition-all duration-500 group-hover:translate-x-2 group-hover:text-temper md:text-6xl">
                {o.t}
              </span>
            </div>
            <p className="max-w-xs text-sm font-medium text-white/40 transition-colors duration-300 group-hover:text-white/70 md:text-right">
              {o.d}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
