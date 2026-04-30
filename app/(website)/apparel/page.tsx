import type { Metadata } from "next";
import Image from "next/image";
import { ApparelIndexGrid } from "@/components/catalog/ApparelIndexGrid";
import { CatalogConversionStrip } from "@/components/catalog/CatalogConversionStrip";
import { buildMetadata } from "@/lib/seo";
import { getDisplayCategoriesForApparelIndex } from "@/lib/catalog/categories";
import { media } from "@/lib/data/media";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Browse Apparel",
    description:
      "Explore our full catalog of customizable apparel for teams, businesses, and events — built in Goleta, serving Santa Barbara and the Central Coast.",
    path: "/apparel",
  });
}

export default function ApparelCatalogPage() {
  const categories = getDisplayCategoriesForApparelIndex();

  return (
    <>
      <section className="relative min-h-[min(320px,72vw)] w-full border-b border-white/10 md:min-h-[380px] lg:min-h-[420px]">
        <Image
          src={media.apparelBrowseHeroBg}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/60" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/55"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-content px-6 py-12 md:px-8 md:py-16 lg:px-12">
          <p className="font-sans text-label font-semibold uppercase tracking-widest text-off-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.9)]">
            Apparel catalog
          </p>
          <h1 className="mt-3 font-display text-h1 font-bold uppercase tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.85)]">
            Browse Our Full Catalog
          </h1>
          <p className="mt-4 max-w-2xl text-body font-medium text-off-white drop-shadow-[0_1px_12px_rgba(0,0,0,0.9)]">
            Every item can be customized with screen printing, embroidery, or
            heat transfer. Browse by category and start a project when
            you&apos;re ready.
          </p>
        </div>
      </section>
      <section className="bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-content px-6 md:px-8 lg:px-12">
          <h2 className="mb-10 font-display text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
            Browse by category
          </h2>
          <ApparelIndexGrid categories={categories} />
        </div>
      </section>
      <CatalogConversionStrip />
    </>
  );
}
