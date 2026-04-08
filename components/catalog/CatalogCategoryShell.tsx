"use client";

import { useMemo, useState } from "react";
import { FilterBar, type CatalogFilterValue } from "@/components/catalog/FilterBar";
import { MobileCTABar } from "@/components/catalog/MobileCTABar";
import { ProductCard } from "@/components/catalog/ProductCard";
import type { CatalogProduct } from "@/lib/catalog/types";

function applyFilter(
  products: CatalogProduct[],
  filter: CatalogFilterValue
): CatalogProduct[] {
  const base = products.filter((p) => p.status !== "Discontinued");
  if (filter === "New") {
    return base.filter((p) => p.status === "New");
  }
  if (filter === "Active") {
    return base.filter(
      (p) => p.status === "Active" || p.status === "Regular"
    );
  }
  return base;
}

export function CatalogCategoryShell({
  categorySlug,
  products,
}: {
  categorySlug: string;
  products: CatalogProduct[];
}) {
  const [filter, setFilter] = useState<CatalogFilterValue>("All");
  const visible = useMemo(
    () => applyFilter(products, filter),
    [products, filter]
  );

  return (
    <>
      <div className="sticky top-[60px] z-30 border-b border-slate/20 bg-navy-mid md:top-[68px]">
        <div className="mx-auto max-w-content px-6 py-4 md:px-8 lg:px-12">
          <FilterBar active={filter} onChange={setFilter} />
        </div>
      </div>
      <section className="bg-navy pb-24 pt-10 md:pb-14 md:pt-14">
        <div className="mx-auto max-w-content px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {visible.map((p) => (
              <ProductCard
                key={p.uniqueKey}
                product={p}
                categorySlug={categorySlug}
              />
            ))}
          </div>
        </div>
      </section>
      <MobileCTABar />
    </>
  );
}
