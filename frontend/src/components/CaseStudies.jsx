import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Plus, MoveHorizontal } from "lucide-react";
import { MaskedLine, SectionLabel, EASE } from "@/components/Shared";

const MORPH = [
  { b: { x: 8, y: 12, w: 22, h: 9, r: -8 }, a: { x: 6, y: 8, w: 88, h: 7 }, bg: "nav" },
  { b: { x: 62, y: 8, w: 18, h: 9, r: 6 }, a: { x: 6, y: 21, w: 44, h: 13 }, bg: "title" },
  { b: { x: 14, y: 42, w: 14, h: 7, r: 10 }, a: { x: 6, y: 38, w: 30, h: 4 }, bg: "line" },
  { b: { x: 70, y: 50, w: 20, h: 16, r: -7 }, a: { x: 56, y: 21, w: 38, h: 28 }, bg: "image" },
  { b: { x: 10, y: 68, w: 16, h: 6, r: -5 }, a: { x: 6, y: 48, w: 36, h: 3 }, bg: "line" },
  { b: { x: 44, y: 64, w: 12, h: 6, r: 12 }, a: { x: 6, y: 54, w: 28, h: 3 }, bg: "line" },
  { b: { x: 30, y: 24, w: 12, h: 8, r: -14 }, a: { x: 6, y: 64, w: 16, h: 7 }, bg: "button" },
  { b: { x: 52, y: 36, w: 10, h: 6, r: 8 }, a: { x: 6, y: 78, w: 88, h: 4 }, bg: "nav" },
];

const AFTER_BG = {
  nav: "bg-white/10 border-white/20",
  title: "bg-white/90 border-white/90",
  line: "bg-white/45 border-white/45",
  image: "bg-temper/25 border-temper/80",
  button: "bg-temper border-temper",
};

const CASES = [
  {
    slug: "ember-oak",
    idx: "01",
    name: "EMBER & OAK",
    sector: "Restaurant · Manchester",
    ingredients: "A serious kitchen. A room with character. Regulars who’d fight for the place.",
    problem: "Full kitchen, empty Tuesdays. The website was a PDF menu from 2019.",
    recipe: "New identity, a one-page site, the Google profile rebuilt, booking in two taps.",
    bake: "Designed, built and tested in four weeks. The menu loads before you’ve decided.",
    result: "Covers went up on the quiet nights. The phone started doing its job.",
    metrics: [
      { v: "+38", s: "%", label: "Bookings" },
      { v: "2.4", s: "×", label: "Search visibility" },
      { v: "-41", s: "%", label: "Bounce rate" },
    ],
  },
  {
    slug: "coldwell",
    idx: "02",
    name: "COLDWELL BARBERS",
    sector: "Barbershop · Leeds",
    ingredients: "Real craft. A chair people trust. A queue on Saturdays.",
    problem: "Walk-ins only. Chairs empty midweek, weekends pure chaos.",
    recipe: "A booking flow, local SEO, and photo direction that looks like the cut.",
    bake: "Two design rounds. Tested on regulars’ phones before launch.",
    result: "The week evened out. The diary fills itself now.",
    metrics: [
      { v: "61", s: "%", label: "Bookings now online" },
      { v: "+27", s: "%", label: "Repeat visits" },
      { v: "4.9", s: "★", label: "312 Google reviews" },
    ],
  },
  {
    slug: "northline",
    idx: "03",
    name: "NORTHLINE DENTAL",
    sector: "Clinic · Sheffield",
    ingredients: "Good dentists. Nervous patients. A reputation built on referrals.",
    problem: "A website from another decade. Phones quiet. Trust quieter.",
    recipe: "Rebrand, a 1.1-second website, a clear call to action on every page.",
    bake: "Three test rounds with real patients. Every friction point removed.",
    result: "The diary filled. Referrals started mentioning the website.",
    metrics: [
      { v: "+52", s: "%", label: "Phone calls" },
      { v: "1.1", s: "s", label: "Page load" },
      { v: "3", s: "×", label: "Enquiries" },
    ],
  },
];

const Counter = ({ value }) => {
  const m = value.match(/^([+-]?)([\d.]+)$/);
  const sign = m[1];
  const num = parseFloat(m[2]);
  const dec = (m[2].split(".")[1] || "").length;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    const t0 = performance.now();
    const D = 1500;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / D);
      const e = 1 - Math.pow(1 - p, 3);
      setN(num * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, num]);

  return (
    <span ref={ref} className="tabular-nums">
      {sign}
      {n.toFixed(dec)}
    </span>
  );
};

function BeforeAfter({ slug }) {
  const ref = useRef(null);
  const dragging = useRef(false);
  const [pos, setPos] = useState(78);

  const setFromX = (clientX) => {
    const r = ref.current.getBoundingClientRect();
    setPos(Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={ref}
      data-testid={`case-slider-${slug}`}
      role="slider"
      aria-label="Before and after comparison"
      aria-valuenow={Math.round(pos)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setPos((p) => Math.max(4, p - 6));
        if (e.key === "ArrowRight") setPos((p) => Math.min(96, p + 6));
      }}
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        setFromX(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && setFromX(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
      className="relative aspect-[16/9] w-full cursor-ew-resize touch-none select-none overflow-hidden border border-white/10 bg-[#0d0d10] outline-none focus-visible:border-temper"
    >
      {/* BEFORE — the raw ingredients */}
      <div className="absolute inset-0">
        {MORPH.map((blk, i) => (
          <div
            key={i}
            className={`absolute border ${
              i === 2 ? "border-ember/50 bg-ember/10" : "border-white/15 bg-white/5"
            }`}
            style={{
              left: `${blk.b.x}%`,
              top: `${blk.b.y}%`,
              width: `${blk.b.w}%`,
              height: `${blk.b.h}%`,
              transform: `rotate(${blk.b.r}deg)`,
            }}
          />
        ))}
      </div>
      {/* AFTER — out of the oven */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        {MORPH.map((blk, i) => (
          <div
            key={i}
            className={`absolute border ${AFTER_BG[blk.bg]}`}
            style={{
              left: `${blk.a.x}%`,
              top: `${blk.a.y}%`,
              width: `${blk.a.w}%`,
              height: `${blk.a.h}%`,
            }}
          />
        ))}
      </div>

      <span className="pointer-events-none absolute left-4 top-4 text-[10px] font-bold uppercase tracking-[0.3em] text-ember">
        Before
      </span>
      <span className="pointer-events-none absolute right-4 top-4 text-[10px] font-bold uppercase tracking-[0.3em] text-temper">
        After
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 w-px bg-white"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-white bg-forge text-white">
          <MoveHorizontal className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

const STORY_ROWS = [
  { label: "THE INGREDIENTS", key: "ingredients", tone: "white" },
  { label: "THE PROBLEM", key: "problem", tone: "ember" },
  { label: "THE RECIPE", key: "recipe", tone: "white" },
  { label: "THE BAKE", key: "bake", tone: "ember" },
  { label: "THE RESULT", key: "result", tone: "temper" },
];

function CaseStudy({ c }) {
  const [open, setOpen] = useState(false);
  return (
    <article data-testid={`case-${c.slug}`} className="border-t border-white/10 py-12 md:py-16">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h3 className="text-3xl font-extrabold uppercase tracking-tight md:text-5xl">
          <span className="mr-4 text-sm font-bold tracking-[0.3em] text-white/30 md:text-base">
            {c.idx}
          </span>
          {c.name}
        </h3>
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/40">
          {c.sector}
        </span>
      </div>

      <div className="mt-8 md:mt-10">
        <BeforeAfter slug={c.slug} />
        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
          Drag the handle — raw ingredients on the left, finished product on the right
        </p>
      </div>

      <div className="mt-6 grid grid-cols-3 divide-x divide-white/10 border border-white/10">
        {c.metrics.map((mt, i) => (
          <div
            key={mt.label}
            className="p-4 md:p-8"
            data-testid={`case-metric-${c.slug}-${i}`}
          >
            <div className="text-2xl font-extrabold tracking-tight text-temper md:text-5xl">
              <Counter value={mt.v} />
              <span>{mt.s}</span>
            </div>
            <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 md:text-xs">
              {mt.label}
            </div>
          </div>
        ))}
      </div>

      <button
        data-testid={`case-story-toggle-${c.slug}`}
        onClick={() => setOpen((v) => !v)}
        className="mt-8 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-white/60 transition-colors duration-300 hover:text-white"
      >
        {open ? "Close the recipe" : "Read the recipe"}
        <Plus
          className={`h-4 w-4 transition-transform duration-500 ${open ? "rotate-45 text-ember" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="mt-8 border-b border-white/10">
              {STORY_ROWS.map((row) => (
                <div
                  key={row.key}
                  className="flex flex-col gap-2 border-t border-white/10 py-5 md:flex-row md:gap-10"
                >
                  <span
                    className={`w-44 shrink-0 text-[10px] font-bold tracking-[0.3em] ${
                      row.tone === "ember"
                        ? "text-ember"
                        : row.tone === "temper"
                          ? "text-temper"
                          : "text-white/50"
                    }`}
                  >
                    {row.label}
                  </span>
                  <p className="max-w-2xl text-base font-medium leading-relaxed text-white/65">
                    {c[row.key]}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

export default function CaseStudies() {
  return (
    <section
      id="work"
      data-testid="work-section"
      className="mx-auto max-w-[110rem] px-6 py-32 md:px-10 md:py-48"
    >
      <SectionLabel tone="temper">Case studies</SectionLabel>
      <h2 className="text-[clamp(2.4rem,7vw,7rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">
        <MaskedLine>What a Furnace</MaskedLine>
        <MaskedLine delay={0.12}>
          project <span className="text-outline">looks like.</span>
        </MaskedLine>
      </h2>
      <p className="mt-8 max-w-lg text-base font-medium text-white/50">
        Three fictional engagements, built like real ones. Client results replace the
        placeholder metrics when they ship.
      </p>

      <div className="mt-16 border-b border-white/10">
        {CASES.map((c) => (
          <CaseStudy key={c.slug} c={c} />
        ))}
      </div>
    </section>
  );
}
