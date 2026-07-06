import Link from "next/link";
import { SITE } from "@/lib/config";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-cream/10 bg-greendark text-cream">
      <div className="grid gap-10 py-16 container-x md:grid-cols-3">
        <div>
          <div className="text-2xl font-extrabold tracking-tightest">CODAIX</div>
          <p className="mt-3 max-w-xs text-cream/50">
            Studio de création de sites web premium. Aix-en-Provence.
          </p>
        </div>
        <div className="flex items-start gap-6 md:justify-center">
          <Link href="/#methode" className="text-cream/60 transition hover:text-red">
            Méthode
          </Link>
          <Link href="/#realisations" className="text-cream/60 transition hover:text-red">
            Réalisations
          </Link>
          <Link href="/contact" className="text-cream/60 transition hover:text-red">
            Contact
          </Link>
        </div>
        <div className="md:text-right">
          <a href={`mailto:${SITE.email}`} className="link-underline text-lg">
            {SITE.email}
          </a>
          <p className="mt-3 text-sm text-cream/40">
            © {year} CODAIX. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
