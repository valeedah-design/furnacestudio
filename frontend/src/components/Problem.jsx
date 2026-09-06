import { motion } from "framer-motion";
import { MaskedLine, EASE } from "@/components/Shared";

const STATEMENTS = [
  { text: "The logo looks fine.", dim: true },
  { text: "The website works.", dim: true },
  { text: "Instagram is active.", dim: true },
  { text: "But something isn't connecting.", dim: false },
];

export default function Problem() {
  return (
    <section
      id="problem"
      data-testid="problem-section"
      className="relative mx-auto max-w-[110rem] px-6 py-32 md:px-10 md:py-52"
    >
      <h2 className="text-[clamp(2.4rem,7.5vw,7.5rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">
        <MaskedLine>Your business is good.</MaskedLine>
        <MaskedLine delay={0.12}>
          <span className="text-outline">People just don’t see it.</span>
        </MaskedLine>
      </h2>

      <div className="mt-24 space-y-3 md:ml-auto md:mt-36 md:max-w-xl">
        {STATEMENTS.map((s, i) => (
          <motion.p
            key={s.text}
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ delay: i * 0.14, duration: 0.7, ease: EASE }}
            className={`text-xl font-semibold md:text-2xl ${
              s.dim ? "text-white/35" : "text-white"
            }`}
            data-testid={`problem-statement-${i}`}
          >
            {!s.dim && (
              <>
                But something <span className="text-ember">isn’t connecting</span>.
              </>
            )}
            {s.dim && s.text}
          </motion.p>
        ))}

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.9 }}
          className="pt-10 text-2xl font-bold text-white md:text-3xl"
          data-testid="problem-resolution"
        >
          That’s where we come in<span className="text-ember">.</span>
        </motion.p>
      </div>
    </section>
  );
}
