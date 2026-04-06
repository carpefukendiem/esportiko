import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { SplitPathSection } from "@/components/home/SplitPathSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { TeamAdvantageSection } from "@/components/home/TeamAdvantageSection";
import { PortfolioPreviewSection } from "@/components/home/PortfolioPreviewSection";
import { WhySection } from "@/components/home/WhySection";
import { FAQPreviewSection } from "@/components/home/FAQPreviewSection";
import { CTABand } from "@/components/ui/CTABand";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Custom Apparel Santa Barbara & Central Coast",
    description:
      "Premium screen printing, embroidery, team uniforms, and branded apparel for teams and businesses across Goleta, Santa Barbara, and the Central Coast.",
    path: "/",
  });
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SplitPathSection />
      <ServicesSection />
      <TeamAdvantageSection />
      <PortfolioPreviewSection />
      <WhySection />
      <FAQPreviewSection />
      <CTABand />
    </>
  );
}
