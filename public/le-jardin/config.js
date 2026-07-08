/* ============================================================
   ⚙️  FICHIER À MODIFIER POUR CHAQUE CLIENT
   Change juste les valeurs ci-dessous (nom, couleurs, carte,
   horaires, contact) → tout le site se met à jour tout seul.
   Rebrander un resto = ~15 minutes. Puis déploie sur Vercel.
   ============================================================ */
window.SITE = {
  // --- Identité ---
  nom: "Le Jardin",
  slogan: "Bistro de saison",
  phrase: "Une cuisine française généreuse, des produits frais du marché, au cœur de la ville.",
  ville: "Lyon",

  // --- Couleurs (change juste ces 2 lignes pour changer toute l'ambiance) ---
  couleurAccent: "#b5502a",     // terracotta chaleureux
  couleurFond: "#faf6f0",       // crème

  // --- Photos : mets les URLs des vraies photos du client (Instagram, Google).
  //     Laisse "" pour afficher un joli dégradé à la place. ---
  photoHero: "",
  galerie: ["", "", "", "", "", ""],

  // --- La carte ---
  carte: [
    {
      cat: "Entrées",
      plats: [
        { nom: "Velouté de potimarron", desc: "crème de châtaigne, huile de noisette", prix: "9" },
        { nom: "Œuf parfait", desc: "champignons, jus de persil, lard croustillant", prix: "11" },
        { nom: "Burrata des Pouilles", desc: "tomates anciennes, basilic, huile d'olive", prix: "13" },
      ],
    },
    {
      cat: "Plats",
      plats: [
        { nom: "Suprême de volaille fermière", desc: "purée maison, jus corsé", prix: "22" },
        { nom: "Pavé de cabillaud", desc: "risotto crémeux, émulsion citron", prix: "24" },
        { nom: "Entrecôte, sauce au poivre", desc: "frites maison, salade", prix: "26" },
        { nom: "Risotto aux légumes du marché", desc: "parmesan 24 mois (végétarien)", prix: "18" },
      ],
    },
    {
      cat: "Desserts",
      plats: [
        { nom: "Tarte fine aux pommes", desc: "caramel beurre salé, glace vanille", prix: "9" },
        { nom: "Fondant au chocolat", desc: "cœur coulant, crème anglaise", prix: "9" },
        { nom: "Café gourmand", desc: "assortiment de mignardises", prix: "8" },
      ],
    },
  ],

  // --- Infos pratiques ---
  horaires: [
    { j: "Lundi", h: "Fermé" },
    { j: "Mardi – Vendredi", h: "12h00 – 14h30  ·  19h00 – 22h30" },
    { j: "Samedi", h: "19h00 – 23h00" },
    { j: "Dimanche", h: "12h00 – 15h00" },
  ],
  adresse: "24 rue des Marronniers, 69002 Lyon",
  telephone: "04 78 00 00 00",
  email: "contact@lejardin-bistro.fr",
  instagram: "https://instagram.com",

  // --- Réservation ---
  // Sans backend : le formulaire ouvre l'email pré-rempli du client.
  // Pour un vrai formulaire, crée un endpoint gratuit sur formspree.io
  // et colle-le ici (ex: "https://formspree.io/f/xxxx"). Laisse "" sinon.
  formspree: "",
};
