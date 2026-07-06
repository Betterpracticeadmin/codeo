// Réalisations affichées dans la galerie.
// Ajoute/édite simplement des entrées ici — le site se met à jour tout seul.
export type Project = {
  title: string;
  category: string;
  year: string;
};

export const PROJECTS: Project[] = [
  { title: "Le Jardin", category: "Restaurant", year: "2026" },
  { title: "Atelier Noir", category: "Artisan", year: "2026" },
  { title: "Studio Lumen", category: "Portfolio", year: "2025" },
  { title: "Maison Doré", category: "Identité digitale", year: "2025" },
  { title: "Belle Rive", category: "Institut de beauté", year: "2025" },
  { title: "Forge & Co", category: "Landing page", year: "2024" },
];
