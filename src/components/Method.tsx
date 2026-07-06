import { Reveal } from "./Reveal";

const STEPS = [
  { n: "01", t: "Prise de contact", d: "On échange sur vos besoins, votre univers et vos objectifs." },
  { n: "02", t: "Analyse du projet", d: "On définit la structure, le contenu et la direction artistique." },
  { n: "03", t: "Maquette", d: "Vous validez le design avant tout développement." },
  { n: "04", t: "Développement", d: "Un site rapide, responsive et optimisé pour le SEO." },
  { n: "05", t: "Livraison", d: "Mise en ligne, nom de domaine et accompagnement." },
];

export function Method() {
  return (
    <section id="methode" className="bg-green text-cream">
      <div className="container-x py-28 md:py-40">
        <Reveal>
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cream/50">
            Notre méthode
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mb-16 max-w-3xl text-[clamp(1.8rem,4vw,3.2rem)] font-bold tracking-tightest text-red">
            Un processus clair, du premier échange à la mise en ligne.
          </h2>
        </Reveal>

        <div className="border-t border-cream/25">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.05}>
              <div className="group grid items-center gap-2 border-b border-cream/15 py-8 transition-colors duration-500 hover:bg-cream/5 md:grid-cols-12 md:gap-8">
                <div className="text-[clamp(3rem,10vw,8rem)] font-extrabold leading-none tracking-tightest text-red md:col-span-4">
                  {s.n}
                </div>
                <h3 className="text-2xl font-semibold text-cream md:col-span-4">
                  {s.t}
                </h3>
                <p className="text-lg text-cream/60 md:col-span-4">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
