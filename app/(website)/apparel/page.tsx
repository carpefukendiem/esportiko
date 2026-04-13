import type { Metadata } from "next";
import Image from "next/image";
import { ApparelIndexGrid } from "@/components/catalog/ApparelIndexGrid";
import { CatalogConversionStrip } from "@/components/catalog/CatalogConversionStrip";
import { buildMetadata } from "@/lib/seo";
import { getDisplayCategories } from "@/lib/catalog/fetcher";
import { media } from "@/lib/data/media";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const base = buildMetadata({
    title: "Browse Apparel",
    description:
      "Explore our full catalog of customizable apparel for teams, businesses, and events across Santa Barbara and the Central Coast.",
    path: "/apparel",
  });
  return {
    ...base,
    title: { absolute: "Browse Apparel | Esportiko" },
  };
}

export default async function ApparelCatalogPage() {
  const categories = await getDisplayCategories();

  return (
    <>
      <section className="relative isolate min-h-[min(320px,72vw)] w-full overflow-hidden border-b border-white/10 md:min-h-[380px] lg:min-h-[420px]">
        <Image
          src={media.apparelBrowseHeroBg}
          alt=""
          fill
          priority
          className="absolute inset-0 z-0 h-full w-full object-cover"
          sizes="100vw"
          aria-hidden
        />
        <div
          className="absolute inset-0 z-[1] bg-gradient-to-b from-[#0F1521]/55 via-[#0F1521]/40 to-[#0F1521]/30"
          aria-hidden
        />
        <div className="absolute inset-0 z-[1] bg-black/20" aria-hidden />
        <div className="relative z-10 mx-auto flex min-h-[min(320px,72vw)] w-full max-w-content flex-col items-center justify-center px-6 py-12 text-center md:min-h-[380px] md:px-8 md:py-16 lg:min-h-[420px] lg:px-12">
          <p className="font-sans text-label font-semibold uppercase tracking-widest text-off-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.9)]">
            Apparel catalog
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-h1 font-bold uppercase tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.85)]">
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
          <ApparelIndexGrid categories={categories} />
        </div>
      </section>
      <CatalogConversionStrip />
    </>
  );
}
