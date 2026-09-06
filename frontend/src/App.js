import { useEffect, useState } from "react";
import Lenis from "lenis";
import "@/index.css";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import SystemDiagram from "@/components/SystemDiagram";
import Process from "@/components/Process";
import Manifesto from "@/components/Manifesto";
import Services from "@/components/Services";
import CaseStudies from "@/components/CaseStudies";
import Compare from "@/components/Compare";
import Team from "@/components/Team";
import FinalCTA from "@/components/FinalCTA";
import ContactModal from "@/components/ContactModal";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const [contactOpen, setContactOpen] = useState(false);
  const openContact = () => setContactOpen(true);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09 });
    window.__lenis = lenis;
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return (
    <div className="bg-forge font-manrope text-white antialiased">
      <div
        aria-hidden="true"
        className="grain-overlay pointer-events-none fixed inset-0 z-[4] opacity-[0.05]"
      />
      <Nav onStart={openContact} />
      <main>
        <Hero onStart={openContact} />
        <Problem />
        <SystemDiagram />
        <Process />
        <Manifesto />
        <Services />
        <CaseStudies />
        <Compare onStart={openContact} />
        <Team />
        <FinalCTA onStart={openContact} />
      </main>
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}

export default App;
