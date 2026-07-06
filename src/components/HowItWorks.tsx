import { Reveal } from "./Reveal";

const CODAIX = [
  "Le design sur mesure",
  "Tout le code du site",
  "La mise en ligne et l'hébergement",
  "Les optimisations (SEO, mobile, vitesse)",
];
const CLIENT = [
  "Le nom de domaine (ex : votrecommerce.fr) — on vous guide",
  "Votre logo, vos photos et vos textes",
];

const LEXIQUE = [
  {
    t: "Le nom de domaine",
    d: "L'adresse de votre site (ex : votrecommerce.fr). Vous en êtes propriétaire, environ 15 € par an. On vous accompagne pour l'obtenir.",
  },
  {
    t: "L'hébergement",
    d: "L'espace où votre site « vit » pour être visible 24h/24. On s'en occupe — souvent gratuit pour un site vitrine.",
  },
  {
    t: "La mise en ligne",
    d: "On publie votre site et on connecte votre nom de domaine. Vous n'avez rien de technique à faire.",
  },
];

const STEPS = [
  { n: "48h", t: "Première maquette", d: "Vous voyez votre futur site très vite." },
  { n: "→", t: "Vos retours", d: "On ajuste jusqu'à ce que ce soit parfait." },
  { n: "✓", t: "En ligne", d: "Publié en quelques jours, pas en quelques mois." },
];

export function HowItWorks() {
  return (
    <section id="fonctionnement" className="container-x py-28 md:py-40">
      <Reveal>
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cream/50">
          Comment ça marche
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="max-w-4xl text-[clamp(1.8rem,4vw,3.2rem)] font-bold leading-tight tracking-tightest text-red">
          On code votre site. Vous n'avez rien de technique à gérer.
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-6 max-w-2xl text-lg text-cream/70">
          Notre façon de travailler est simple : on s'occupe de toute la partie
          technique, vous gardez la main sur votre marque.
        </p>
      </Reveal>

      {/* Qui fait quoi */}
      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <div className="border border-cream/15 bg-greenlight/25 p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-cream/50">
            CODAIX s'occupe de
          </p>
          <ul className="mt-6 space-y-3">
            {CODAIX.map((x) => (
              <li key={x} className="flex items-start gap-3 text-lg text-cream">
                <span aria-hidden className="mt-1 text-sm text-red">
                  ●
                </span>
                {x}
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-cream/15 bg-greenlight/25 p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-cream/50">
            De votre côté
          </p>
          <ul className="mt-6 space-y-3">
            {CLIENT.map((x) => (
              <li key={x} className="flex items-start gap-3 text-lg text-cream">
                <span aria-hidden className="mt-1 text-sm text-cream/40">
                  ○
                </span>
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Lexique clair */}
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {LEXIQUE.map((l, i) => (
          <Reveal key={l.t} delay={i * 0.08} className="h-full">
            <div className="h-full border border-cream/15 p-8">
              <h3 className="text-xl font-semibold text-cream">{l.t}</h3>
              <p className="mt-3 text-cream/70">{l.d}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Argument vitesse — bloc rouge */}
      <Reveal delay={0.1}>
        <div className="mt-6 bg-red p-10 text-ink md:p-14">
          <h3 className="max-w-2xl text-[clamp(1.6rem,3.5vw,2.6rem)] font-bold tracking-tightest">
            Votre site en ligne en un temps record.
          </h3>
          <p className="mt-5 max-w-2xl text-lg text-ink/70">
            On dispose déjà de structures de sites premium prêtes de notre côté.
            On les réadapte entièrement à votre marque — ce qui nous permet
            d'aller bien plus vite qu'une agence classique, sans sacrifier la
            qualité.
          </p>

          <div className="mt-10 grid gap-px border border-ink/20 bg-ink/15 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.t} className="bg-red p-8">
                <div className="text-4xl font-extrabold tracking-tightest text-ink">
                  {s.n}
                </div>
                <div className="mt-4 text-lg font-semibold">{s.t}</div>
                <p className="mt-1 text-ink/70">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
