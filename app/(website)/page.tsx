import type { Metadata } from "next";
import { HomepageHero } from "@/components/home/HomepageHero";
import { HomeStickyMobileQuoteCTA } from "@/components/home/HomeStickyMobileQuoteCTA";
import { HeroSection } from "@/components/home/HeroSection";
import { SplitPathSection } from "@/components/home/SplitPathSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { PortfolioPreviewSection } from "@/components/home/PortfolioPreviewSection";
import { WhySection } from "@/components/home/WhySection";
import { FAQPreviewSection } from "@/components/home/FAQPreviewSection";
import { CTABand } from "@/components/ui/CTABand";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Custom Apparel Goleta & Santa Barbara · Central Coast",
    description:
      "Premium screen printing, embroidery, team uniforms, and branded apparel built in Goleta — serving teams and businesses across Santa Barbara and the Central Coast.",
    path: "/",
  });
}

export default function HomePage() {
  return (
    <>
      <HomepageHero />
      <HeroSection />
      <SplitPathSection />
      <ServicesSection />
      <PortfolioPreviewSection />
      <WhySection />
      <FAQPreviewSection />
      <CTABand />
      <HomeStickyMobileQuoteCTA />
    </>
  );
}
