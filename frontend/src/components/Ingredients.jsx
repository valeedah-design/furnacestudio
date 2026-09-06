import { motion } from "framer-motion";
import { MaskedLine, SectionLabel, EASE } from "@/components/Shared";

const ITEMS = [
  { t: "A good product.", r: -1.4 },
  { t: "A good location.", r: 1.1 },
  { t: "Good customers.", r: -0.8 },
  { t: "A reputation.", r: 1.6 },
  { t: "A story.", r: -1.2 },
  { t: "A reason people come back.", r: 0.9 },
];

export default function Ingredients() {
  return (
    <section
      id="ingredients"
      data-testid="ingredients-section"
      className="relative mx-auto max-w-[110rem] px-6 py-32 md:px-10 md:py-52"
    >
      <SectionLabel>02 — The ingredients</SectionLabel>
      <h2 className="text-[clamp(2.4rem,7.5vw,7.5rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">
        <MaskedLine>You already have</MaskedLine>
        <MaskedLine delay={0.12}>
          <span className="text-outline">most of it.</span>
        </MaskedLine>
      </h2>

      <div className="mt-20 grid gap-4 sm:grid-cols-2 md:mt-28 lg:grid-cols-3">
        {ITEMS.map((item, i) => (
          <motion.div
            key={item.t}
            data-testid={`ingredient-${i}`}
            initial={{ opacity: 0, y: 34, rotate: item.r * 4 }}
            whileInView={{ opacity: 1, y: 0, rotate: item.r }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ delay: i * 0.09, duration: 0.8, ease: EASE }}
            className="border border-white/15 bg-forge-panel px-6 py-7 md:py-9"
          >
            <span className="text-[10px] font-bold tracking-[0.3em] text-white/30">
              0{i + 1}
            </span>
            <p className="mt-3 text-xl font-bold text-white/85 md:text-2xl">{item.t}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-24 md:mt-36 md:max-w-3xl">
        <h3 className="text-[clamp(1.9rem,4.5vw,4.5rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.02em]">
          <MaskedLine>So why does it</MaskedLine>
          <MaskedLine delay={0.12}>
            still feel <span className="text-ember">hard?</span>
          </MaskedLine>
        </h3>
        <p className="mt-8 max-w-md text-base font-medium text-white/55 md:text-lg">
          The business isn’t bad. The system around it is. Everything is there —
          nothing has been combined properly yet.
        </p>
      </div>
    </section>
  );
}
