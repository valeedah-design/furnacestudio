import { useEffect, useState } from "react";
import { scrollToId } from "@/lib/scroll";

const LINKS = [
  { id: "work", label: "WORK" },
  { id: "services", label: "SERVICES" },
  { id: "process", label: "PROCESS" },
  { id: "about", label: "ABOUT" },
  { id: "contact", label: "CONTACT" },
];

export default function Nav({ onStart }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    LINKS.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) obs.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "border-b border-white/5 bg-forge/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[110rem] items-center justify-between px-6 py-4 md:px-10 md:py-5">
        <button
          data-testid="nav-logo"
          onClick={() => scrollToId("top")}
          className="flex items-center gap-2 text-base font-extrabold uppercase tracking-[0.35em] text-white md:text-lg"
        >
          Furnace
          <span className="mt-0.5 inline-block h-1.5 w-1.5 bg-ember" />
        </button>
        <div className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <button
              key={l.id}
              data-testid={`nav-link-${l.id}`}
              onClick={() => scrollToId(l.id)}
              className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] transition-colors duration-300 ${
                active === l.id ? "text-white" : "text-white/35 hover:text-white"
              }`}
            >
              <span
                className={`h-1 w-1 transition-colors duration-300 ${
                  active === l.id
                    ? l.id === "contact" || l.id === "work"
                      ? "bg-temper"
                      : "bg-ember"
                    : "bg-transparent"
                }`}
              />
              {l.label}
            </button>
          ))}
        </div>
        <button
          data-testid="nav-start-project"
          onClick={onStart}
          className="bg-ember px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-white hover:text-forge"
        >
          Start a project
        </button>
      </nav>
    </header>
  );
}
