import { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { MaskedLine, SectionLabel } from "@/components/Shared";

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);

const STEPS = [
  { n: 100, l: "SIGNALS" },
  { n: 40, l: "USEFUL" },
  { n: 12, l: "IMPORTANT" },
  { n: 5, l: "ESSENTIAL" },
  { n: 1, l: "CLEAR DIRECTION" },
];

const CELLS = 100;

export default function Mix() {
  const ref = useRef(null);
  const progressRef = useRef(0);
  const numRef = useRef(null);
  const cellRefs = useRef([]);
  const [stage, setStage] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    const seg = clamp(v) * 4;
    setStage(Math.min(4, Math.round(seg)));
  });

  useEffect(() => {
    let raf;
    let lastCount = -1;
    const loop = () => {
      const seg = clamp(progressRef.current) * 4;
      const i0 = Math.min(3, Math.floor(seg));
      const f = smooth(clamp(seg - i0));
      const count = lerp(STEPS[i0].n, STEPS[i0 + 1].n, f);
      const rounded = Math.round(count);
      if (rounded !== lastCount) {
        lastCount = rounded;
        if (numRef.current) {
          numRef.current.textContent = String(rounded);
          numRef.current.style.color =
            rounded <= 1 ? "#FF4A1C" : rounded <= 5 ? "#FF4A1C" : "#FFFFFF";
        }
        for (let i = 0; i < CELLS; i++) {
          const el = cellRefs.current[i];
          if (!el) continue;
          const on = i < rounded;
          el.style.backgroundColor = on
            ? rounded <= 5
              ? "rgba(255,74,28,0.9)"
              : "rgba(255,255,255,0.75)"
            : "rgba(255,255,255,0.05)";
          el.style.transform = on ? "scale(1)" : "scale(0.55)";
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="mix" ref={ref} data-testid="mix-section" className="relative h-[420vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden px-6 md:px-10">
        <div className="mx-auto grid w-full max-w-[110rem] items-center gap-14 md:grid-cols-2 md:gap-8">
          <div>
            <SectionLabel>04 — The mix</SectionLabel>
            <h2 className="text-[clamp(2rem,4.5vw,4.5rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">
              <MaskedLine>Good design isn’t</MaskedLine>
              <MaskedLine delay={0.1}>
                <span className="text-outline">adding more.</span>
              </MaskedLine>
            </h2>
            <p className="mt-6 max-w-md text-lg font-semibold text-white md:text-xl">
              It’s knowing what to keep.
            </p>
            <div className="mt-12 flex items-end gap-5 md:mt-16">
              <div
                ref={numRef}
                data-testid="mix-count"
                className="text-[6rem] font-extrabold leading-none tabular-nums tracking-tight md:text-[10rem]"
              >
                100
              </div>
              <div
                data-testid="mix-stage-label"
                className="pb-3 text-xs font-bold uppercase tracking-[0.3em] text-white/50 md:pb-6 md:text-sm"
              >
                {STEPS[stage].l}
              </div>
            </div>
          </div>

          <div className="mx-auto grid w-full max-w-md grid-cols-10 gap-1.5 md:max-w-lg md:gap-2">
            {Array.from({ length: CELLS }).map((_, i) => (
              <div
                key={i}
                ref={(el) => (cellRefs.current[i] = el)}
                className="aspect-square w-full transition-transform duration-300"
                style={{ backgroundColor: "rgba(255,255,255,0.75)" }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
