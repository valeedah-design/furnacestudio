import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { MaskedLine, SectionLabel, EASE } from "@/components/Shared";

const SERVICES = [
  {
    n: "01",
    slug: "brand",
    name: "BRAND",
    heat: true,
    desc: "Make people remember you. A name, a mark, a voice — the thing that makes you recognizable before anyone reads a word.",
    tags: ["Identity", "Logo system", "Tone of voice"],
  },
  {
    n: "02",
    slug: "web",
    name: "WEB",
    heat: true,
    desc: "Make your business easy to understand. A site that says what you do and gets people to act, in the first five seconds.",
    tags: ["Websites", "Copy", "Speed"],
  },
  {
    n: "03",
    slug: "product",
    name: "PRODUCT",
    heat: false,
    desc: "Turn ideas into useful digital products. From a rough idea to something people actually open and use.",
    tags: ["Apps", "Tools", "Platforms"],
  },
  {
    n: "04",
    slug: "ux-ui",
    name: "UX / UI",
    heat: true,
    desc: "Make complicated things feel simple. Good interfaces disappear — people just get what they came for.",
    tags: ["Flows", "Interfaces", "Testing"],
  },
  {
    n: "05",
    slug: "motion",
    name: "MOTION",
    heat: false,
    desc: "Make the experience move. Small, deliberate motion that explains itself instead of just decorating the page.",
    tags: ["Animation", "Interaction", "Video"],
  },
  {
    n: "06",
    slug: "development",
    name: "DEVELOPMENT",
    heat: false,
    desc: "Make the design real. Beautiful isn't enough — it has to load fast, work everywhere, and actually work.",
    tags: ["Front-end", "Back-end", "Performance"],
  },
  {
    n: "07",
    slug: "marketing",
    name: "MARKETING",
    heat: true,
    desc: "Make sure people find it. The best website in the world is worthless if nobody sees it.",
    tags: ["SEO", "Ads", "Social"],
  },
];

export default function Services() {
  const [open, setOpen] = useState(0);

  return (
    <section
      id="services"
      data-testid="services-section"
      className="mx-auto max-w-[110rem] px-6 py-32 md:px-10 md:py-48"
    >
      <SectionLabel>Services</SectionLabel>
      <h2 className="text-[clamp(2.4rem,7vw,7rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">
        <MaskedLine>What can</MaskedLine>
        <MaskedLine delay={0.12}>
          <span className="text-outline">we make?</span>
        </MaskedLine>
      </h2>
      <p className="mt-8 max-w-md text-base font-medium text-white/50">
        Not a fixed package. The right ingredients, for your problem.
      </p>

      <div className="mt-20 border-b border-white/10">
        {SERVICES.map((s, i) => {
          const isOpen = open === i;
          const accent = s.heat ? "ember" : "temper";
          return (
            <div
              key={s.slug}
              data-testid={`service-row-${s.slug}`}
              onMouseEnter={() => setOpen(i)}
              className={`border-t border-white/10 transition-opacity duration-500 ${
                isOpen ? "opacity-100" : "opacity-40"
              }`}
            >
              <button
                data-testid={`service-toggle-${s.slug}`}
                onClick={() => setOpen(i)}
                className="flex w-full items-center gap-5 py-7 text-left md:gap-10 md:py-9"
              >
                <span
                  className={`text-[11px] font-bold tracking-[0.3em] transition-colors duration-300 ${
                    isOpen
                      ? accent === "ember"
                        ? "text-ember"
                        : "text-temper"
                      : "text-white/30"
                  }`}
                >
                  {s.n}
                </span>
                <span
                  className={`text-3xl font-extrabold uppercase tracking-tight transition-colors duration-300 md:text-6xl ${
                    isOpen ? "text-white" : "text-white/70"
                  }`}
                >
                  {s.name}
                </span>
                <span
                  className={`ml-auto flex h-10 w-10 shrink-0 items-center justify-center border transition-all duration-300 md:h-12 md:w-12 ${
                    isOpen
                      ? accent === "ember"
                        ? "border-ember bg-ember text-white"
                        : "border-temper bg-temper text-white"
                      : "border-white/15 text-white/40"
                  }`}
                >
                  <ArrowUpRight
                    className={`h-4 w-4 transition-transform duration-500 ${isOpen ? "rotate-45" : ""}`}
                  />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-6 pb-8 md:grid-cols-2 md:pl-[4.5rem] md:pb-10">
                      <p className="max-w-md text-base font-medium leading-relaxed text-white/60">
                        {s.desc}
                      </p>
                      <div className="flex flex-wrap content-start gap-2">
                        {s.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] ${
                              accent === "ember"
                                ? "border-ember/40 text-ember"
                                : "border-temper/40 text-temper"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
