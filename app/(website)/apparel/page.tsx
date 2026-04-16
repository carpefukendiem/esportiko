import type { Metadata } from "next";
import Image from "next/image";
import { SanMarSeedCatalog } from "@/components/catalog/SanMarSeedCatalog";
import { buildMetadata } from "@/lib/seo";
import { getProductBulkInfo } from "@/lib/sanmar/client";
import { media } from "@/lib/data/media";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const base = buildMetadata({
    title: "Browse Apparel",
    description:
      "A selection of SanMar-style garments we regularly decorate for teams, schools, and businesses on the Central Coast — request a quote for any style.",
    path: "/apparel",
  });
  return {
    ...base,
    title: { absolute: "Browse Apparel | Esportiko" },
  };
}

export default async function ApparelCatalogPage() {
  const products = await getProductBulkInfo();

  return (
    <>
      <section className="relative isolate min-h-[min(280px,70vw)] w-full overflow-hidden border-b border-white/10 md:min-h-[340px] lg:min-h-[380px]">
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
        <div className="relative z-10 mx-auto flex min-h-[min(280px,70vw)] w-full max-w-content flex-col items-center justify-center px-6 py-12 text-center md:min-h-[340px] md:px-8 md:py-14 lg:min-h-[380px] lg:px-12">
          <p className="font-sans text-label font-semibold uppercase tracking-widest text-off-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.9)]">
            Apparel catalog
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-h1 font-bold uppercase tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.85)]">
            Browse Apparel
          </h1>
          <p className="mt-4 max-w-2xl text-body font-medium text-off-white drop-shadow-[0_1px_12px_rgba(0,0,0,0.9)]">
            A selection of styles we regularly work with. Don&apos;t see what
            you need — just ask.
          </p>
        </div>
      </section>

      <section className="bg-navy py-14 md:py-20">
        <div className="mx-auto max-w-content px-6 md:px-8 lg:px-12">
          <SanMarSeedCatalog products={products} />
        </div>
      </section>
    </>
  );
}
