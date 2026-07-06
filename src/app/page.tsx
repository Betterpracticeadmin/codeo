import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { About } from "@/components/About";
import { HowItWorks } from "@/components/HowItWorks";
import { Method } from "@/components/Method";
import { Work } from "@/components/Work";
import { Why } from "@/components/Why";
import { ContactCTA } from "@/components/ContactCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <HowItWorks />
        <Method />
        <Work />
        <Why />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
