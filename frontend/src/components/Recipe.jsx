import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MaskedLine, SectionLabel } from "@/components/Shared";

const NODES = [
  { t: "POSITIONING", d: "Where you stand" },
  { t: "CUSTOMER", d: "Who pays" },
  { t: "BRAND", d: "How you look" },
  { t: "OFFER", d: "What they buy" },
  { t: "LOCATION", d: "Where you are" },
  { t: "SEARCH", d: "How you’re found" },
  { t: "CONTENT", d: "Why they care" },
  { t: "WEBSITE", d: "Where it lands" },
];

const NOISE = ["GUT FEEL", "TRENDS", "GUESSWORK"];

const ChainNode = ({ i, t, d, progress }) => {
  const appear = useTransform(
    progress,
    [0.03 + i * 0.1, 0.03 + i * 0.1 + 0.1],
    [0, 1]
  );
  const x = useTransform(appear, [0, 1], [i % 2 ? 60 : -60, 0]);
  const last = i === NODES.length - 1;
  return (
    <motion.div
      style={{ opacity: appear, x }}
      data-testid={`recipe-node-${t.toLowerCase()}`}
      className={`w-60 border px-6 py-4 md:w-72 ${
        last ? "border-ember/60 bg-[#221210]" : "border-white/15 bg-forge-panel"
      }`}
    >
      <div className="flex items-baseline justify-between">
        <span
          className={`text-[10px] font-bold tracking-[0.3em] ${
            last ? "text-ember" : "text-white/35"
          }`}
        >
          0{i + 1}
        </span>
        {last && (
          <span className="text-[10px] font-bold tracking-[0.3em] text-ember/70">
            THE MIX
          </span>
        )}
      </div>
      <div
        className={`mt-1 text-xl font-extrabold uppercase tracking-tight md:text-2xl ${
          last ? "text-ember" : "text-white"
        }`}
      >
        {t}
      </div>
      <div className="mt-0.5 text-xs font-medium text-white/40">{d}</div>
    </motion.div>
  );
};

const Connector = ({ i, progress }) => {
  const draw = useTransform(
    progress,
    [0.03 + i * 0.1 + 0.08, 0.03 + i * 0.1 + 0.2],
    [0, 1]
  );
  return (
    <div className="relative h-8 w-px bg-white/10 md:h-10">
      <motion.div
        style={{ scaleY: draw }}
        className="absolute inset-0 origin-top bg-ember"
      />
    </div>
  );
};

const NoiseChip = ({ label, i, progress }) => {
  const opacity = useTransform(progress, [0.4 + i * 0.08, 0.55 + i * 0.08], [0.6, 0]);
  const strike = useTransform(progress, [0.4 + i * 0.08, 0.55 + i * 0.08], [0, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className="relative border border-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-white/40"
    >
      {label}
      <motion.span
        style={{ scaleX: strike }}
        className="absolute left-0 top-1/2 h-px w-full origin-left bg-ember"
      />
    </motion.span>
  );
};

export default function Recipe() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.6"],
  });

  return (
    <section
      id="recipe"
      ref={ref}
      data-testid="recipe-section"
      className="relative mx-auto max-w-[110rem] px-6 py-32 md:px-10 md:py-52"
    >
      <div className="grid gap-20 lg:grid-cols-2 lg:gap-12">
        <div className="self-start lg:sticky lg:top-32">
          <SectionLabel>03 — The recipe</SectionLabel>
          <h2 className="text-[clamp(2.2rem,5.5vw,5.5rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">
            <MaskedLine>First, we find</MaskedLine>
            <MaskedLine delay={0.1}>
              <span className="text-outline">the recipe.</span>
            </MaskedLine>
          </h2>
          <p className="mt-10 max-w-md text-lg font-medium leading-relaxed text-white/55">
            We look at the business, the customers, the competition and the local
            market. <span className="text-white">Then we decide what goes in.</span>
          </p>
          <p className="mt-16 flex max-w-md items-start gap-4 text-base font-semibold text-white md:mt-24">
            <span className="mt-2 h-2 w-2 shrink-0 bg-ember" />
            Not everything belongs in the final mix.
          </p>
        </div>

        <div className="flex flex-col items-center lg:items-end">
          <div className="mb-10 flex gap-3">
            {NOISE.map((n, i) => (
              <NoiseChip key={n} label={n} i={i} progress={scrollYProgress} />
            ))}
          </div>
          {NODES.map((n, i) => (
            <div key={n.t} className="flex flex-col items-center">
              <ChainNode i={i} t={n.t} d={n.d} progress={scrollYProgress} />
              {i < NODES.length - 1 && <Connector i={i} progress={scrollYProgress} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
