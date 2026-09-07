import { MaskedLine, SectionLabel } from "@/components/Shared";

const PEOPLE = [
  {
    n: "01",
    name: "MARA VOSS",
    role: "Creative Director",
    bio: "Fifteen years making local businesses look like they mean it.",
  },
  {
    n: "02",
    name: "DENIZ KAYA",
    role: "Lead Developer",
    bio: "Obsessed with speed. Allergic to templates.",
  },
  {
    n: "03",
    name: "TOM REILLY",
    role: "Strategy & Growth",
    bio: "Asks why until the real answer shows up.",
  },
];

export default function Team() {
  return (
    <section
      id="about"
      data-testid="team-section"
      className="mx-auto max-w-[110rem] px-6 py-32 md:px-10 md:py-48"
    >
      <SectionLabel>Who's doing it</SectionLabel>
      <h2 className="text-[clamp(2.2rem,6.4vw,6.2rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">
        <MaskedLine>No big agency machine.</MaskedLine>
        <MaskedLine delay={0.12}>
          Just <span className="text-outline">people who care</span>
        </MaskedLine>
        <MaskedLine delay={0.24}>about the work.</MaskedLine>
      </h2>
      <p className="mt-8 max-w-md text-base font-medium text-white/50">
        You talk to the people actually doing it. No account managers relaying
        messages, no committee. Just us, your project, and a deadline.
      </p>

      <div className="mt-20 border-b border-white/10">
        {PEOPLE.map((p) => (
          <div
            key={p.n}
            data-testid={`team-member-${p.name.toLowerCase().replace(/\s/g, "-")}`}
            className="group grid items-baseline gap-2 border-t border-white/10 py-8 transition-colors duration-300 md:grid-cols-[80px_1.2fr_1fr] md:gap-8 md:py-10"
          >
            <span className="text-[11px] font-bold tracking-[0.3em] text-temper/70 transition-colors duration-300 group-hover:text-temper">
              {p.n}
            </span>
            <div>
              <div className="text-2xl font-extrabold uppercase tracking-tight transition-transform duration-500 group-hover:translate-x-3 md:text-5xl">
                {p.name}
              </div>
              <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white/40">
                {p.role}
              </div>
            </div>
            <p className="max-w-md text-base font-medium text-white/50 transition-colors duration-300 group-hover:text-white/75">
              {p.bio}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
