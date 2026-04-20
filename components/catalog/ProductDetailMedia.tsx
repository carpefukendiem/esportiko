"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Shirt } from "lucide-react";
import { ColorSwatchRow } from "@/components/catalog/ColorSwatchRow";
import type { CatalogProduct, ProductColor } from "@/lib/catalog/types";
import { isSanMarHostedImageUrl } from "@/lib/catalog/sanmarImages";

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

  const gallery = useMemo(() => {
    if (!active) return [];
    const front =
      active.flatImageUrl ||
      active.modelImageUrl ||
      product.images.frontFlatUrl ||
      product.images.productImageUrl ||
      "";
    const back =
      active.backFlatImageUrl || product.images.backFlatUrl || "";
    const slots = [
      { url: front, label: "Front" as const },
      { url: back, label: "Back" as const },
    ].filter((s) => s.url && !s.url.includes("placeholder"));
    return slots;
  }, [active, product]);

  const mainSrc = gallery[activeViewIdx]?.url ?? "";
  const mainFailed =
    failedViews.has(activeViewIdx) ||
    !mainSrc ||
    mainSrc.includes("placeholder");

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-card bg-white">
        {mainFailed ? (
          <div className="flex h-full items-center justify-center bg-navy-mid">
            <Shirt className="h-28 w-28 text-gray-muted/40" aria-hidden />
          </div>
        ) : (
          <Image
            src={mainSrc}
            alt={`${product.productTitle} in ${active?.displayColor ?? ""} — ${gallery[activeViewIdx]?.label ?? "Front"}`}
            fill
            className="object-contain p-6"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            unoptimized={isSanMarHostedImageUrl(mainSrc)}
            onError={() => {
              console.error("SanMar flat image failed to load:", mainSrc);
              setFailedViews((prev) => new Set(prev).add(activeViewIdx));
            }}
          />
        )}
      </div>
      {gallery.length > 1 ? (
        <div
          className={`mt-4 grid gap-2 ${gallery.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}
        >
          {gallery.map((slot, idx) => {
            const isFailed = failedViews.has(idx);
            return (
              <button
                key={slot.label}
                type="button"
                onClick={() => setActiveViewIdx(idx)}
                className={`relative aspect-square overflow-hidden rounded-lg border bg-white transition-colors ${
                  activeViewIdx === idx
                    ? "border-blue-accent ring-1 ring-blue-accent/50"
                    : "border-slate/25 hover:border-slate/50"
                }`}
                aria-label={`${slot.label} view`}
              >
                {isFailed ? (
                  <div className="flex h-full items-center justify-center bg-navy-mid">
                    <Shirt className="h-8 w-8 text-gray-muted/35" aria-hidden />
                  </div>
                ) : (
                  <Image
                    src={slot.url}
                    alt=""
                    fill
                    className="object-contain p-2"
                    sizes="200px"
                    loading="lazy"
                    unoptimized={isSanMarHostedImageUrl(slot.url)}
                    onError={() => {
                      console.error("SanMar flat image failed to load:", slot.url);
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
