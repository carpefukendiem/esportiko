import type { Metadata } from "next";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { PortfolioGallery } from "@/components/our-work/PortfolioGallery";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Our Work",
    description:
      "Browse custom hats, jerseys, hoodies, polos, and team uniforms produced for Central Coast clients. Filter by category.",
    path: "/our-work",
  });
}

export default function OurWorkPage() {
  return (
    <SectionContainer className="bg-texture-dark">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <h1 className="mb-4 font-display text-h1 font-bold uppercase tracking-tight text-white">
          Our Work
        </h1>
        <p className="text-body text-gray-soft">
          A selection of decoration-forward apparel — screen print, embroidery,
          and organized team programs. Use the filters to explore by category.
        </p>
      </div>
      <PortfolioGallery />
    </SectionContainer>
  );
}
