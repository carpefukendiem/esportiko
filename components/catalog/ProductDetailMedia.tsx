"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Shirt } from "lucide-react";
import { ColorSwatchRow } from "@/components/catalog/ColorSwatchRow";
import type { CatalogProduct, ProductColor } from "@/lib/catalog/types";
import { getSanMarImageUrls, isSanMarCatalogUrl } from "@/lib/catalog/sanmarImages";

const DETAIL_VIEWS = ["Front", "Back", "Side"] as const;

export function ProductDetailMedia({ product }: { product: CatalogProduct }) {
  const [active, setActive] = useState<ProductColor | undefined>(
    product.colors[0]
  );
  const [activeViewIdx, setActiveViewIdx] = useState(0);
  const [failedViews, setFailedViews] = useState<Set<number>>(new Set());

  useEffect(() => {
    setActiveViewIdx(0);
    setFailedViews(new Set());
  }, [active?.catalogColor, product.uniqueKey]);

  const urls = useMemo(() => {
    if (!active) return [];
    return getSanMarImageUrls(
      product.styleNumber,
      active.displayColor,
      [...DETAIL_VIEWS],
      "1200x1200"
    );
  }, [active, product.styleNumber]);

  const mainSrc =
    urls[activeViewIdx] ??
    active?.modelImageUrl ??
    product.images.frontModelUrl ??
    product.images.productImageUrl;
  const mainFailed =
    failedViews.has(activeViewIdx) ||
    !mainSrc ||
    mainSrc.includes("placeholder");

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-card bg-navy-mid">
        {mainFailed ? (
          <div className="flex h-full items-center justify-center">
            <Shirt className="h-28 w-28 text-gray-muted/40" aria-hidden />
          </div>
        ) : (
          <Image
            src={mainSrc}
            alt={`${product.productTitle} in ${active?.displayColor ?? ""} — ${DETAIL_VIEWS[activeViewIdx] ?? "Front"}`}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            onError={() =>
              setFailedViews((prev) => new Set(prev).add(activeViewIdx))
            }
          />
        )}
      </div>
      {urls.length > 0 ? (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {urls.map((url, idx) => {
            const isFailed = failedViews.has(idx);
            return (
              <button
                key={DETAIL_VIEWS[idx]}
                type="button"
                onClick={() => setActiveViewIdx(idx)}
                className={`relative aspect-square overflow-hidden rounded-lg border bg-navy-mid transition-colors ${
                  activeViewIdx === idx
                    ? "border-blue-accent ring-1 ring-blue-accent/50"
                    : "border-slate/25 hover:border-slate/50"
                }`}
                aria-label={`View ${DETAIL_VIEWS[idx]}`}
              >
                {isFailed ? (
                  <div className="flex h-full items-center justify-center">
                    <Shirt className="h-8 w-8 text-gray-muted/35" aria-hidden />
                  </div>
                ) : (
                  <Image
                    src={url}
                    alt=""
                    fill
                    className="object-contain p-1"
                    sizes="120px"
                    loading="lazy"
                    unoptimized={isSanMarCatalogUrl(url)}
                    onError={() => {
                      console.error("SanMar image failed to load:", url);
                      setFailedViews((prev) => new Set(prev).add(idx));
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      ) : null}
      <div className="mt-4">
        <p className="font-sans text-body-sm text-gray-muted">
          Color:{" "}
          <span className="text-off-white">{active?.displayColor ?? ""}</span>
        </p>
        <ColorSwatchRow
          colors={product.colors}
          selectedColor={active?.catalogColor}
          onSelect={setActive}
          size="md"
        />
      </div>
    </div>
  );
}
