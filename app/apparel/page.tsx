import type { Metadata } from "next";
import { ApparelIndexGrid } from "@/components/catalog/ApparelIndexGrid";
import { CatalogConversionStrip } from "@/components/catalog/CatalogConversionStrip";
import { buildMetadata } from "@/lib/seo";
import { getDisplayCategories } from "@/lib/catalog/fetcher";

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
      <section className="border-b border-slate/60 bg-texture-navy-mid">
        <div className="mx-auto max-w-content px-6 py-12 md:px-8 md:py-16 lg:px-12">
          <p className="font-sans text-label font-semibold uppercase tracking-widest text-gray-soft">
            Apparel catalog
          </p>
          <h1 className="mt-3 font-display text-h1 font-bold uppercase tracking-tight text-white">
            Browse Our Full Catalog
          </h1>
          <p className="mt-4 max-w-2xl text-body font-medium text-off-white/85">
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
