import { ArrowRight } from "lucide-react";
import { MaskedLine } from "@/components/Shared";
import { scrollToId } from "@/lib/scroll";

export default function FinalCTA({ onStart }) {
  return (
    <section
      id="contact"
      data-testid="final-cta-section"
      className="relative overflow-hidden pt-32 md:pt-52"
    >
      <div className="mx-auto max-w-[110rem] px-6 text-center md:px-10">
        <div className="mb-10 flex items-center justify-center gap-3">
          <span className="h-2 w-2 bg-temper" />
          <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-white/40">
            Out of the oven
          </span>
        </div>
        <h2 className="text-[clamp(2.6rem,8.5vw,9rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.02em]">
          <MaskedLine>Got good ingredients?</MaskedLine>
          <MaskedLine delay={0.15}>
            <span className="text-temper">Let’s make something people want.</span>
          </MaskedLine>
        </h2>
        <p className="mx-auto mt-10 max-w-md text-base font-medium text-white/55 md:text-lg">
          Brand. Website. Visibility. Customers.
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
          <button
            data-testid="final-start-project"
            onClick={onStart}
            className="group flex items-center gap-3 bg-temper px-8 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:bg-white hover:text-forge"
          >
            Start a project
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <button
            data-testid="final-see-work"
            onClick={() => scrollToId("work")}
            className="group flex items-center gap-3 border border-white/20 px-8 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white/70 transition-colors duration-300 hover:border-white hover:text-white"
          >
            See our work
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      <footer className="mt-28 border-t border-white/10 md:mt-40" data-testid="footer">
        <div className="select-none overflow-hidden px-2 pt-8 text-center" aria-hidden="true">
          <div className="text-outline-faint text-[19vw] font-extrabold uppercase leading-[0.82] tracking-tight">
            Furnace
          </div>
        </div>
        <div className="mx-auto flex max-w-[110rem] flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row md:px-10">
          <a
            data-testid="footer-email"
            href="mailto:hello@furnace.studio"
            className="text-sm font-bold uppercase tracking-[0.2em] text-white/70 transition-colors duration-300 hover:text-temper"
          >
            hello@furnace.studio
          </a>
          <div className="flex items-center gap-8">
            {["work", "services", "process", "about"].map((id) => (
              <button
                key={id}
                data-testid={`footer-link-${id}`}
                onClick={() => scrollToId(id)}
                className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/35 transition-colors duration-300 hover:text-white"
              >
                {id}
              </button>
            ))}
          </div>
          <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-white/30">
            © 2026 Furnace — Raw to ready
          </span>
        </div>
      </footer>
    </section>
  );
}
