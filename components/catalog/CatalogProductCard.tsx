"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Shirt } from "lucide-react";
import type { CatalogProduct } from "@/lib/catalog/types";
import { approximateSwatchColor } from "@/lib/catalog/colorApprox";

export function CatalogProductCard({ product }: { product: CatalogProduct }) {
  const style = product.styleNumber;
  const quoteHref = `/request-a-quote?style=${encodeURIComponent(style)}`;
  const swatches = product.colors.slice(0, 8);
  const [imgError, setImgError] = useState(false);
  const src = product.images.productImageUrl;
  const showPlaceholder = !src || src.includes("placeholder") || imgError;

  return (
    <article className="group flex h-full flex-col rounded-xl border border-[#2A3347] bg-[#1C2333] p-4 transition-colors hover:border-[#3B7BF8]">
      <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg bg-[#2A3347]">
        <span className="absolute left-2 top-2 z-10 font-mono text-xs text-[#8A94A6]">
          {style}
        </span>
        {showPlaceholder ? (
          <div className="flex h-full items-center justify-center">
            <Shirt className="h-14 w-14 text-[#3B7BF8]" aria-hidden />
          </div>
        ) : (
          <Image
            src={src}
            alt=""
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 50vw, 25vw"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <p className="text-xs font-medium uppercase tracking-wide text-[#8A94A6]">
        {product.brandName}
      </p>
      <h3 className="mt-1 text-sm font-medium text-white">{product.productTitle}</h3>
      <div className="mt-3 flex flex-wrap items-center gap-1.5" aria-label="Available colors">
        {swatches.map((c) => (
          <span
            key={c.catalogColor}
            title={c.displayColor}
            className="inline-block h-2 w-2 rounded-full ring-1 ring-white/10"
            style={{ backgroundColor: approximateSwatchColor(c.displayColor) }}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {product.decorationTypes.map((d) => (
          <span
            key={d}
            className="rounded bg-[#2A3347] px-2 py-0.5 text-xs text-[#8A94A6]"
          >
            {d}
          </span>
        ))}
      </div>
      <div className="mt-auto pt-4">
        <Link
          href={quoteHref}
          className="block w-full rounded-lg border border-[#3B7BF8] py-2 text-center text-sm text-[#3B7BF8] transition-colors hover:bg-[#3B7BF8] hover:text-white"
        >
          Request this item
        </Link>
      </div>
    </article>
  );
}
