"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SITE } from "@/lib/config";
import { Magnetic } from "./Magnetic";

const words = SITE.baseline.split(" ");

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center pb-24 pt-32 container-x">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="mb-8 text-xs uppercase tracking-[0.35em] text-cream/50 sm:text-sm"
      >
        Studio de création web · Aix-en-Provence
      </motion.p>

      <h1 className="max-w-[16ch] text-[clamp(2.6rem,8vw,7rem)] font-extrabold leading-[0.95] tracking-tightest text-red">
        {words.map((w, i) => (
          <span key={i} className="mr-[0.25em] inline-block overflow-hidden">
            <motion.span
              className={`inline-block ${
                i >= 6 ? "font-serif font-normal italic text-cream" : ""
              }`}
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.1 + i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {w}
            </motion.span>
          </span>
        ))}
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-12 flex flex-wrap items-center gap-6"
      >
        <Magnetic>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 rounded-full bg-cream px-8 py-4 text-base font-semibold text-ink transition hover:bg-red hover:text-ink"
          >
            Démarrer un projet
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </Magnetic>
        <span className="max-w-xs text-sm text-cream/60">
          Des sites premium, livrés vite. Pensés pour convertir.
        </span>
      </motion.div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-x-[clamp(20px,5vw,64px)] bottom-10 h-px origin-left bg-cream/15"
      />
    </section>
  );
}
