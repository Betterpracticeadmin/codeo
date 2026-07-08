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
            <a
              href={p.href || "#"}
              target={p.href ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group relative block aspect-[4/5] overflow-hidden border border-cream/15 bg-greenlight/20"
            >
              {/* Aperçu en direct du vrai site */}
              {p.href && (
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <iframe
                    src={p.href}
                    title={p.title}
                    loading="lazy"
                    tabIndex={-1}
                    aria-hidden
                    className="absolute left-0 top-0 h-[1125px] w-[900px] origin-top-left scale-[0.5] border-0"
                  />
                </div>
              )}

              {/* Voile jaune au survol */}
              <div className="absolute inset-0 translate-y-full bg-red transition-transform duration-700 ease-premium group-hover:translate-y-0" />

              {/* Textes */}
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                <span className="relative z-10 text-sm text-cream/60 mix-blend-difference transition-colors duration-500 group-hover:text-ink/70 group-hover:mix-blend-normal">
                  {p.year}
                </span>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-cream mix-blend-difference transition-colors duration-500 group-hover:text-ink group-hover:mix-blend-normal">
                    {p.title}
                  </h3>
                  <p className="text-cream/70 mix-blend-difference transition-colors duration-500 group-hover:text-ink/70 group-hover:mix-blend-normal">
                    {p.category}
                  </p>
                  <span className="mt-3 inline-block text-sm font-semibold text-ink opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    Voir le site →
                  </span>
                </div>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
