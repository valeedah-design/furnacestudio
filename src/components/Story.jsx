import { useEffect, useRef } from "react";

// ---------------------------------------------------------------------------
// THE MESS -> THE FURNACE -> THE RESULT
// "The mess" runs a slow ambient physics simulation -- 16 chips drift,
// collide, and occasionally break apart and reform on the opposite side of
// the screen, purely as a function of time. Everything downstream of the
// mess (choosing, making, into the furnace, the result) stays a pure
// function of scroll progress (0..1), so scrolling backward smoothly
// deconstructs the story instead of resetting it.
// ---------------------------------------------------------------------------

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (e0, e1, x) => {
  if (e0 === e1) return x < e0 ? 0 : 1;
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const seededRand = (i, salt) => {
  const v = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return v - Math.floor(v);
};
const roundRect = (c, x, y, w, h, r) => {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2));
  c.beginPath();
  c.moveTo(x + rr, y);
  c.arcTo(x + w, y, x + w, y + h, rr);
  c.arcTo(x + w, y + h, x, y + h, rr);
  c.arcTo(x, y + h, x, y, rr);
  c.arcTo(x, y, x + w, y, rr);
  c.closePath();
};
const hexToRgb = (hex) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const hexA = (hex, a) => {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
};

// 16 things a small business owner is suddenly responsible for
const MESS_ITEMS = [
  "INSTAGRAM", "GOOGLE", "WEBSITE", "REVIEWS", "LOGO", "PHOTOS", "BOOKINGS",
  "CUSTOMERS", "ADS", "SEO", "CONTENT", "ANALYTICS", "AI", "COMPETITORS",
  "EMAILS", "SOCIAL MEDIA",
];
// the 10 that survive the first cut, reframed as ingredients
const INGREDIENT_ITEMS = ["IDEA", "BUSINESS", "PEOPLE", "BRAND", "USERS", "CONTENT", "DESIGN", "TECH", "GOALS", "PRODUCT"];
// indices (into INGREDIENT_ITEMS) chosen for this project
const CHOSEN_IDX = [3, 6, 4, 7, 9]; // BRAND, DESIGN, USERS(-> UX), TECH(-> UI), PRODUCT(-> CODE)
const CHOSEN_LABELS = ["STRATEGY", "BRAND", "UX", "UI", "CODE"];

const CODE_GLYPHS = ["<section>", "<Button />", "<Component />", "<Nav />", "{ props }", "flex-col"];

// palette used to tint the mess chips (brand colors + white, weighted toward white)
const pickColor = (i) => {
  const r = seededRand(i, 5);
  if (r < 0.46) return "#FFFFFF";
  if (r < 0.73) return "#FF4A1C";
  return "#4A5FE8";
};

// ambient physics bounds for the mess phase (keeps chips clear of the rail / labels)
const MESS_MARGIN_X = 60;
const MESS_MARGIN_TOP = 96;
const MESS_MARGIN_BOTTOM = 40;
// a chip only bursts when it's actually hit hard enough -- gentle grazes just bounce
const BREAK_SPEED_THRESHOLD = 11;

function stepMessPhysics(mess, dt, now, vw, vh, impacts) {
  const dts = dt / 1000;
  // keep-out zone around the centered "MESS" title so chips route around it
  // (mirrors the title's clamp(4.5rem, 20vw, 15rem) font size, in px)
  const titleFont = Math.max(72, Math.min(vw * 0.2, 240));
  const TITLE_HALF_W = titleFont * 1.35;
  const TITLE_HALF_H = titleFont * 0.62;

  mess.forEach((m) => {
    if (m.state === "idle") {
      if (m.dragging) return; // position is driven directly by the pointer while held

      // smooth wander: steer the heading toward a slowly-changing target instead
      // of flying in dead-straight lines -- reads as lazy, organic drifting
      const speed = clamp01(Math.hypot(m.vx, m.vy) / 24) * 15 + 6;
      const currentAngle = Math.atan2(m.vy, m.vx);
      const targetAngle =
        Math.sin(now * 0.00013 + m.phase) * 1.15 + Math.sin(now * 0.00029 + m.phase * 1.7) * 0.55;
      let diff = targetAngle - currentAngle;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      const newAngle = currentAngle + diff * Math.min(1, dts * 0.45);
      m.vx = Math.cos(newAngle) * speed;
      m.vy = Math.sin(newAngle) * speed;

      m.x += m.vx * dts;
      m.y += m.vy * dts;
      const left = MESS_MARGIN_X + m.w / 2;
      const right = vw - MESS_MARGIN_X - m.w / 2;
      const top = MESS_MARGIN_TOP + m.h / 2;
      const bottom = vh - MESS_MARGIN_BOTTOM - m.h / 2;
      if (m.x < left) { m.x = left; m.vx = Math.abs(m.vx); }
      if (m.x > right) { m.x = right; m.vx = -Math.abs(m.vx); }
      if (m.y < top) { m.y = top; m.vy = Math.abs(m.vy); }
      if (m.y > bottom) { m.y = bottom; m.vy = -Math.abs(m.vy); }

      // keep the big "MESS" title in the center legible -- treat it as a solid obstacle
      const cxT = vw / 2, cyT = vh / 2;
      const dxT = m.x - cxT, dyT = m.y - cyT;
      const ot = TITLE_HALF_W + m.w / 2 - Math.abs(dxT);
      const oy2 = TITLE_HALF_H + m.h / 2 - Math.abs(dyT);
      if (ot > 0 && oy2 > 0) {
        if (ot < oy2) {
          const s = dxT < 0 ? -1 : 1;
          m.x = cxT + s * (TITLE_HALF_W + m.w / 2);
          m.vx = s * Math.max(Math.abs(m.vx), 6);
        } else {
          const s = dyT < 0 ? -1 : 1;
          m.y = cyT + s * (TITLE_HALF_H + m.h / 2);
          m.vy = s * Math.max(Math.abs(m.vy), 6);
        }
      }
    } else if (m.state === "exit") {
      m.t += dt / m.exitDur;
      if (m.t >= 1) {
        m.t = 0;
        m.state = "enter";
        const left = MESS_MARGIN_X + m.w / 2, right = vw - MESS_MARGIN_X - m.w / 2;
        const top = MESS_MARGIN_TOP + m.h / 2, bottom = vh - MESS_MARGIN_BOTTOM - m.h / 2;
        // reform on (roughly) the opposite side of the screen from where it burst
        const mirroredX = vw - m.breakX;
        const mirroredY = vh - m.breakY;
        m.x = Math.min(right, Math.max(left, mirroredX + (Math.random() - 0.5) * 70));
        m.y = Math.min(bottom, Math.max(top, mirroredY + (Math.random() - 0.5) * 70));
        const sp = 6 + Math.random() * 6;
        const ang = Math.random() * Math.PI * 2;
        m.vx = Math.cos(ang) * sp;
        m.vy = Math.sin(ang) * sp;
      }
    } else if (m.state === "enter") {
      m.t += dt / m.enterDur;
      if (m.t >= 1) {
        m.t = 1;
        m.state = "idle";
      }
    }
  });

  // axis-aligned collision, idle chips only -- a hard hit bursts both chips,
  // a soft one just bounces them apart (no more spontaneous popping)
  for (let i = 0; i < mess.length; i++) {
    const a = mess[i];
    if (a.state !== "idle") continue;
    for (let j = i + 1; j < mess.length; j++) {
      const b = mess[j];
      if (b.state !== "idle") continue;
      const dx = b.x - a.x, dy = b.y - a.y;
      const hwA = a.w / 2 + 5, hhA = a.h / 2 + 5;
      const hwB = b.w / 2 + 5, hhB = b.h / 2 + 5;
      const overlapX = hwA + hwB - Math.abs(dx);
      const overlapY = hhA + hhB - Math.abs(dy);
      if (overlapX <= 0 || overlapY <= 0) continue;

      // a chip actively held by the mouse acts as "infinite mass" -- it keeps
      // going exactly where the pointer takes it, the other one gets shoved
      const aFixed = !!a.dragging, bFixed = !!b.dragging;

      let nx = 0, ny = 0;
      if (overlapX < overlapY) {
        nx = dx < 0 ? -1 : 1;
        if (aFixed && !bFixed) b.x += nx * overlapX;
        else if (bFixed && !aFixed) a.x -= nx * overlapX;
        else if (!aFixed && !bFixed) { a.x -= nx * overlapX * 0.5; b.x += nx * overlapX * 0.5; }
      } else {
        ny = dy < 0 ? -1 : 1;
        if (aFixed && !bFixed) b.y += ny * overlapY;
        else if (bFixed && !aFixed) a.y -= ny * overlapY;
        else if (!aFixed && !bFixed) { a.y -= ny * overlapY * 0.5; b.y += ny * overlapY * 0.5; }
      }

      const rvx = b.vx - a.vx, rvy = b.vy - a.vy;
      const closingSpeed = Math.abs(rvx * nx + rvy * ny);

      if (closingSpeed > BREAK_SPEED_THRESHOLD) {
        // a hand-thrown collision bursts exactly like an ambient one
        const ix = (a.x + b.x) / 2, iy = (a.y + b.y) / 2;
        impacts.push({ x: ix, y: iy, start: now });
        [a, b].forEach((m) => {
          m.state = "exit";
          m.t = 0;
          m.breakX = m.x;
          m.breakY = m.y;
          m.dragging = false;
        });
      } else {
        const REST = 0.9;
        const avn = a.vx * nx + a.vy * ny;
        const bvn = b.vx * nx + b.vy * ny;
        if (!aFixed) { a.vx += (bvn - avn) * nx * REST; a.vy += (bvn - avn) * ny * REST; }
        if (!bFixed) { b.vx += (avn - bvn) * nx * REST; b.vy += (avn - bvn) * ny * REST; }
      }
    }
  }

  for (let i = impacts.length - 1; i >= 0; i--) {
    if (now - impacts[i].start > 460) impacts.splice(i, 1);
  }
}

// phase breakpoints -- scroll position IS the timeline
const P = {
  clutterPeak: 0.06,
  clutterSlow: 0.14,
  ingredients: 0.24,
  choosing: 0.40,
  making: 0.58,
  codeMoment: 0.66,
  intoFurnace: 0.80,
  furnace: 0.865,
  result: 1.0,
};

const CAPTIONS = [
  { text: "YOU DON'T NEED EVERYTHING.", p0: 0.04, p1: 0.13, y: 0.5, size: "clamp(28px,5vw,60px)" },
  { text: "LET'S SEE WHAT WE'VE GOT.", p0: 0.155, p1: 0.235, y: 0.16, size: "clamp(24px,4vw,46px)" },
  { text: "NOT EVERYTHING GOES IN.", p0: 0.245, p1: 0.30, y: 0.5, size: "clamp(24px,4vw,46px)" },
  { text: "RIGHT INGREDIENTS. RIGHT RECIPE.", p0: 0.355, p1: 0.415, y: 0.16, size: "clamp(22px,3.6vw,42px)" },
  { text: "BEAUTIFUL ISN'T ENOUGH.", p0: 0.585, p1: 0.625, y: 0.16, size: "clamp(24px,4vw,46px)" },
  { text: "IT HAS TO WORK.", p0: 0.625, p1: 0.665, y: 0.16, size: "clamp(24px,4vw,46px)", accent: "ember" },
  { text: "NOW WE TURN UP THE HEAT.", p0: 0.685, p1: 0.775, y: 0.16, size: "clamp(26px,4.4vw,52px)", accent: "ember" },
  { text: "LOOKS GOOD.", p0: 0.90, p1: 0.955, y: 0.42, size: "clamp(32px,6vw,72px)" },
  { text: "WORKS EVEN BETTER.", p0: 0.955, p1: 1.02, y: 0.42, size: "clamp(32px,6vw,72px)", accent: "temper" },
];

const STAGES = [
  [0, P.clutterSlow, "01 — THE MESS"],
  [P.clutterSlow, P.ingredients, "02 — THE CLUTTER"],
  [P.ingredients, P.choosing, "03 — THE INGREDIENTS"],
  [P.choosing, P.making, "04 — THE CHOICE"],
  [P.making, P.codeMoment, "05 — THE MAKING"],
  [P.codeMoment, P.intoFurnace, "06 — THE CODE"],
  [P.intoFurnace, P.furnace, "07 — INTO THE FURNACE"],
  [P.furnace, 0.93, "08 — THE FURNACE"],
  [0.93, 1.001, "09 — THE RESULT"],
];

export default function Story() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const stageLabelRef = useRef(null);
  const railRef = useRef(null);
  const capRefs = useRef([]);
  const meshTitleRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.font = "700 13px 'Manrope', sans-serif";
    const mess = MESS_ITEMS.map((text, i) => {
      const tw = ctx.measureText(text).width;
      const w = tw + 24, h = 26;
      const initAngle = seededRand(i, 6) * Math.PI * 2;
      const initSpeed = 6 + seededRand(i, 7) * 6;
      return {
        text,
        color: pickColor(i),
        x: (0.1 + seededRand(i, 1) * 0.8) * window.innerWidth,
        y: (0.16 + seededRand(i, 2) * 0.68) * window.innerHeight,
        vx: Math.cos(initAngle) * initSpeed,
        vy: Math.sin(initAngle) * initSpeed,
        phase: seededRand(i, 11) * Math.PI * 2,
        w, h,
        survives: i < 10,
        ingredientIdx: i < 10 ? i : -1,
        state: "idle",
        dragging: false,
        t: 0,
        breakX: 0, breakY: 0,
        exitDur: 480 + seededRand(i, 8) * 260,
        enterDur: 420 + seededRand(i, 9) * 220,
      };
    });
    const impacts = [];

    // 10 ingredient target positions: a loose arc
    const ingredientTargets = INGREDIENT_ITEMS.map((_, i) => {
      const a = (i / (INGREDIENT_ITEMS.length - 1) - 0.5) * 1.9;
      return { xFrac: 0.5 + Math.sin(a) * 0.36, yFrac: 0.5 + Math.cos(a) * 0.22 - 0.02 };
    });

    const draw = (p, now) => {
      const vw = window.innerWidth, vh = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const tw = Math.round(vw * dpr), th = Math.round(vh * dpr);
      if (canvas.width !== tw || canvas.height !== th) { canvas.width = tw; canvas.height = th; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // ---- background: black -> ember-dominant -> blue-violet-dominant ----
      const heat = smoothstep(P.intoFurnace, P.furnace, p) * (1 - smoothstep(P.furnace, 0.93, p));
      const resolved = smoothstep(0.9, 1.0, p);
      ctx.fillStyle = "#0A0A0A";
      ctx.fillRect(0, 0, vw, vh);
      if (heat > 0.01) {
        const g = ctx.createRadialGradient(vw / 2, vh / 2, 0, vw / 2, vh / 2, vw * 0.6);
        g.addColorStop(0, `rgba(255,74,28,${0.85 * heat})`);
        g.addColorStop(0.5, `rgba(255,74,28,${0.3 * heat})`);
        g.addColorStop(1, "rgba(255,74,28,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, vw, vh);
      }
      if (resolved > 0.01) {
        const g = ctx.createRadialGradient(vw / 2, vh / 2, 0, vw / 2, vh / 2, vw * 0.55);
        g.addColorStop(0, `rgba(74,95,232,${0.35 * resolved})`);
        g.addColorStop(1, "rgba(74,95,232,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, vw, vh);
      }

      ctx.save();
      const camScale = 1 + 0.05 * smoothstep(P.intoFurnace, P.furnace, p) - 0.03 * smoothstep(0.93, 1, p);
      ctx.translate(vw / 2, vh / 2);
      ctx.scale(camScale, camScale);
      ctx.translate(-vw / 2, -vh / 2);

      // ---- 01/02 THE MESS + CLUTTER: 16 items drift, collide, break and reform, then most vanish ----
      const clutterFade = smoothstep(P.clutterSlow, P.ingredients, p); // non-survivors disappear
      const toIngredient = smoothstep(P.clutterSlow + 0.03, P.ingredients, p); // survivors move to ingredient arc
      const ingredientOut = smoothstep(P.choosing - 0.06, P.choosing, p);

      ctx.font = "700 13px 'Manrope', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      mess.forEach((m) => {
        let x = m.x, y = m.y;
        const envelope = m.survives ? 1 - ingredientOut : 1 - clutterFade;
        if (envelope <= 0.01) return;

        const label = toIngredient > 0.5 && m.survives ? INGREDIENT_ITEMS[m.ingredientIdx] : m.text;
        const tw2 = ctx.measureText(label).width;
        const pad = 12, w = tw2 + pad * 2, h = 26;

        if (m.survives) {
          const target = ingredientTargets[m.ingredientIdx];
          x = lerp(x, target.xFrac * vw, toIngredient);
          y = lerp(y, target.yFrac * vh, toIngredient);
        }

        if (m.state === "idle") {
          const held = m.dragging;
          const breathe = held ? 1.12 : 1 + Math.sin(now * 0.0016 + m.phase) * 0.035;
          ctx.save();
          ctx.globalAlpha = envelope;
          ctx.translate(x, y);
          ctx.scale(breathe, breathe);
          roundRect(ctx, -w / 2, -h / 2, w, h, 999);
          if (held) {
            ctx.fillStyle = hexA(m.color, 0.16);
            ctx.fill();
          }
          ctx.strokeStyle = hexA(m.color, held ? 0.95 : m.survives ? 0.65 : 0.4);
          ctx.lineWidth = held ? 1.6 : 1;
          ctx.stroke();
          ctx.fillStyle = hexA(m.color, m.survives ? 0.95 : 0.68);
          ctx.fillText(label, 0, 1);
          ctx.restore();
          return;
        }

        if (m.state === "enter") {
          // reforming: a soft bubble blowing back into existence, gentle overshoot
          const t = smoothstep(0, 1, m.t);
          const scale = lerp(0.35, 1, t) * (1 + Math.sin(t * Math.PI) * 0.12);
          ctx.save();
          ctx.globalAlpha = t * envelope;
          ctx.translate(x, y);
          ctx.scale(scale, scale);
          roundRect(ctx, -w / 2, -h / 2, w, h, 999);
          ctx.strokeStyle = hexA(m.color, m.survives ? 0.65 : 0.4);
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fillStyle = hexA(m.color, m.survives ? 0.95 : 0.68);
          ctx.fillText(label, 0, 1);
          ctx.restore();
          return;
        }

        // state === "exit" -- a hot crack-and-burst: the chip flashes,
        // cracks along jagged fracture lines, throws a handful of ember
        // sparks, and is gone. Reads as heat/energy, not glass or bubbles.
        const t = smoothstep(0, 1, m.t);

        // the chip itself: gone almost immediately, with a brief hot shake first
        const pillAlpha = (1 - smoothstep(0, 0.22, t)) * envelope;
        if (pillAlpha > 0.01) {
          const shake = (1 - t / 0.22) * 2.2;
          const jx = Math.sin(t * 90 + m.phase * 5) * shake;
          const jy = Math.cos(t * 76 + m.phase * 3) * shake;
          ctx.save();
          ctx.globalAlpha = pillAlpha;
          ctx.translate(m.breakX + jx, m.breakY + jy);
          roundRect(ctx, -w / 2, -h / 2, w, h, 999);
          ctx.strokeStyle = hexA(m.color, m.survives ? 0.65 : 0.4);
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fillStyle = hexA(m.color, m.survives ? 0.95 : 0.68);
          ctx.fillText(label, 0, 1);
          ctx.restore();
        }

        // ignition flash at the point of impact
        const flashT = clamp01(t / 0.2);
        const flashAlpha = (1 - flashT) * envelope;
        if (flashAlpha > 0.02) {
          ctx.globalAlpha = flashAlpha * 0.9;
          ctx.fillStyle = "#FFB199";
          ctx.beginPath();
          ctx.arc(m.breakX, m.breakY, lerp(3, 14, flashT), 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = flashAlpha * 0.6;
          ctx.strokeStyle = "#FF4A1C";
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(m.breakX, m.breakY, lerp(6, 24, flashT), 0, Math.PI * 2);
          ctx.stroke();
        }

        // jagged fracture lines shooting outward
        const crackAlpha = (1 - smoothstep(0.28, 0.7, t)) * envelope;
        if (crackAlpha > 0.01) {
          const CRACKS = 5;
          ctx.strokeStyle = "#FF4A1C";
          ctx.lineWidth = 1.1;
          ctx.globalAlpha = crackAlpha;
          for (let k = 0; k < CRACKS; k++) {
            const ang = (k / CRACKS) * Math.PI * 2 + m.phase;
            const len = lerp(4, 26 + (k % 2) * 10, t);
            const midLen = len * 0.55;
            const kink = 4 * (k % 2 === 0 ? 1 : -1);
            const mx = m.breakX + Math.cos(ang) * midLen + Math.cos(ang + Math.PI / 2) * kink;
            const my = m.breakY + Math.sin(ang) * midLen + Math.sin(ang + Math.PI / 2) * kink;
            const ex = m.breakX + Math.cos(ang) * len;
            const ey = m.breakY + Math.sin(ang) * len;
            ctx.beginPath();
            ctx.moveTo(m.breakX, m.breakY);
            ctx.lineTo(mx, my);
            ctx.lineTo(ex, ey);
            ctx.stroke();
          }
        }

        // ember sparks: short hot streaks flying outward and drifting up, then gone
        const sparkAlpha = (1 - t) * envelope;
        if (sparkAlpha > 0.02) {
          const SPARKS = 8;
          for (let k = 0; k < SPARKS; k++) {
            const ang = (k / SPARKS) * Math.PI * 2 + m.phase * 1.3;
            const spread = 0.7 + 0.3 * Math.sin(k * 2.3 + m.phase);
            const dist = lerp(3, 38 * spread, t);
            const cx = m.breakX + Math.cos(ang) * dist;
            const cy = m.breakY + Math.sin(ang) * dist - t * 10; // heat rises
            const tailX = cx - Math.cos(ang) * 6;
            const tailY = cy - Math.sin(ang) * 6 + t * 4;
            ctx.globalAlpha = sparkAlpha * (k % 3 === 0 ? 0.95 : 0.7);
            ctx.strokeStyle = k % 3 === 0 ? "#FFB199" : "#FF4A1C";
            ctx.lineWidth = lerp(1.6, 0.4, t);
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(cx, cy);
            ctx.stroke();
          }
        }
      });
      ctx.globalAlpha = 1;

      // impact rings: a quick, on-brand (no gradient fill) pulse at the point of collision
      if (impacts.length) {
        const impactEnvelope = 1 - clutterFade;
        impacts.forEach((imp) => {
          const life = clamp01((now - imp.start) / 460);
          if (life >= 1) return;
          const ease = 1 - Math.pow(1 - life, 2);
          ctx.lineWidth = 1.3;
          ctx.strokeStyle = hexA("#FF4A1C", (1 - ease) * 0.75 * impactEnvelope);
          ctx.beginPath();
          ctx.arc(imp.x, imp.y, lerp(3, 44, ease), 0, Math.PI * 2);
          ctx.stroke();
          ctx.strokeStyle = hexA("#FFB199", (1 - ease) * 0.55 * impactEnvelope);
          ctx.beginPath();
          ctx.arc(imp.x, imp.y, lerp(2, 24, ease), 0, Math.PI * 2);
          ctx.stroke();
        });
      }

      // ---- 04 THE CHOICE: 5 of the 10 get selected, relabeled, pulled to center ----
      const chooseT = smoothstep(P.choosing, P.making - 0.05, p);
      const chosenFadeIn = smoothstep(P.choosing - 0.02, P.choosing + 0.06, p);
      if (chosenFadeIn > 0.01) {
        ctx.font = "800 15px 'Manrope', sans-serif";
        CHOSEN_IDX.forEach((ingIdx, ci) => {
          const home = ingredientTargets[ingIdx];
          const angle = (ci / CHOSEN_LABELS.length) * Math.PI * 2 - Math.PI / 2;
          const cx = vw / 2 + Math.cos(angle) * lerp(0, 92, chooseT);
          const cy = vh / 2 + Math.sin(angle) * lerp(0, 92, chooseT) * 0.7;
          const x = lerp(home.xFrac * vw, cx, chooseT);
          const y = lerp(home.yFrac * vh, cy, chooseT);
          const label = chooseT > 0.5 ? CHOSEN_LABELS[ci] : INGREDIENT_ITEMS[ingIdx];
          ctx.globalAlpha = chosenFadeIn * (1 - smoothstep(P.codeMoment, P.intoFurnace, p));
          const tw2 = ctx.measureText(label).width;
          const w = tw2 + 26, h = 30;
          roundRect(ctx, x - w / 2, y - h / 2, w, h, 999);
          ctx.fillStyle = "#FF4A1C";
          ctx.globalAlpha *= 0.14;
          ctx.fill();
          ctx.globalAlpha = chosenFadeIn * (1 - smoothstep(P.codeMoment, P.intoFurnace, p));
          ctx.strokeStyle = "#FF4A1C";
          ctx.lineWidth = 1.4;
          ctx.stroke();
          ctx.fillStyle = "#FFFFFF";
          ctx.fillText(label, x, y + 1);
        });
        ctx.globalAlpha = 1;
      }

      // ---- 05/06 THE MAKING + CODE MOMENT: one central shape morphs through the pipeline ----
      const makeT = smoothstep(P.making, P.codeMoment, p); // idea -> wireframe -> ui -> code -> interface
      const codeT = smoothstep(P.codeMoment, P.codeMoment + 0.05, p) * (1 - smoothstep(P.intoFurnace - 0.03, P.intoFurnace, p));
      const centerVisible = smoothstep(P.making - 0.04, P.making + 0.03, p) * (1 - smoothstep(P.intoFurnace - 0.02, P.intoFurnace + 0.06, p));
      if (centerVisible > 0.01) {
        const cx = vw / 2, cy = vh / 2;
        ctx.globalAlpha = centerVisible;
        if (makeT < 0.22) {
          // idea: a soft pulsing circle
          const r = lerp(22, 30, makeT / 0.22);
          ctx.fillStyle = "rgba(255,255,255,0.12)";
          ctx.beginPath(); ctx.arc(cx, cy, r + 10, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
        } else if (makeT < 0.48) {
          // wireframe: dashed grid rectangle
          const t = (makeT - 0.22) / 0.26;
          const w = lerp(70, 200, t), h = lerp(70, 130, t);
          ctx.strokeStyle = "rgba(255,255,255,0.7)";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([6, 5]);
          roundRect(ctx, cx - w / 2, cy - h / 2, w, h, 6);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.strokeStyle = "rgba(255,255,255,0.25)";
          ctx.beginPath(); ctx.moveTo(cx - w / 2, cy - h / 6); ctx.lineTo(cx + w / 2, cy - h / 6); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx - w / 2, cy + h / 6); ctx.lineTo(cx + w / 2, cy + h / 6); ctx.stroke();
        } else if (makeT < 0.72) {
          // ui component: a real card
          const t = (makeT - 0.48) / 0.24;
          const w = 200, h = 130;
          roundRect(ctx, cx - w / 2, cy - h / 2, w, h, 12);
          ctx.fillStyle = "#16161A";
          ctx.fill();
          ctx.save();
          roundRect(ctx, cx - w / 2, cy - h / 2, w, h, 12);
          ctx.clip();
          ctx.fillStyle = "#FF4A1C";
          ctx.fillRect(cx - w / 2, cy - h / 2, w, h * lerp(0.25, 0.32, t));
          ctx.fillStyle = "rgba(255,255,255,0.16)";
          ctx.fillRect(cx - w / 2 + 14, cy - h / 2 + h * 0.45, w - 28, 8);
          ctx.fillRect(cx - w / 2 + 14, cy - h / 2 + h * 0.62, (w - 28) * 0.6, 8);
          ctx.restore();
        } else {
          // code fragment -> functioning interface
          const w = 210, h = 136;
          const dissolve = Math.sin(clamp01(codeT) * Math.PI); // pops during code moment, settles after
          if (dissolve > 0.06) {
            ctx.font = "13px 'Courier New', monospace";
            ctx.fillStyle = "rgba(255,255,255,0.55)";
            CODE_GLYPHS.forEach((g, gi) => {
              const gx = cx + Math.cos(gi * 1.4 + p * 4) * (60 + gi * 14) * dissolve;
              const gy = cy + Math.sin(gi * 1.7 + p * 4) * (40 + gi * 10) * dissolve;
              ctx.globalAlpha = centerVisible * dissolve;
              ctx.fillText(g, gx, gy);
            });
            ctx.globalAlpha = centerVisible;
          }
          const solid = 1 - dissolve * 0.85;
          roundRect(ctx, cx - w / 2, cy - h / 2, w, h, 12);
          ctx.fillStyle = "#16161A";
          ctx.globalAlpha = centerVisible * solid;
          ctx.fill();
          ctx.save();
          roundRect(ctx, cx - w / 2, cy - h / 2, w, h, 12);
          ctx.clip();
          ctx.fillStyle = "#FF4A1C";
          ctx.fillRect(cx - w / 2, cy - h / 2, w, h * 0.24);
          for (let k = 0; k < 3; k++) {
            ctx.fillStyle = "rgba(255,255,255,0.16)";
            ctx.fillRect(cx - w / 2 + 16, cy - h / 2 + h * 0.36 + k * 18, k === 2 ? (w - 32) * 0.55 : w - 32, 8);
          }
          ctx.restore();
          ctx.globalAlpha = centerVisible;
        }
      }

      // ---- 07 INTO THE FURNACE: everything left compresses toward center, ember dominant ----
      const compress = smoothstep(P.intoFurnace, P.furnace, p);
      if (compress > 0.01) {
        ctx.globalAlpha = compress * (1 - smoothstep(0.9, 0.94, p));
        const r = lerp(160, 8, compress);
        const g = ctx.createRadialGradient(vw / 2, vh / 2, 0, vw / 2, vh / 2, r + 40);
        g.addColorStop(0, "#FFB199");
        g.addColorStop(0.4, "#FF4A1C");
        g.addColorStop(1, "rgba(255,74,28,0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(vw / 2, vh / 2, r + 40, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      }

      // ---- 09 OUT THE OTHER SIDE: calm, resolved, blue-violet interface ----
      const finalIn = smoothstep(0.9, 0.98, p);
      if (finalIn > 0.01) {
        const cx = vw / 2, cy = vh / 2;
        const w = lerp(0, 260, finalIn), h = lerp(0, 168, finalIn);
        ctx.globalAlpha = finalIn;
        roundRect(ctx, cx - w / 2, cy - h / 2, w, h, 14);
        ctx.fillStyle = "#16161A";
        ctx.fill();
        ctx.save();
        roundRect(ctx, cx - w / 2, cy - h / 2, w, h, 14);
        ctx.clip();
        ctx.fillStyle = "#4A5FE8";
        ctx.fillRect(cx - w / 2, cy - h / 2, w, h * 0.26);
        for (let k = 0; k < 3; k++) {
          ctx.fillStyle = "rgba(255,255,255,0.18)";
          ctx.fillRect(cx - w / 2 + 18, cy - h / 2 + h * 0.42 + k * 20, k === 2 ? (w - 36) * 0.5 : w - 36, 9);
        }
        ctx.restore();
        ctx.globalAlpha = 1;
      }

      ctx.restore();

      // ---- captions (real DOM text for crispness) ----
      capRefs.current.forEach((el, i) => {
        if (!el) return;
        const c = CAPTIONS[i];
        const m = Math.min(0.02, (c.p1 - c.p0) / 3);
        const o = smoothstep(c.p0, c.p0 + m, p) * (1 - smoothstep(c.p1 - m, c.p1, p));
        el.style.opacity = o.toFixed(3);
      });

      if (railRef.current) railRef.current.style.height = (p * 100).toFixed(1) + "%";
      const stage = STAGES.find((s) => p >= s[0] && p < s[1]) || STAGES[STAGES.length - 1];
      if (stageLabelRef.current && stageLabelRef.current.textContent !== stage[2]) {
        stageLabelRef.current.textContent = stage[2];
      }

      // the word "MESS" sits calm in the center while the chips swirl around it
      if (meshTitleRef.current) {
        const titleOpacity =
          smoothstep(0, 0.03, p) * (1 - smoothstep(P.clutterSlow, P.ingredients, p));
        meshTitleRef.current.style.opacity = titleOpacity.toFixed(3);
      }
    };

    const computeProgress = () => {
      const rect = wrapper.getBoundingClientRect();
      const total = wrapper.offsetHeight - window.innerHeight;
      if (total <= 0) return 0;
      return clamp01(-rect.top / total);
    };

    // ---- drag-to-move: pick up a chip with the mouse (or a finger) and fling it ----
    let drag = null; // { item, pointerId, lastX, lastY, lastT }

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const hitTest = (x, y) => {
      for (let i = mess.length - 1; i >= 0; i--) {
        const m = mess[i];
        if (m.state !== "idle" || m.dragging) continue;
        if (Math.abs(x - m.x) <= m.w / 2 + 4 && Math.abs(y - m.y) <= m.h / 2 + 4) return m;
      }
      return null;
    };
    const meshActive = () => 1 - smoothstep(P.clutterSlow, P.ingredients + 0.03, computeProgress()) > 0.02;

    const onPointerDown = (e) => {
      if (!meshActive()) return;
      const { x, y } = getPos(e);
      const hit = hitTest(x, y);
      if (!hit) return;
      // stop the browser's own drag/scroll gesture from taking over *before*
      // touching any optional API -- some sandboxed embeds (e.g. an Artifact
      // preview iframe) disallow setPointerCapture, and that must not skip this
      e.preventDefault();
      drag = { item: hit, pointerId: e.pointerId, lastX: x, lastY: y, lastT: performance.now() };
      hit.dragging = true;
      canvas.style.cursor = "grabbing";
      try { canvas.setPointerCapture(e.pointerId); } catch { /* capture is a nice-to-have, not required */ }
    };
    const onPointerMove = (e) => {
      if (!drag || e.pointerId !== drag.pointerId) {
        if (!drag) {
          const { x, y } = getPos(e);
          canvas.style.cursor = meshActive() && hitTest(x, y) ? "grab" : "default";
        }
        return;
      }
      const { x, y } = getPos(e);
      const now = performance.now();
      const dt = Math.max(1, now - drag.lastT);
      const m = drag.item;
      m.vx = ((x - drag.lastX) / dt) * 1000;
      m.vy = ((y - drag.lastY) / dt) * 1000;
      m.x = x;
      m.y = y;
      drag.lastX = x; drag.lastY = y; drag.lastT = now;
      e.preventDefault();
    };
    const endDrag = (e) => {
      if (!drag || (e && e.pointerId !== undefined && e.pointerId !== drag.pointerId)) return;
      drag.item.dragging = false;
      const sp = Math.hypot(drag.item.vx, drag.item.vy);
      const maxSp = 34;
      if (sp > maxSp) {
        const k = maxSp / sp;
        drag.item.vx *= k; drag.item.vy *= k;
      }
      try { canvas.releasePointerCapture(drag.pointerId); } catch { /* noop */ }
      drag = null;
      canvas.style.cursor = "default";
    };

    canvas.style.touchAction = "none";
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    // continuous frame loop -- lets the mess drift and collide even while the
    // page isn't scrolling, while everything else stays driven by scroll progress
    let rafId;
    let lastT = performance.now();
    const loop = (t) => {
      const dt = Math.min(48, t - lastT || 16);
      lastT = t;
      const p = computeProgress();
      const meshWeight = 1 - smoothstep(P.clutterSlow, P.ingredients + 0.03, p);
      if (meshWeight > 0.02) {
        stepMessPhysics(mess, dt, t, window.innerWidth, window.innerHeight, impacts);
        // if the chip being held just burst from a collision, release the drag
        if (drag && drag.item.state !== "idle") {
          try { canvas.releasePointerCapture(drag.pointerId); } catch { /* noop */ }
          drag = null;
          canvas.style.cursor = "default";
        }
      }
      draw(p, t);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    const onResize = () => draw(computeProgress(), performance.now());
    window.addEventListener("resize", onResize);
    if (document.fonts?.ready) document.fonts.ready.then(() => draw(computeProgress(), performance.now())).catch(() => {});

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, []);

  return (
    <section id="furnace" data-testid="story" className="relative bg-forge" style={{ height: "420vh" }} ref={wrapRef}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-forge">
        {/* scroll-as-timeline rail */}
        <div className="absolute bottom-0 right-7 top-0 z-10 w-[2px] bg-white/10">
          <div ref={railRef} className="w-full bg-ember" style={{ height: "0%" }} />
        </div>
        <div ref={stageLabelRef} className="absolute left-8 top-8 z-10 text-[11px] font-extrabold uppercase tracking-[0.25em] text-white/45">
          01 — THE MESS
        </div>
        <div className="absolute right-11 top-8 z-10 text-[11px] font-bold uppercase tracking-[0.2em] text-white/25">SCROLL</div>

        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        <div
          ref={meshTitleRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[clamp(4.5rem,20vw,15rem)] font-extrabold uppercase leading-none tracking-tight opacity-0"
          style={{ color: "rgba(255, 74, 28, 0.14)" }}
        >
          MESS
        </div>

        {CAPTIONS.map((c, i) => (
          <div
            key={i}
            ref={(el) => (capRefs.current[i] = el)}
            className="pointer-events-none absolute left-1/2 w-[min(90%,900px)] -translate-x-1/2 -translate-y-1/2 text-center font-extrabold uppercase leading-[1.05] text-white opacity-0"
            style={{
              top: `${c.y * 100}%`,
              fontSize: c.size,
              textShadow: "0 6px 34px rgba(0,0,0,0.85), 0 2px 8px rgba(0,0,0,0.9)",
              color: c.accent === "ember" ? "#FF4A1C" : c.accent === "temper" ? "#4A5FE8" : "#FFFFFF",
            }}
          >
            {c.text}
          </div>
        ))}
      </div>
    </section>
  );
}
