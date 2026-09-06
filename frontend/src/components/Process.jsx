import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { scrollToY } from "@/lib/scroll";
import { EASE } from "@/components/Shared";

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
const mix = (c1, c2, t) => [
  lerp(c1[0], c2[0], t),
  lerp(c1[1], c2[1], t),
  lerp(c1[2], c2[2], t),
  lerp(c1[3], c2[3], t),
];
const rgba = (c) =>
  `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${c[3].toFixed(3)})`;

const W = (a) => [255, 255, 255, a];
const E = (a) => [255, 74, 28, a];
const T = (a) => [74, 95, 232, a];
const K = [0, 0, 0, 0];

// matter blocks carry a slot (final wireframe position); noise blocks burn off
const BLOCKS = [
  { c: { x: 4, y: 8, w: 14, h: 9, r: -14 }, s: { x: 14, y: 10, w: 72, h: 7 }, bgF: W(0.12), bF: W(0.22) },
  { c: { x: 70, y: 4, w: 16, h: 11, r: 9 }, s: { x: 18, y: 24, w: 38, h: 9 }, bgF: W(0.95), bF: W(0.95) },
  { c: { x: 30, y: 2, w: 12, h: 6, r: -6 }, s: { x: 18, y: 36, w: 26, h: 3.5 }, bgF: W(0.4), bF: W(0.4) },
  { c: { x: 88, y: 22, w: 12, h: 14, r: 12 }, s: { x: 60, y: 24, w: 26, h: 22 }, bgF: T(0.28), bF: T(0.9) },
  { c: { x: 2, y: 34, w: 10, h: 5, r: 7 }, s: { x: 18, y: 46, w: 34, h: 3 }, bgF: W(0.5), bF: W(0.5) },
  { c: { x: 24, y: 56, w: 9, h: 5, r: -10 }, s: { x: 18, y: 51, w: 27, h: 3 }, bgF: W(0.5), bF: W(0.5) },
  { c: { x: 80, y: 52, w: 11, h: 8, r: -8 }, s: { x: 18, y: 60, w: 14, h: 6 }, bgF: T(1), bF: T(1), ember: true },
  { c: { x: 6, y: 72, w: 12, h: 10, r: 11 }, s: { x: 60, y: 52, w: 12, h: 16 }, bgF: W(0.07), bF: T(0.5) },
  { c: { x: 44, y: 84, w: 11, h: 9, r: -13 }, s: { x: 74, y: 52, w: 12, h: 16 }, bgF: W(0.07), bF: T(0.5) },
  { c: { x: 90, y: 86, w: 10, h: 6, r: 5 }, s: { x: 14, y: 78, w: 72, h: 4 }, bgF: W(0.12), bF: W(0.22) },
  { c: { x: 14, y: 26, w: 8, h: 6, r: 20 }, noise: true },
  { c: { x: 60, y: 16, w: 7, h: 5, r: -22 }, noise: true },
  { c: { x: 36, y: 66, w: 9, h: 6, r: 16 }, noise: true },
  { c: { x: 72, y: 74, w: 8, h: 5, r: -18 }, noise: true },
];

const STAGES = BLOCKS.map((b) => {
  const raw = { ...b.c, o: b.noise ? 0.85 : 1 };
  const sort = b.noise
    ? {
        x: b.c.x + (b.c.x < 50 ? -16 : 16),
        y: b.c.y,
        w: b.c.w * 0.5,
        h: b.c.h * 0.5,
        r: b.c.r * 0.5,
        o: 0.08,
      }
    : {
        x: lerp(b.c.x, b.s.x, 0.55),
        y: lerp(b.c.y, b.s.y, 0.55),
        w: lerp(b.c.w, b.s.w, 0.55),
        h: lerp(b.c.h, b.s.h, 0.55),
        r: b.c.r * 0.4,
        o: 1,
      };
  const slot = b.noise
    ? { ...sort, r: 0, o: 0 }
    : { ...b.s, r: 0, o: 1 };
  const rawBg = b.ember ? E(0.12) : W(0.05);
  const rawB = b.ember ? E(0.55) : W(0.14);
  return {
    pos: [raw, raw, sort, slot, slot, slot],
    bg: b.noise
      ? [W(0.05), W(0.05), W(0.03), K, K, K]
      : [rawBg, rawBg, rawBg, W(0.06), T(0.06), b.bgF],
    border: b.noise
      ? [W(0.14), W(0.14), W(0.08), K, K, K]
      : [rawB, rawB, W(0.14), W(0.3), T(0.55), b.bF],
  };
});

const STAGE_META = [
  { n: "01", name: "RAW", head: "Every business starts as noise.", sub: "Fragments. Competing messages. Disconnected touchpoints.", tone: "white" },
  { n: "02", name: "HEAT", head: "Before we make it pretty, we find out what’s wrong.", sub: "Customers. Competitors. Search behaviour. Positioning. We investigate first.", tone: "ember" },
  { n: "03", name: "SORT", head: "Keep the signal. Drop the rest.", sub: "What matters gets bigger. What doesn’t, disappears.", tone: "ember" },
  { n: "04", name: "SHAPE", head: "Now design begins.", sub: "Raw material becomes grid, wireframe, interface. Forged, not decorated.", tone: "ember" },
  { n: "05", name: "TEMPER", head: "Tested until it holds.", sub: "Mobile. Speed. Accessibility. SEO. Conversion. The shape holds.", tone: "temper" },
  { n: "06", name: "RESULT", head: "Less noise. More business.", sub: "A sharper identity. A faster website. A clearer reason to choose you.", tone: "temper" },
];

const TEMPS = [20, 1100, 940, 760, 380, 20];

function ForgeField({ progressRef }) {
  const fieldRef = useRef(null);
  const frameRef = useRef(null);
  const checksRef = useRef(null);
  const tempRef = useRef(null);
  const blockRefs = useRef([]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf;
    let lastTemp = "";
    const loop = (t) => {
      const sf = clamp(progressRef.current, 0, 1) * 5;
      const i0 = Math.min(4, Math.floor(sf));
      const f = smooth(clamp(sf - i0));
      const base = sf < 2 ? 1 : clamp((2.9 - sf) / 0.9);
      const heat = clamp(1 - Math.abs(sf - 1.2) / 1.1);
      const amp = reduce ? 0 : (0.35 + 1.2 * heat) * base;

      for (let i = 0; i < BLOCKS.length; i++) {
        const el = blockRefs.current[i];
        if (!el) continue;
        const st = STAGES[i];
        const a = st.pos[i0];
        const b = st.pos[i0 + 1];
        const x = lerp(a.x, b.x, f);
        const y = lerp(a.y, b.y, f);
        const w = lerp(a.w, b.w, f);
        const h = lerp(a.h, b.h, f);
        const r = lerp(a.r, b.r, f);
        const o = lerp(a.o, b.o, f);
        const jx = Math.sin(t * 0.004 + i * 1.7) * amp + Math.sin(t * 0.021 + i * 3.1) * heat * base * 0.5;
        const jy = Math.cos(t * 0.005 + i * 2.1) * amp + Math.cos(t * 0.019 + i * 2.7) * heat * base * 0.5;
        el.style.left = `${x}%`;
        el.style.top = `${y}%`;
        el.style.width = `${w}%`;
        el.style.height = `${h}%`;
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translate(${jx.toFixed(1)}px, ${jy.toFixed(1)}px) rotate(${r.toFixed(2)}deg)`;
        el.style.backgroundColor = rgba(mix(st.bg[i0], st.bg[i0 + 1], f));
        el.style.borderColor = rgba(mix(st.border[i0], st.border[i0 + 1], f));
      }

      if (frameRef.current) {
        const fo = clamp((sf - 2.2) / 0.8);
        frameRef.current.style.opacity = fo.toFixed(3);
        frameRef.current.style.borderColor = rgba(
          mix(W(0.18), T(0.55), clamp((sf - 3.2) / 1.6))
        );
      }
      if (checksRef.current) {
        checksRef.current.style.opacity = clamp((sf - 3.4) / 0.7).toFixed(3);
      }
      if (tempRef.current) {
        const temp = Math.round(lerp(TEMPS[i0], TEMPS[i0 + 1], f));
        const label = sf > 4.75 ? "SET" : `${temp}°C`;
        if (label !== lastTemp) {
          lastTemp = label;
          tempRef.current.textContent = label;
          tempRef.current.style.color = rgba(mix(E(1), T(1), clamp((sf - 3) / 2)));
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);

  return (
    <div className="relative w-full max-w-3xl" data-testid="forge-field">
      <div
        ref={tempRef}
        data-testid="process-temperature"
        className="absolute -top-12 right-0 text-2xl font-extrabold tabular-nums tracking-tight md:-top-14 md:text-4xl"
      >
        20°C
      </div>
      <div ref={fieldRef} className="relative aspect-[16/10] w-full">
        {BLOCKS.map((b, i) => (
          <div
            key={i}
            ref={(el) => (blockRefs.current[i] = el)}
            className="absolute border will-change-transform"
            style={{
              left: `${b.c.x}%`,
              top: `${b.c.y}%`,
              width: `${b.c.w}%`,
              height: `${b.c.h}%`,
            }}
          />
        ))}
        {/* browser frame — fades in at SHAPE, tempers to blue-violet */}
        <div
          ref={frameRef}
          className="pointer-events-none absolute border"
          style={{ left: "8%", top: "4%", width: "84%", height: "84%", opacity: 0 }}
        >
          <div className="absolute inset-x-0 top-0 flex h-6 items-center gap-1.5 border-b border-white/10 px-3">
            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
            <span className="ml-2 text-[9px] font-bold uppercase tracking-[0.25em] text-white/35">
              furnace.studio
            </span>
          </div>
          <span
            ref={checksRef}
            className="absolute bottom-2 left-3 text-[9px] font-bold uppercase tracking-[0.25em] text-temper"
            style={{ opacity: 0 }}
          >
            Mobile · Speed · SEO · Conversion — held
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Process() {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const progressRef = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    setActive(Math.min(5, Math.floor(v * 6)));
  });

  const jumpTo = (i) => {
    const el = ref.current;
    if (!el) return;
    const y = el.offsetTop + (i / 6) * (el.offsetHeight - window.innerHeight) + 4;
    scrollToY(y);
  };

  const stage = STAGE_META[active];

  return (
    <section id="process" ref={ref} data-testid="process-section" className="relative h-[640vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden px-6 pb-8 pt-24 md:px-10 md:pt-28">
        <div className="mx-auto grid w-full max-w-[110rem] flex-1 grid-rows-[auto_1fr_auto] gap-6 md:grid-cols-[240px_1fr] md:grid-rows-[1fr_auto] md:gap-10">
          {/* rail */}
          <div className="flex flex-col md:justify-center">
            <h2 className="mb-6 text-2xl font-extrabold uppercase leading-none tracking-tight md:mb-10 md:text-4xl">
              From raw
              <br />
              to ready<span className="text-ember">.</span>
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2 md:flex-col md:gap-5 md:overflow-visible md:pb-0">
              {STAGE_META.map((s, i) => (
                <button
                  key={s.n}
                  data-testid={`process-stage-${s.name.toLowerCase()}`}
                  onClick={() => jumpTo(i)}
                  className="group flex shrink-0 items-center gap-3 text-left"
                >
                  <span
                    className={`text-[10px] font-bold tracking-[0.25em] transition-colors duration-300 ${
                      active === i
                        ? s.tone === "temper"
                          ? "text-temper"
                          : s.tone === "ember"
                            ? "text-ember"
                            : "text-white"
                        : "text-white/25"
                    }`}
                  >
                    {s.n}
                  </span>
                  <span
                    className={`text-sm font-extrabold uppercase tracking-[0.12em] transition-colors duration-300 md:text-base ${
                      active === i ? "text-white" : "text-white/25 group-hover:text-white/60"
                    }`}
                  >
                    {s.name}
                  </span>
                  <span
                    className={`hidden h-px w-8 transition-colors duration-300 md:block ${
                      active === i
                        ? s.tone === "temper"
                          ? "bg-temper"
                          : s.tone === "ember"
                            ? "bg-ember"
                            : "bg-white"
                        : "bg-white/10"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* forge */}
          <div className="flex items-center justify-center md:justify-end md:pr-8">
            <ForgeField progressRef={progressRef} />
          </div>

          {/* stage narrative */}
          <div className="min-h-[7rem] md:col-span-2" data-testid="process-narrative">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <h3 className="max-w-3xl text-2xl font-extrabold uppercase leading-[1.02] tracking-tight md:text-5xl">
                  {stage.head}
                </h3>
                <p className="mt-3 max-w-xl text-sm font-medium text-white/50 md:text-base">
                  {stage.sub}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
