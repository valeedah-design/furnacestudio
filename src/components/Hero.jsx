import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { scrollToId } from "@/lib/scroll";
import { EASE } from "@/components/Shared";

const FRAGMENTS = [
  { t: "menu.pdf", x: 6, y: 18, r: -9 },
  { t: "★ 4.2 · 213 reviews", x: 78, y: 13, r: 6 },
  { t: "BOOK NOW", x: 85, y: 38, r: -5, ember: true },
  { t: "£12.50", x: 10, y: 62, r: 7 },
  { t: "“pizza near me”", x: 66, y: 68, r: -7 },
  { t: "Open until 23:00", x: 3, y: 82, r: 4 },
  { t: "logo_v3_FINAL.ai", x: 87, y: 80, r: 9 },
  { t: "@yourbusiness", x: 30, y: 7, r: -4 },
  { t: "404 — page not found", x: 52, y: 89, r: -8, ember: true },
  { t: "Directions →", x: 91, y: 56, r: 3 },
  { t: "IMG_0042.jpg", x: 21, y: 90, r: -6 },
  { t: "No availability", x: 45, y: 11, r: 5 },
  { t: "12 visits today", x: 70, y: 91, r: -3 },
  { t: "Name / Phone / Submit", x: 5, y: 40, r: 8 },
  { t: "6 fonts loaded", x: 60, y: 5, r: -5 },
  { t: "0.9s LCP", x: 36, y: 93, r: 6 },
];

const HeroLine = ({ children, delay }) => (
  <span className="block overflow-hidden pb-[0.06em]">
    <motion.span
      className="block will-change-transform"
      initial={{ y: "112%" }}
      animate={{ y: 0 }}
      transition={{ delay, duration: 1.05, ease: EASE }}
    >
      {children}
    </motion.span>
  </span>
);

export default function Hero({ onStart }) {
  const ref = useRef(null);
  const fieldRef = useRef(null);
  const fragRefs = useRef([]);
  const mouse = useRef({ x: -9999, y: -9999 });
  const progress = useRef(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.current = v;
  });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [4.5, -4.5]), {
    stiffness: 55,
    damping: 16,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), {
    stiffness: 55,
    damping: 16,
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf;
    const loop = (t) => {
      const field = fieldRef.current;
      if (field) {
        const rect = field.getBoundingClientRect();
        const p = progress.current;
        const e = p * p * (3 - 2 * p);
        for (let i = 0; i < FRAGMENTS.length; i++) {
          const el = fragRefs.current[i];
          if (!el) continue;
          const f = FRAGMENTS[i];
          const sx = 14 + (i % 4) * 24;
          const sy = 24 + Math.floor(i / 4) * 17;
          let jx = 0;
          let jy = 0;
          if (!reduce) {
            const drift = (1 - e) * 5;
            jx += Math.sin(t / 950 + i * 1.7) * drift;
            jy += Math.cos(t / 1150 + i * 2.3) * drift;
            const px = (f.x / 100) * rect.width;
            const py = (f.y / 100) * rect.height;
            const dx = px - mouse.current.x;
            const dy = py - mouse.current.y;
            const d = Math.hypot(dx, dy);
            if (d < 190 && d > 0.01) {
              const force = ((1 - d / 190) * 52 * (1 - e * 0.85)) / d;
              jx += dx * force;
              jy += dy * force;
            }
          }
          el.style.transform = `translate(${jx.toFixed(1)}px, ${jy.toFixed(1)}px) rotate(${(f.r * (1 - e)).toFixed(2)}deg)`;
          el.style.opacity = String(0.9 - e * 0.72);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onMouseMove = (e) => {
    const field = fieldRef.current;
    if (!field) return;
    const rect = field.getBoundingClientRect();
    mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      id="top"
      ref={ref}
      data-testid="hero"
      onMouseMove={onMouseMove}
      onMouseLeave={() => {
        mouse.current = { x: -9999, y: -9999 };
        mx.set(0);
        my.set(0);
      }}
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* The raw material */}
      <div ref={fieldRef} className="absolute inset-0" aria-hidden="true">
        {FRAGMENTS.map((f, i) => (
          <span
            key={i}
            ref={(el) => (fragRefs.current[i] = el)}
            className={`absolute select-none whitespace-nowrap border px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] backdrop-blur-sm md:px-3 ${
              f.ember
                ? "border-ember/40 bg-forge-panel/70 text-ember"
                : "border-white/10 bg-forge-panel/70 text-white/45"
            } ${i % 3 === 0 ? "hidden md:block" : ""}`}
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
          >
            {f.t}
          </span>
        ))}
      </div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-[110rem] px-6 pt-24 md:px-10"
      >
        <motion.div style={{ rotateX, rotateY, transformPerspective: 1400 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.8 }}
            className="mb-8 flex items-center gap-3"
          >
            <span className="h-px w-10 bg-ember" />
            <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-white/50">
              Furnace — Design &amp; marketing, Napoli
            </span>
          </motion.div>

          <h1 className="text-[clamp(2.9rem,10.5vw,10rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.02em]">
            <HeroLine delay={0.25}>You're already</HeroLine>
            <HeroLine delay={0.4}>
              <span className="text-outline">doing a lot</span>
              <span className="text-ember">.</span>
            </HeroLine>
          </h1>

          <div className="mt-10 flex flex-col gap-10 md:mt-14 md:flex-row md:items-end md:justify-between">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.8, ease: EASE }}
              className="max-w-md text-base font-medium leading-relaxed text-white/60 md:text-lg"
            >
              And somehow you're supposed to make it all work — the site, the socials, the ads, the reviews.{" "}
              <span className="text-white">That's our job.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8, ease: EASE }}
              className="flex flex-wrap items-center gap-6"
            >
              <button
                data-testid="hero-start-project"
                onClick={onStart}
                className="group flex items-center gap-3 bg-ember px-7 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:bg-white hover:text-forge"
              >
                Start a project
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <button
                data-testid="hero-see-how"
                onClick={() => scrollToId("furnace")}
                className="group flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-white/60 transition-colors duration-300 hover:text-white"
              >
                See what we do
                <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
        aria-hidden="true"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
          Apply pressure
        </span>
        <div className="h-10 w-px overflow-hidden bg-white/10">
          <motion.div
            className="h-full w-full bg-ember"
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
