// Réalisations affichées dans la galerie.
// href = lien vers la démo hébergée dans /public (aperçu iframe + clic).
export type Project = {
  title: string;
  category: string;
  year: string;
  href?: string;
};

export const PROJECTS: Project[] = [
  { title: "Chez Pico", category: "Pizzeria · Bouc-Bel-Air", year: "2026", href: "/chez-pico/index.html" },
  { title: "Casino Démo", category: "Jeu web · argent fictif", year: "2026", href: "/casino/index.html" },
  { title: "Le Jardin", category: "Restaurant · Lyon", year: "2026", href: "/le-jardin/index.html" },
];
