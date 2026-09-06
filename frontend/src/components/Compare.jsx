import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MaskedLine, SectionLabel, EASE } from "@/components/Shared";

const ROLES = [
  { name: "Designer", note: "Own taste." },
  { name: "Developer", note: "Own code." },
  { name: "SEO freelancer", note: "Own spreadsheet." },
  { name: "Copywriter", note: "Own voice." },
  { name: "Marketing person", note: "Own agenda." },
];

export default function Compare({ onStart }) {
  return (
    <section
      data-testid="compare-section"
      className="mx-auto max-w-[110rem] px-6 py-32 md:px-10 md:py-48"
    >
      <SectionLabel>The alternative</SectionLabel>
      <h2 className="text-[clamp(2.2rem,6vw,6rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">
        <MaskedLine>You could hire</MaskedLine>
        <MaskedLine delay={0.12}>
          <span className="text-outline">five people.</span>
        </MaskedLine>
      </h2>

      <div className="mt-16 max-w-3xl">
        {ROLES.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: EASE }}
            className="flex items-baseline justify-between border-b border-white/10 py-5"
            data-testid={`compare-role-${i}`}
          >
            <span className="text-xl font-bold text-white/40 md:text-3xl">{r.name}</span>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/25">
              {r.note}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-24 md:mt-32">
        <h3 className="text-[clamp(2rem,5.5vw,5.5rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.02em]">
          <MaskedLine>Or one team that</MaskedLine>
          <MaskedLine delay={0.12}>
            makes the <span className="text-temper">pieces</span>
          </MaskedLine>
          <MaskedLine delay={0.24}>work together.</MaskedLine>
        </h3>
        <p className="mt-8 max-w-md text-base font-medium text-white/55">
          One conversation. One system. One invoice.
        </p>
        <button
          data-testid="compare-start-project"
          onClick={onStart}
          className="group mt-10 flex items-center gap-3 border border-white/20 px-7 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:border-temper hover:bg-temper"
        >
          Start a project
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
}
