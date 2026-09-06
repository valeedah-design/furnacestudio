import { MaskedLine } from "@/components/Shared";

const WORDS = ["RAW INGREDIENTS", "RECIPE", "HEAT", "BAKE", "TEMPER", "RESULT"];

const SENTENCES = [
  { t: "Good ingredients matter.", align: "left", style: "solid" },
  { t: "So does the recipe.", align: "right", style: "outline" },
  { t: "So does the heat.", align: "left", style: "solid", hot: "heat" },
  { t: "So does the timing.", align: "right", style: "outline" },
  { t: "So does the finish.", align: "left", style: "solid" },
  { t: "So does the result.", align: "right", style: "solid", hot: "result" },
];

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
      <div className="mx-auto max-w-[110rem] space-y-20 px-6 md:space-y-32 md:px-10">
        {SENTENCES.map((s, i) => (
          <div
            key={s.t}
            data-testid={`manifesto-line-${i}`}
            className={s.align === "right" ? "md:text-right" : ""}
          >
            <div
              className={`mb-8 flex items-center gap-3 ${
                s.align === "right" ? "md:justify-end" : ""
              }`}
            >
              <span
                className={`h-2 w-2 ${
                  s.hot === "result" ? "bg-temper" : s.hot ? "bg-ember" : "bg-white/30"
                }`}
              />
              <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-white/40">
                0{i + 1}
              </span>
            </div>
            <h2 className="text-[clamp(2.2rem,7vw,7rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">
              <MaskedLine>
                {s.hot === "heat" ? (
                  <>
                    So does the <span className="text-ember">heat</span>.
                  </>
                ) : s.hot === "result" ? (
                  <>
                    So does the <span className="text-temper">result</span>.
                  </>
                ) : s.style === "outline" ? (
                  <span className="text-outline">{s.t}</span>
                ) : (
                  s.t
                )}
              </MaskedLine>
            </h2>
          </div>
        ))}
      </div>
      <Marquee />
    </section>
  );
}
