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
    desc: "Identity, positioning, visual direction. The reason people remember you — and the reason they come back.",
    tags: ["Logo system", "Typography", "Tone of voice"],
  },
  {
    n: "02",
    slug: "website",
    name: "WEBSITE",
    heat: true,
    desc: "Strategy, UX, UI, development. Your website has one job: turn visits into customers.",
    tags: ["UX & UI", "Development", "Speed"],
  },
  {
    n: "03",
    slug: "local-visibility",
    name: "LOCAL VISIBILITY",
    heat: false,
    desc: "Google presence, maps, local SEO. People can’t buy from you if they can’t find you.",
    tags: ["Google Business", "Local SEO", "Reviews"],
  },
  {
    n: "04",
    slug: "content",
    name: "CONTENT",
    heat: true,
    desc: "Photography direction, social content, campaigns. Proof, not filler.",
    tags: ["Photo direction", "Social", "Campaigns"],
  },
  {
    n: "05",
    slug: "conversion",
    name: "CONVERSION",
    heat: false,
    desc: "Landing pages, booking flows, calls to action. Pretty isn’t enough.",
    tags: ["Landing pages", "Booking flows", "CRO"],
  },
  {
    n: "06",
    slug: "growth",
    name: "GROWTH",
    heat: false,
    desc: "Analytics, testing, ongoing improvement. Measured, then improved, then measured again.",
    tags: ["Analytics", "Testing", "Reporting"],
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
        <MaskedLine>What we put</MaskedLine>
        <MaskedLine delay={0.12}>
          <span className="text-outline">in the mix.</span>
        </MaskedLine>
      </h2>
      <p className="mt-8 max-w-md text-base font-medium text-white/50">
        Six things. Measured properly. In the right order.
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
