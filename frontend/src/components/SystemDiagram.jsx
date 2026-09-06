import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MaskedLine, SectionLabel } from "@/components/Shared";

const NODES = [
  { t: "BRAND", d: "Who you are" },
  { t: "WEBSITE", d: "Where it shows up" },
  { t: "SEARCH", d: "How you’re found" },
  { t: "CONTENT", d: "Why they care" },
  { t: "CUSTOMER", d: "Who pays" },
  { t: "REVENUE", d: "What it builds" },
];

const ChainNode = ({ i, t, d, progress }) => {
  const appear = useTransform(
    progress,
    [0.04 + i * 0.13, 0.04 + i * 0.13 + 0.12],
    [0, 1]
  );
  const x = useTransform(appear, [0, 1], [i % 2 ? 70 : -70, 0]);
  const last = i === NODES.length - 1;
  return (
    <motion.div
      style={{ opacity: appear, x }}
      data-testid={`system-node-${t.toLowerCase()}`}
      className={`w-60 border px-6 py-5 md:w-72 ${
        last ? "border-temper/60 bg-[#12142a]" : "border-white/15 bg-forge-panel"
      }`}
    >
      <div className="flex items-baseline justify-between">
        <span
          className={`text-[10px] font-bold tracking-[0.3em] ${
            last ? "text-temper" : "text-white/35"
          }`}
        >
          0{i + 1}
        </span>
        {last && (
          <span className="text-[10px] font-bold tracking-[0.3em] text-temper/70">
            RESOLVED
          </span>
        )}
      </div>
      <div
        className={`mt-1 text-2xl font-extrabold uppercase tracking-tight ${
          last ? "text-temper" : "text-white"
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
    [0.04 + i * 0.13 + 0.1, 0.04 + i * 0.13 + 0.24],
    [0, 1]
  );
  const last = i === NODES.length - 2;
  return (
    <div className="relative h-10 w-px bg-white/10 md:h-14">
      <motion.div
        style={{ scaleY: draw }}
        className={`absolute inset-0 origin-top ${last ? "bg-temper" : "bg-ember"}`}
      />
    </div>
  );
};

export default function SystemDiagram() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.55"],
  });

  return (
    <section
      id="why"
      ref={ref}
      data-testid="system-section"
      className="relative mx-auto max-w-[110rem] px-6 py-32 md:px-10 md:py-52"
    >
      <div className="grid gap-20 lg:grid-cols-2 lg:gap-12">
        <div className="self-start lg:sticky lg:top-32">
          <SectionLabel>Why Furnace</SectionLabel>
          <h2 className="text-[clamp(2.2rem,5.5vw,5.5rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">
            <MaskedLine>Most local businesses</MaskedLine>
            <MaskedLine delay={0.1}>don’t need more</MaskedLine>
            <MaskedLine delay={0.2}>
              <span className="text-outline">marketing.</span>
            </MaskedLine>
          </h2>
          <p className="mt-10 max-w-md text-lg font-medium leading-relaxed text-white/55">
            They need the right things to{" "}
            <span className="text-white">work together</span>.
          </p>
          <p className="mt-16 flex max-w-md items-start gap-4 text-base font-semibold text-white md:mt-24">
            <span className="mt-2 h-2 w-2 shrink-0 bg-ember" />
            We don’t make isolated assets. We make the system work.
          </p>
        </div>

        <div className="flex flex-col items-center lg:items-end">
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
