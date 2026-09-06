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

const DESIGN_BG = {
  nav: W(0.1), title: W(0.95), sub: W(0.4), image: E(0.22),
  line: W(0.5), button: E(1), card: W(0.07), footer: W(0.1),
};
const FINAL_BG = { ...DESIGN_BG, image: T(0.28), button: T(1), nav: W(0.12), footer: W(0.12) };
const DESIGN_B = {
  nav: W(0.3), title: W(0.9), sub: W(0.4), image: E(0.8),
  line: W(0.5), button: E(1), card: W(0.3), footer: W(0.3),
};
const FINAL_B = { ...DESIGN_B, image: T(0.9), button: T(1), card: T(0.5), nav: W(0.22), footer: W(0.22) };

const BLOCKS = [
  { c: { x: 4, y: 8, w: 14, h: 9, r: -14 }, s: { x: 14, y: 10, w: 72, h: 7 }, kind: "nav" },
  { c: { x: 70, y: 4, w: 16, h: 11, r: 9 }, s: { x: 18, y: 24, w: 38, h: 9 }, kind: "title" },
  { c: { x: 30, y: 2, w: 12, h: 6, r: -6 }, s: { x: 18, y: 36, w: 26, h: 3.5 }, kind: "sub" },
  { c: { x: 88, y: 22, w: 12, h: 14, r: 12 }, s: { x: 60, y: 24, w: 26, h: 22 }, kind: "image" },
  { c: { x: 2, y: 34, w: 10, h: 5, r: 7 }, s: { x: 18, y: 46, w: 34, h: 3 }, kind: "line", t: { x: 18, y: 46, w: 30, h: 3 } },
  { c: { x: 24, y: 56, w: 9, h: 5, r: -10 }, s: { x: 18, y: 51, w: 27, h: 3 }, kind: "line" },
  { c: { x: 80, y: 52, w: 11, h: 8, r: -8 }, s: { x: 18, y: 60, w: 14, h: 6 }, kind: "button", ember: true, t: { x: 16, y: 60, w: 18, h: 6.5 } },
  { c: { x: 6, y: 72, w: 12, h: 10, r: 11 }, s: { x: 60, y: 52, w: 12, h: 16 }, kind: "card" },
  { c: { x: 44, y: 84, w: 11, h: 9, r: -13 }, s: { x: 74, y: 52, w: 12, h: 16 }, kind: "card" },
  { c: { x: 90, y: 86, w: 10, h: 6, r: 5 }, s: { x: 14, y: 78, w: 72, h: 4 }, kind: "footer" },
  { c: { x: 14, y: 26, w: 8, h: 6, r: 20 }, noise: true },
  { c: { x: 60, y: 16, w: 7, h: 5, r: -22 }, noise: true },
  { c: { x: 36, y: 66, w: 9, h: 6, r: 16 }, noise: true },
  { c: { x: 72, y: 74, w: 8, h: 5, r: -18 }, noise: true },
];

const STAGES = BLOCKS.map((b) => {
  const lerpPos = (a, bb, t) => ({
    x: lerp(a.x, bb.x, t),
    y: lerp(a.y, bb.y, t),
    w: lerp(a.w, bb.w, t),
    h: lerp(a.h, bb.h, t),
  });
  let pos;
  if (b.noise) {
    const raw = { ...b.c, o: 0.85 };
    const sketch = { ...b.c, r: b.c.r * 0.7, o: 0.5 };
    const out = {
      x: b.c.x + (b.c.x < 50 ? -16 : 16),
      y: b.c.y,
      w: b.c.w * 0.5,
      h: b.c.h * 0.5,
      r: b.c.r * 0.4,
      o: 0.08,
    };
    const gone = { ...out, o: 0 };
    pos = [raw, sketch, out, gone, gone, gone, gone, gone];
  } else {
    const raw = { ...b.c, o: 1 };
    const sketch = { ...lerpPos(b.c, b.s, 0.3), r: b.c.r * 0.65, o: 1 };
    const structure = { ...lerpPos(b.c, b.s, 0.7), r: b.c.r * 0.3, o: 1 };
    const wire = { ...b.s, r: 0, o: 1 };
    const test = { ...(b.t || b.s), r: 0, o: 1 };
    pos = [raw, sketch, structure, wire, wire, wire, test, test];
  }

  let bg;
  let border;
  if (b.noise) {
    bg = [W(0.05), W(0.05), W(0.03), K, K, K, K, K];
    border = [W(0.14), W(0.14), W(0.08), K, K, K, K, K];
  } else {
    const rawBg = b.ember ? E(0.12) : W(0.05);
    const rawB = b.ember ? E(0.55) : W(0.14);
    const dBg = DESIGN_BG[b.kind];
    const fBg = FINAL_BG[b.kind];
    const dB = DESIGN_B[b.kind];
    const fB = FINAL_B[b.kind];
    bg = [rawBg, rawBg, rawBg, W(0.06), dBg, dBg, dBg, fBg];
    border = [rawB, W(0.3), W(0.25), W(0.35), dB, dB, mix(dB, fB, 0.5), fB];
  }
  return { pos, bg, border };
});

const STAGE_META = [
  { n: "01", name: "RAW MATERIAL", head: "Everything on the table.", sub: "Product, reputation, customers, ambition. Undeniable, unshaped.", tone: "white" },
  { n: "02", name: "SKETCH", head: "Rough ideas, fast.", sub: "Pencil before pixels. Bad directions get killed early and cheaply.", tone: "ember" },
  { n: "03", name: "STRUCTURE", head: "The system takes shape.", sub: "What matters gets a place. What doesn’t, gets dropped.", tone: "ember" },
  { n: "04", name: "WIREFRAME", head: "Structure before decoration.", sub: "Hierarchy. Flow. The shortest path to a booking.", tone: "ember" },
  { n: "05", name: "DESIGN", head: "Now it looks like you.", sub: "Type, colour, tone. Yours — not a template’s.", tone: "ember" },
  { n: "06", name: "DEVELOPMENT", head: "Built to be fast.", sub: "Real code. Quick on a phone, on a bad connection, on the high street.", tone: "ember" },
  { n: "07", name: "TEST", head: "Pressed, prodded, adjusted.", sub: "Mobile. Speed. SEO. Conversion. Then adjusted again.", tone: "ember" },
  { n: "08", name: "LAUNCH", head: "Out of the oven.", sub: "It holds its shape. Ready for customers.", tone: "temper" },
];

const TEMPS = [18, 24, 45, 90, 150, 180, 175, 20];
const AMPS = [0.5, 0.35, 0.22, 0, 0.08, 0.55, 0.14, 0];
const BSTYLES = ["solid", "dashed", "solid", "solid", "solid", "solid", "solid", "solid"];

function ForgeField({ progressRef }) {
  const frameRef = useRef(null);
  const checksRef = useRef(null);
  const tempRef = useRef(null);
  const blockRefs = useRef([]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf;
    let lastLabel = "";
    let lastCheck = "";
    const loop = (t) => {
      const sf = clamp(progressRef.current) * 7;
      const i0 = Math.min(6, Math.floor(sf));
      const f = smooth(clamp(sf - i0));
      const amp = reduce ? 0 : lerp(AMPS[i0], AMPS[i0 + 1], f);
      const bstyle = BSTYLES[Math.round(sf)];

      for (let i = 0; i < BLOCKS.length; i++) {
        const el = blockRefs.current[i];
        if (!el) continue;
        const st = STAGES[i];
        const a = st.pos[i0];
        const b = st.pos[i0 + 1];
        const jx = Math.sin(t * 0.004 + i * 1.7) * amp + Math.sin(t * 0.021 + i * 3.1) * amp * 0.5;
        const jy = Math.cos(t * 0.005 + i * 2.1) * amp + Math.cos(t * 0.019 + i * 2.7) * amp * 0.5;
        el.style.left = `${lerp(a.x, b.x, f)}%`;
        el.style.top = `${lerp(a.y, b.y, f)}%`;
        el.style.width = `${lerp(a.w, b.w, f)}%`;
        el.style.height = `${lerp(a.h, b.h, f)}%`;
        el.style.opacity = lerp(a.o, b.o, f).toFixed(3);
        el.style.transform = `translate(${jx.toFixed(1)}px, ${jy.toFixed(1)}px) rotate(${lerp(a.r, b.r, f).toFixed(2)}deg)`;
        el.style.borderStyle = bstyle;
        el.style.backgroundColor = rgba(mix(st.bg[i0], st.bg[i0 + 1], f));
        el.style.borderColor = rgba(mix(st.border[i0], st.border[i0 + 1], f));
      }

      if (frameRef.current) {
        frameRef.current.style.opacity = clamp((sf - 4.2) / 0.8).toFixed(3);
        frameRef.current.style.borderColor = rgba(
          mix(W(0.18), T(0.55), clamp((sf - 5.5) / 1.5))
        );
      }
      if (checksRef.current) {
        const label =
          sf > 6.8
            ? "PASSED — HOLDS ITS SHAPE"
            : "TESTING — MOBILE · SPEED · SEO · CONVERSION";
        if (label !== lastCheck) {
          lastCheck = label;
          checksRef.current.textContent = label;
          checksRef.current.style.color = sf > 6.8 ? "#4A5FE8" : "#FF4A1C";
        }
        checksRef.current.style.opacity = clamp((sf - 5.4) / 0.5).toFixed(3);
      }
      if (tempRef.current) {
        const temp = Math.round(lerp(TEMPS[i0], TEMPS[i0 + 1], f));
        const label = sf > 6.8 ? "OUT" : `${temp}°C`;
        if (label !== lastLabel) {
          lastLabel = label;
          tempRef.current.textContent = label;
          tempRef.current.style.color = rgba(mix(E(1), T(1), clamp((sf - 5.5) / 1.5)));
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
        18°C
      </div>
      <div className="relative aspect-[16/10] w-full">
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
            className="absolute bottom-2 left-3 text-[9px] font-bold uppercase tracking-[0.25em]"
            style={{ opacity: 0 }}
          />
        </div>
      </div>
    </div>
  );
}

export default function Bake() {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const progressRef = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    setActive(Math.min(7, Math.floor(v * 8)));
  });

  const jumpTo = (i) => {
    const el = ref.current;
    if (!el) return;
    const y = el.offsetTop + (i / 8) * (el.offsetHeight - window.innerHeight) + 4;
    scrollToY(y);
  };

  const stage = STAGE_META[active];

  return (
    <section id="process" ref={ref} data-testid="process-section" className="relative h-[820vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden px-6 pb-8 pt-24 md:px-10 md:pt-28">
        <div className="mx-auto grid w-full max-w-[110rem] flex-1 grid-rows-[auto_1fr_auto] gap-6 md:grid-cols-[240px_1fr] md:grid-rows-[1fr_auto] md:gap-10">
          <div className="flex flex-col md:justify-center">
            <h2 className="mb-6 text-2xl font-extrabold uppercase leading-none tracking-tight md:mb-8 md:text-4xl">
              The bake<span className="text-ember">.</span>
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2 md:flex-col md:gap-3.5 md:overflow-visible md:pb-0">
              {STAGE_META.map((s, i) => (
                <button
                  key={s.n}
                  data-testid={`process-stage-${s.name.toLowerCase().replace(/\s/g, "-")}`}
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
                    className={`text-xs font-extrabold uppercase tracking-[0.12em] transition-colors duration-300 md:text-sm ${
                      active === i ? "text-white" : "text-white/25 group-hover:text-white/60"
                    }`}
                  >
                    {s.name}
                  </span>
                  <span
                    className={`hidden h-px w-6 transition-colors duration-300 md:block ${
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

          <div className="flex items-center justify-center md:justify-end md:pr-8">
            <ForgeField progressRef={progressRef} />
          </div>

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
