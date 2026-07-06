import { Reveal } from "./Reveal";

const POINTS = [
  { t: "Design sur mesure", d: "Aucun template. Un site pensé pour votre marque." },
  { t: "Rapidité", d: "Livraison en quelques jours, pas en quelques mois." },
  { t: "Responsive", d: "Parfait sur mobile, tablette et ordinateur." },
];

export function Why() {
  return (
    <section id="pourquoi" className="bg-green text-cream">
      <div className="container-x py-28 md:py-40">
        <Reveal>
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cream/50">
            Pourquoi travailler avec nous
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="text-[clamp(1.8rem,4vw,3.2rem)] font-bold tracking-tightest text-red">
            Ce qui fait la différence.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {POINTS.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.08} className="h-full">
              <div className="h-full border border-cream/15 p-8">
                <div className="text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-none tracking-tightest text-red">
                  0{i + 1}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-cream">{p.t}</h3>
                <p className="mt-2 text-cream/60">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
