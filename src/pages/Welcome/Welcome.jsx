import Hero from "../../components/landing/Hero";
import Features from "../../components/landing/Features";
import HowItWorks from "../../components/landing/HowItWorks";
import AiTools from "../../components/landing/AiTools";
import TechStrip from "../../components/landing/TechStrip";
import Team from "../../components/landing/Team";
import Cta from "../../components/landing/Cta";

/** Marketing / team presentation page (HTML template). App home is at `/`. */
export default function Welcome() {
  return (
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <AiTools />
      <TechStrip />
      <Team />
      <Cta />
    </main>
  );
}
