import { Reveal } from "./Reveal";
import { PROJECTS } from "@/lib/projects";

export function Work() {
  return (
    <section id="realisations" className="container-x py-28 md:py-40">
      <Reveal>
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cream/50">
          Réalisations
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mb-16 text-[clamp(1.8rem,4vw,3.2rem)] font-bold tracking-tightest text-red">
          Une sélection de projets.
        </h2>
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.title} delay={(i % 3) * 0.08} className="h-full">
            <div className="group relative aspect-[4/5] cursor-pointer overflow-hidden border border-cream/15 bg-greenlight/20">
              <div className="absolute inset-0 translate-y-full bg-red transition-transform duration-700 ease-premium group-hover:translate-y-0" />
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                <span className="relative z-10 text-sm text-cream/50 transition-colors duration-500 group-hover:text-ink/70">
                  {p.year}
                </span>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-cream transition-colors duration-500 group-hover:text-ink">
                    {p.title}
                  </h3>
                  <p className="text-cream/50 transition-colors duration-500 group-hover:text-ink/70">
                    {p.category}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
