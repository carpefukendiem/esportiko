"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Shirt } from "lucide-react";
import type {
  SanMarDecorationMethod,
  SanMarSeedCategory,
  SanMarSeedProduct,
} from "@/lib/data/sanmar-seed";
import { cn } from "@/lib/utils/cn";

const FILTERS: Array<"All" | SanMarSeedCategory> = [
  "All",
  "T-Shirts",
  "Hoodies",
  "Polos",
  "Jerseys",
  "Hats",
];

function decorationPills(methods: SanMarDecorationMethod[]): string[] {
  if (methods.includes("Both")) return ["Screen Print", "Embroidery"];
  return methods.filter((m) => m !== "Both");
}

export function SanMarSeedCatalog({ products }: { products: SanMarSeedProduct[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const visible = useMemo(() => {
    if (filter === "All") return products;
    return products.filter((p) => p.category === filter);
  }, [filter, products]);

  return (
    <div className="space-y-10">
      <div
        className="flex flex-wrap gap-2 border-b border-slate/40 pb-4"
        role="tablist"
        aria-label="Filter by category"
      >
        {FILTERS.map((label) => (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={filter === label}
            onClick={() => setFilter(label)}
            className={cn(
              "rounded-full border px-4 py-2 font-sans text-sm font-semibold uppercase tracking-wide transition-colors",
              filter === label
                ? "border-blue-accent bg-blue-accent/15 text-white"
                : "border-slate/50 bg-navy-light/60 text-gray-soft hover:border-slate hover:text-off-white"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((p) => (
          <article
            key={p.style_number}
            className="flex flex-col overflow-hidden rounded-card border border-slate/20 bg-navy-light transition-colors hover:border-blue-accent/35"
          >
            <div className="relative aspect-[4/3] w-full bg-navy-mid">
              {p.image_url ? (
                <Image
                  src={p.image_url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Shirt
                    className="h-14 w-14 text-gray-muted/40"
                    aria-hidden
                  />
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <p className="font-mono text-xs font-medium uppercase tracking-wider text-gray-muted">
                {p.style_number}
              </p>
              <h2 className="font-display text-lg font-semibold leading-snug text-white">
                {p.name}
              </h2>
              <p className="font-sans text-xs font-semibold uppercase tracking-wide text-gray-soft">
                {p.brand}
              </p>
              <div className="flex flex-wrap gap-1.5" aria-label="Available colors">
                {p.available_colors.slice(0, 6).map((c) => (
                  <span
                    key={c}
                    title={c}
                    className="h-5 w-5 shrink-0 rounded-full border border-slate/50 bg-slate/30 ring-1 ring-white/10"
                  />
                ))}
                {p.available_colors.length > 6 ? (
                  <span className="self-center font-sans text-xs text-gray-muted">
                    +{p.available_colors.length - 6}
                  </span>
                ) : null}
              </div>
              <p className="line-clamp-2 font-sans text-sm leading-relaxed text-gray-soft">
                {p.description}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {decorationPills(p.decoration_methods).map((d) => (
                  <span
                    key={d}
                    className="rounded-md border border-slate/40 bg-navy/80 px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-wide text-off-white"
                  >
                    {d}
                  </span>
                ))}
              </div>
              <p className="font-sans text-xs text-gray-muted">
                Sizes: {p.available_sizes.join(", ")}
              </p>
              <p className="font-sans text-xs text-gray-muted">
                Min. order qty: {p.min_quantity}
              </p>
              <div className="mt-auto pt-2">
                <Link
                  href={`/request-a-quote?style=${encodeURIComponent(p.style_number)}`}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-[#3B7BF8] px-4 py-3 font-sans text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Request this item
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-center font-sans text-sm font-medium text-gray-muted">
          No styles in this category yet.
        </p>
      ) : null}
    </div>
  );
}
