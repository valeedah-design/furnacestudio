import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { MaskedLine, SectionLabel, EASE } from "@/components/Shared";

const VARIANTS = [
  {
    key: "A",
    head: "Best café in town",
    btn: "Learn more",
    metric: "2.1%",
    fill: 18,
    img: { left: "56%", top: "20%", width: "38%", height: "42%" },
    headBox: { left: "6%", top: "24%", width: "44%" },
    sub: { left: "6%", top: "48%", width: "30%" },
    btnBox: { left: "6%", top: "58%", width: "16%" },
    reviews: false,
  },
  {
    key: "B",
    head: "Fresh pasta, Tuesday to Sunday",
    btn: "Book a table",
    metric: "3.4%",
    fill: 32,
    img: { left: "6%", top: "20%", width: "34%", height: "52%" },
    headBox: { left: "46%", top: "24%", width: "48%" },
    sub: { left: "46%", top: "50%", width: "34%" },
    btnBox: { left: "46%", top: "60%", width: "22%" },
    reviews: false,
  },
  {
    key: "C",
    head: "Lunch in 20 minutes. Booked in 30 seconds.",
    btn: "Book a table →",
    metric: "4.8%",
    fill: 45,
    img: { left: "6%", top: "18%", width: "88%", height: "24%" },
    headBox: { left: "6%", top: "50%", width: "72%" },
    sub: { left: "6%", top: "68%", width: "40%" },
    btnBox: { left: "6%", top: "76%", width: "24%" },
    reviews: true,
  },
];

const SENTENCES = ["You test.", "You measure.", "You adjust.", "You bake again."];

export default function Iterate() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setV((x) => (x + 1) % VARIANTS.length), 2600);
    return () => clearInterval(id);
  }, [inView]);

  const cur = VARIANTS[v];

  return (
    <section
      id="iterate"
      ref={ref}
      data-testid="iterate-section"
      className="mx-auto max-w-[110rem] px-6 py-32 md:px-10 md:py-48"
    >
      <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-12">
        <div>
          <SectionLabel>07 — Don’t just put it in the oven</SectionLabel>
          <h2 className="text-[clamp(2rem,4.8vw,4.8rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">
            <MaskedLine>Heat alone doesn’t</MaskedLine>
            <MaskedLine delay={0.1}>
              <span className="text-outline">make good work.</span>
            </MaskedLine>
          </h2>
          <div className="mt-12 space-y-1">
            {SENTENCES.map((s, i) => (
              <motion.p
                key={s}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ delay: 0.3 + i * 0.16, duration: 0.6, ease: EASE }}
                className={`text-xl font-bold md:text-2xl ${
                  i === SENTENCES.length - 1 ? "text-white" : "text-white/45"
                }`}
                data-testid={`iterate-sentence-${i}`}
              >
                {i === SENTENCES.length - 1 ? (
                  <>
                    You bake again<span className="text-ember">.</span>
                  </>
                ) : (
                  s
                )}
              </motion.p>
            ))}
          </div>
          <p className="mt-10 max-w-sm text-sm font-medium text-white/40">
            Example figures. Real tests, real numbers — every project.
          </p>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.3em]">
            <span className="text-white/40">
              Variant <span className="text-ember">{cur.key}</span> / C
            </span>
            <span className="text-white/40" data-testid="iterate-metric">
              Booking rate <span className="text-ember">{cur.metric}</span>
            </span>
          </div>
          <div
            data-testid="iterate-card"
            className="relative aspect-[16/10] w-full overflow-hidden border border-white/10 bg-[#0d0d10]"
          >
            <div className="absolute border border-white/20 bg-white/10" style={{ left: "6%", top: "7%", width: "88%", height: "6%" }} />
            <motion.div
              className="absolute border border-white/25 bg-white/15"
              animate={cur.img}
              transition={{ duration: 0.7, ease: EASE }}
            />
            <motion.div
              className="absolute"
              animate={cur.headBox}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={v}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="block text-sm font-extrabold uppercase leading-tight tracking-tight text-white md:text-xl"
                >
                  {cur.head}
                </motion.span>
              </AnimatePresence>
            </motion.div>
            <motion.div
              className="absolute h-[3%] border border-white/15 bg-white/25"
              animate={cur.sub}
              transition={{ duration: 0.7, ease: EASE }}
            />
            <motion.div
              className={`absolute flex items-center justify-center text-[9px] font-bold uppercase tracking-[0.15em] transition-colors duration-500 md:text-[10px] ${
                v === 0 ? "bg-white/15 text-white/60" : "bg-ember text-white"
              }`}
              animate={{ ...cur.btnBox, height: "8%" }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              {cur.btn}
            </motion.div>
            <motion.div
              className="absolute flex items-center justify-center text-[9px] font-bold tracking-[0.15em] text-ember md:text-[10px]"
              initial={false}
              animate={{ left: "36%", top: "76%", width: "58%", height: "8%", opacity: cur.reviews ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              ★★★★★ 214 REVIEWS
            </motion.div>
          </div>
          <div className="mt-4 h-1 w-full bg-white/10">
            <motion.div
              className="h-full bg-ember"
              animate={{ width: `${cur.fill}%` }}
              transition={{ duration: 0.8, ease: EASE }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
