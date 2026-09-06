import { MaskedLine, SectionLabel } from "@/components/Shared";

const WORDS = ["RAW", "HEAT", "SORT", "SHAPE", "TEMPER", "RESULT"];

function Marquee() {
  return (
    <div
      className="relative mt-28 overflow-hidden border-y border-white/10 py-6 md:mt-40 md:py-9"
      aria-hidden="true"
      data-testid="marquee"
    >
      <div className="marquee-track flex w-max items-center">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center">
            {WORDS.map((w, i) => (
              <span key={`${dup}-${w}`} className="flex items-center">
                <span
                  className={`whitespace-nowrap px-6 text-4xl font-extrabold uppercase tracking-tight md:px-10 md:text-6xl ${
                    i >= 4 ? "text-outline-temper" : i % 2 ? "text-outline-faint" : "text-white/20"
                  }`}
                >
                  {w}
                </span>
                <span className={`text-xl md:text-3xl ${i >= 4 ? "text-temper/50" : "text-ember/50"}`}>
                  →
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Manifesto() {
  return (
    <section data-testid="manifesto-section" className="relative py-32 md:py-52">
      <div className="mx-auto max-w-[110rem] space-y-28 px-6 md:space-y-44 md:px-10">
        <div>
          <SectionLabel>Chapter 01 — The Furnace Principle</SectionLabel>
          <h2 className="text-[clamp(2.6rem,8vw,8rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">
            <MaskedLine>Complexity</MaskedLine>
            <MaskedLine delay={0.12}>is normal.</MaskedLine>
          </h2>
        </div>

        <div className="md:text-right">
          <div className="mb-10 flex items-center gap-3 md:justify-end">
            <span className="h-2 w-2 bg-ember" />
            <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-white/40">
              Chapter 02
            </span>
          </div>
          <h2 className="text-[clamp(2.6rem,8vw,8rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">
            <MaskedLine>
              <span className="text-outline">Confusion</span>
            </MaskedLine>
            <MaskedLine delay={0.12}>
              isn’t<span className="text-ember">.</span>
            </MaskedLine>
          </h2>
        </div>

        <div>
          <div className="mb-10 flex items-center gap-3">
            <span className="h-2 w-2 bg-temper" />
            <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-white/40">
              Chapter 03
            </span>
          </div>
          <h2 className="text-[clamp(2rem,5.5vw,5.5rem)] font-extrabold uppercase leading-[1.02] tracking-[-0.02em]">
            <MaskedLine>We remove the noise.</MaskedLine>
            <MaskedLine delay={0.12}>We keep what matters.</MaskedLine>
            <MaskedLine delay={0.24}>
              We build what <span className="text-temper">works</span>.
            </MaskedLine>
          </h2>
        </div>
      </div>
      <Marquee />
    </section>
  );
}
