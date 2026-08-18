import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { BentoFeatures } from "@/components/sections/BentoFeatures";
import { CurrencySection } from "@/components/sections/CurrencySection";
import { TechStack } from "@/components/sections/TechStack";
import { CtaSection } from "@/components/sections/CtaSection";
import { AuthModal } from "@/components/auth/AuthModal";

export const metadata: Metadata = {
  title: "Frontend Starter | Clean Next.js 16 SPA",
  description: "A clean client-only Next.js starter with Axios, Zustand, and Tailwind CSS v4, ready for Go Fiber backends.",
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <BentoFeatures />
        <CurrencySection />
        <TechStack />
        <CtaSection />
      </main>
      <Footer />
      <AuthModal />
    </>
  );
}
