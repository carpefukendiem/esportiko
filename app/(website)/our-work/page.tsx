import type { Metadata } from "next";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { PortfolioGallery } from "@/components/our-work/PortfolioGallery";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { buildMetadata } from "@/lib/seo";

/*
 * SECTION RHYTHM:
 * 1. Hero (minimal) — DARK
 * 2. Gallery grid   — LIGHT soft paper + noise (photos pop)
 */
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
    <>
      <section className="border-b border-slate/60 bg-texture-dark py-12 md:py-16">
        <SectionContainer>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 font-display text-h1 font-bold uppercase tracking-tight text-white">
              Our Work
            </h1>
            <p className="text-body leading-relaxed text-gray-soft">
              A selection of decoration-forward apparel — screen print, embroidery,
              and organized team programs. Use the filters to explore by category.
            </p>
          </div>
        </SectionContainer>
      </section>
      <section className="relative overflow-hidden border-y border-navy/10 bg-[#f5f7fa]">
        <NoiseOverlay opacity={0.035} />
        <div className="relative z-10">
          <SectionContainer className="py-10 md:py-14">
            <PortfolioGallery />
          </SectionContainer>
        </div>
      </section>
    </>
  );
}
