import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { SiteQR } from "@/components/SiteQR";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Commencer mon projet",
  description:
    "Décrivez votre projet de site web à CODAIX et joignez vos fichiers. Réponse rapide.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-cream/10 bg-green/85 backdrop-blur-md">
        <nav className="container-x flex h-[72px] items-center justify-between">
          <Link
            href="/"
            className="text-xl font-extrabold tracking-tightest text-cream"
          >
            CODAIX
          </Link>
          <Link
            href="/"
            className="link-underline text-sm text-cream/60 transition hover:text-red"
          >
            ← Retour
          </Link>
        </nav>
      </header>

      <main className="pb-24 pt-32 container-x">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h1 className="text-[clamp(2.2rem,5vw,4rem)] font-extrabold leading-[1] tracking-tightest text-red">
              Commencer
              <br />
              mon projet.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-cream/70">
              Décrivez votre projet et joignez vos fichiers (logo, photos,
              cahier des charges…). On revient vers vous très vite.
            </p>
            <div className="mt-12">
              <ContactForm />
            </div>
          </div>

          <aside className="lg:col-span-5 lg:pl-8">
            <div className="space-y-8 lg:sticky lg:top-32">
              <SiteQR />
              <div className="border border-cream/15 p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-cream/50">
                  Ou directement
                </p>
                <a
                  href={`mailto:${SITE.email}`}
                  className="link-underline mt-3 inline-block text-lg text-cream"
                >
                  {SITE.email}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
