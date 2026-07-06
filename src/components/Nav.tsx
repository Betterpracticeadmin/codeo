"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/#fonctionnement", label: "Comment ça marche" },
  { href: "/#methode", label: "Méthode" },
  { href: "/#realisations", label: "Réalisations" },
  { href: "/#pourquoi", label: "Pourquoi nous" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-cream/10 bg-green/85 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="container-x flex h-[72px] items-center justify-between">
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tightest text-cream"
        >
          CODAIX
        </Link>

        <div className="hidden items-center gap-8 text-sm md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="link-underline text-cream/70 transition-colors hover:text-red"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full bg-red px-5 py-2.5 text-sm font-semibold text-ink transition hover:brightness-110"
          >
            Démarrer un projet
          </Link>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={open}
        >
          <div className="space-y-1.5">
            <span
              className={`block h-px w-6 bg-cream transition-transform ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-6 bg-cream transition-opacity ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-px w-6 bg-cream transition-transform ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {open && (
        <div className="border-t border-cream/10 bg-green px-[clamp(20px,5vw,64px)] py-6 md:hidden">
          <div className="flex flex-col gap-4">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-lg text-cream/80"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-red px-5 py-3 text-sm font-semibold text-ink"
            >
              Démarrer un projet
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
