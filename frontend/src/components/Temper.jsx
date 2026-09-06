import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MaskedLine, SectionLabel } from "@/components/Shared";

const CHAIN = ["BRAND", "WEBSITE", "SEARCH", "CONTENT", "CUSTOMER"];

const Node = ({ i, t, progress }) => {
  const opacity = useTransform(progress, [i * 0.14, i * 0.14 + 0.1], [0.15, 1]);
  const y = useTransform(progress, [i * 0.14, i * 0.14 + 0.1], [10, 0]);
  return (
    <motion.div
      style={{ opacity, y }}
      data-testid={`temper-node-${t.toLowerCase()}`}
      className="border border-temper/40 bg-[#111227] px-6 py-4 md:px-7 md:py-5"
    >
      <span className="text-[9px] font-bold tracking-[0.3em] text-temper/70">0{i + 1}</span>
      <div className="mt-0.5 text-lg font-extrabold uppercase tracking-tight text-white md:text-xl">
        {t}
      </div>
    </motion.div>
  );
};

const Link = ({ i, progress }) => {
  const draw = useTransform(progress, [i * 0.14 + 0.08, i * 0.14 + 0.2], [0, 1]);
  return (
    <>
      <div className="relative hidden h-px w-10 bg-white/10 md:block lg:w-16">
        <motion.div style={{ scaleX: draw }} className="absolute inset-0 origin-left bg-temper" />
      </div>
      <div className="relative h-8 w-px bg-white/10 md:hidden">
        <motion.div style={{ scaleY: draw }} className="absolute inset-0 origin-top bg-temper" />
      </div>
    </>
  );
};

export default function Temper() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.5"],
  });

  return (
    <section
      id="temper"
      ref={ref}
      data-testid="temper-section"
      className="mx-auto max-w-[110rem] px-6 py-32 md:px-10 md:py-52"
    >
      <SectionLabel tone="temper">08 — Temper</SectionLabel>
      <h2 className="text-[clamp(2.4rem,7.5vw,7.5rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">
        <MaskedLine>Now it holds</MaskedLine>
        <MaskedLine delay={0.12}>
          <span className="text-outline-temper">its shape.</span>
        </MaskedLine>
      </h2>
      <p className="mt-8 max-w-md text-lg font-medium text-white/55">
        Everything connects. Nothing rattles.
      </p>

      <div className="mt-16 flex flex-col items-start md:mt-24 md:flex-row md:items-center">
        {CHAIN.map((c, i) => (
          <div key={c} className="flex flex-col items-start md:flex-row md:items-center">
            <Node i={i} t={c} progress={scrollYProgress} />
            {i < CHAIN.length - 1 && <Link i={i} progress={scrollYProgress} />}
          </div>
        ))}
      </div>
    </section>
  );
}
