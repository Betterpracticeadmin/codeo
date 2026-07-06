import { Reveal } from "./Reveal";

const SERVICES = [
  "Sites vitrines",
  "Portfolios",
  "Sites pour restaurants",
  "Sites pour artisans",
  "Sites premium",
  "Landing pages",
  "Identité digitale",
];

export function About() {
  return (
    <section id="apropos" className="bg-green text-cream">
      <div className="container-x py-28 md:py-40">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <p className="text-sm uppercase tracking-[0.3em] text-cream/50">
                À propos
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-8">
            <Reveal>
              <h2 className="text-[clamp(1.8rem,4vw,3.2rem)] font-bold leading-tight tracking-tightest text-red">
                CODAIX conçoit des sites web sur mesure, rapides et élégants —
                pensés pour convertir.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-2xl text-lg text-cream/70">
                Nous accompagnons les commerces, artisans et marques qui veulent
                une présence en ligne à la hauteur de leur travail. Chaque projet
                est unique — jamais de template.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <ul className="mt-12 grid gap-x-8 sm:grid-cols-2">
                {SERVICES.map((s) => (
                  <li
                    key={s}
                    className="flex items-center gap-3 border-b border-cream/15 py-3 text-lg text-cream"
                  >
                    <span className="text-red">—</span>
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
