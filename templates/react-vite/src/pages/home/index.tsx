import { HeroSection } from "@/components/sections/HeroSection";
import { BentoFeatures } from "@/components/sections/BentoFeatures";
import { CurrencySection } from "@/components/sections/CurrencySection";
import { TechStack } from "@/components/sections/TechStack";
import { CtaSection } from "@/components/sections/CtaSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BentoFeatures />
      <CurrencySection />
      <TechStack />
      <CtaSection />
    </>
  );
}
