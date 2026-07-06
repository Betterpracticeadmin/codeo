# CODÉO — site de l'agence

Site premium (Next.js 14 · TypeScript · Tailwind · Framer Motion) pour l'agence
de création de sites web **CODÉO**. Design brutaliste noir & blanc, formulaire
de contact avec téléversement de fichiers, envoi d'email via **Resend**, QR code.

## 🚀 Démarrer en local

```bash
cd codeo
npm install
cp .env.example .env.local   # puis remplis les valeurs
npm run dev
```

Ouvre http://localhost:3000

## 🔑 Configurer l'envoi d'email (Resend)

1. Crée un compte gratuit sur **https://resend.com** avec l'email **pscalessandro5@gmail.com**
   (important : en mode test, Resend n'envoie que vers l'email du compte).
2. **API Keys → Create API Key**, copie la clé (`re_...`).
3. Dans `.env.local` : `RESEND_API_KEY=re_...`
4. Redémarre `npm run dev`.

> Sans clé, le site fonctionne mais le formulaire renvoie un message d'erreur clair.
> Les demandes arrivent sur **pscalessandro5@gmail.com** (bien `gmail.com`).

### Envoyer depuis ta propre adresse (optionnel)
Par défaut l'expéditeur est `onboarding@resend.dev`. Pour envoyer depuis
`contact@tondomaine.fr`, vérifie ton domaine dans Resend puis change le `from`
dans `src/app/api/contact/route.ts`.

## ☁️ Déployer sur Vercel

1. Pousse le dossier sur un dépôt GitHub.
2. Sur **vercel.com**, « New Project » → importe le dépôt.
3. Ajoute les variables d'environnement :
   - `RESEND_API_KEY` = ta clé
   - `NEXT_PUBLIC_SITE_URL` = l'URL finale (ex : `https://codeo.vercel.app`)
4. Deploy. C'est en ligne. 🎉

## 📎 Fichiers du formulaire

Le formulaire accepte plusieurs fichiers (logo, images, PDF). **Limite : 4 Mo au
total** (contrainte des fonctions serverless Vercel, ~4,5 Mo/requête). Pour gérer
des fichiers plus lourds, passer par **Vercel Blob** (upload direct + envoi du
lien par email) — évolution possible.

## 🗂 Structure

```
src/
  app/
    layout.tsx          metadata / SEO / police
    page.tsx            page d'accueil (toutes les sections)
    contact/page.tsx    page formulaire
    api/contact/route.ts  envoi email (Resend)
    opengraph-image.tsx  image de partage
    sitemap.ts / robots.ts / icon.svg
  components/           Nav, Hero, About, Method, Work, Why, ContactCTA, Footer, ContactForm, SiteQR, Reveal
  lib/                 config.ts (nom, email, url), projects.ts (réalisations)
```

## ✏️ Personnaliser

- **Réalisations** : `src/lib/projects.ts`
- **Email / nom / URL** : `src/lib/config.ts`
- **Couleurs / police** : `tailwind.config.ts`

## 🛠 Stack

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS 3 ·
Framer Motion · Resend · qrcode.react · déploiement Vercel.

> Choix technique : animations en **Framer Motion + CSS** (plutôt que GSAP),
> plus léger et idiomatique en React. Le rendu premium visé reste identique.
