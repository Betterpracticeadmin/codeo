import Link from "next/link";
import { Reveal } from "./Reveal";
import { Magnetic } from "./Magnetic";

export function ContactCTA() {
  return (
    <section id="contact" className="bg-red text-ink">
      <div className="py-28 text-center container-x md:py-48">
        <Reveal>
          <h2 className="text-[clamp(2.2rem,7vw,6rem)] font-extrabold leading-[0.95] tracking-tightest">
            Parlons de
            <br />
            votre <span className="font-serif font-normal italic">projet.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <Magnetic>
            <Link
              href="/contact"
              className="group mt-12 inline-flex items-center gap-3 rounded-full bg-ink px-10 py-5 text-lg font-semibold text-cream transition hover:bg-cream hover:text-ink"
            >
              Commencer mon projet
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
