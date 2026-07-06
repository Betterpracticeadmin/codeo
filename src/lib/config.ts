// Configuration globale du site CODÉO.
export const SITE = {
  name: "CODAIX",
  // Email de réception des demandes du formulaire.
  email: "codaix13@gmail.com",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://codaix.vercel.app",
  description:
    "CODÉO — studio de création de sites web premium. Sites vitrines, restaurants, artisans, portfolios, landing pages et identité digitale.",
  baseline: "Nous concevons des sites web qui marquent les esprits.",
} as const;
