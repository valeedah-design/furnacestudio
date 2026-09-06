import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MaskedLine, SectionLabel, EASE } from "@/components/Shared";

const EXEC = ["BRAND", "WEBSITE", "CONTENT", "LOCAL SEO", "CAMPAIGNS", "CONVERSION"];

export default function Heat() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const tempOpacity = useTransform(scrollYProgress, [0.75, 0.95], [0, 1]);

  return (
    <section
      id="heat"
      ref={ref}
      data-testid="heat-section"
      className="relative mx-auto max-w-[110rem] overflow-hidden px-6 py-32 md:px-10 md:py-48"
    >
      <SectionLabel>05 — Into the heat</SectionLabel>
      <h2 className="text-[clamp(2.4rem,7.5vw,7.5rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">
        <MaskedLine>Now we turn up</MaskedLine>
        <MaskedLine delay={0.12}>
          <span className="text-ember">the heat.</span>
        </MaskedLine>
      </h2>
      <p className="mt-8 max-w-md text-lg font-medium text-white/55">
        Strategy becomes execution. Fast.
      </p>

      <div className="mt-16 flex flex-wrap gap-3 md:mt-20 md:gap-4">
        {EXEC.map((w, i) => (
          <motion.span
            key={w}
            data-testid={`heat-chip-${i}`}
            initial={{ opacity: 0.1, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-18% 0px" }}
            transition={{
              delay: 0.5 * Math.pow(0.6, i),
              duration: Math.max(0.3, 0.6 - i * 0.07),
              ease: EASE,
            }}
            className="border border-ember/60 bg-ember/10 px-5 py-3 text-lg font-extrabold uppercase tracking-tight text-ember md:px-7 md:py-4 md:text-3xl"
          >
            {w}
          </motion.span>
        ))}
      </div>

      <div className="mt-20 md:mt-28">
        <div className="flex items-center justify-between pb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/35">
          <span>Oven</span>
          <motion.span style={{ opacity: tempOpacity }} className="text-ember">
            180°C
          </motion.span>
        </div>
        <div className="relative h-px bg-white/10">
          <motion.div
            style={{ scaleX: barScale }}
            className="absolute inset-0 origin-left bg-ember"
          />
        </div>
      </div>
    </section>
  );
}
