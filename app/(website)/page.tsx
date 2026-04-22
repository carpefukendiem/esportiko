import type { Metadata } from "next";
import { HomepageHero } from "@/components/home/HomepageHero";
import { HeroSection } from "@/components/home/HeroSection";
import { SplitPathSection } from "@/components/home/SplitPathSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { PortfolioPreviewSection } from "@/components/home/PortfolioPreviewSection";
import { WhySection } from "@/components/home/WhySection";
import { FAQPreviewSection } from "@/components/home/FAQPreviewSection";
import { CTABand } from "@/components/ui/CTABand";
import { buildMetadata } from "@/lib/seo";

/*
 * SECTION RHYTHM (dark / light alternation):
 * 1. HomepageHero     — DARK (bg-navy)
 * 2. HeroSection       — LIGHT soft paper + noise (#f5f7fa)
 * 3. SplitPathSection  — LIGHT warm gradient + noise (CSS, no PNG)
 * 4. ServicesSection   — DARK mid (bg-texture-navy-mid)
 * 5. PortfolioPreview  — LIGHT soft paper + noise
 * 6. WhySection        — DARK deepest (bg-texture-dark)
 * 7. FAQPreviewSection — LIGHT crisp white + noise + accordion light
 * 8. CTABand           — LIGHT warm gradient + navy CTAs
 * 9. Footer (layout)   — DARK (bg-navy)
 */
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
      <HomepageHero />
      <HeroSection />
      <SplitPathSection />
      <ServicesSection />
      <PortfolioPreviewSection />
      <WhySection />
      <FAQPreviewSection />
      <CTABand variant="light" />
    </>
  );
}
