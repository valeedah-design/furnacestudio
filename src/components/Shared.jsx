import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export const EASE = [0.16, 1, 0.3, 1];

export const MaskedLine = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  return (
    <span ref={ref} className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block will-change-transform"
        initial={{ y: "112%" }}
        animate={inView ? { y: 0 } : { y: "112%" }}
        transition={{ delay, duration: 0.95, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
};

export const SectionLabel = ({ children, tone = "ember" }) => (
  <div className="mb-10 flex items-center gap-3" data-testid="section-label">
    <span className={`h-2 w-2 ${tone === "temper" ? "bg-temper" : "bg-ember"}`} />
    <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-white/40">
      {children}
    </span>
  </div>
);
