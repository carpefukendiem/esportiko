"use client";

import { useState } from "react";
import Image from "next/image";
import { Shirt } from "lucide-react";
import { ColorSwatchRow } from "@/components/catalog/ColorSwatchRow";
import type { CatalogProduct, ProductColor } from "@/lib/catalog/types";

export function ProductDetailMedia({ product }: { product: CatalogProduct }) {
  const [active, setActive] = useState<ProductColor | undefined>(
    product.colors[0]
  );
  const img =
    active?.modelImageUrl ??
    product.images.frontModelUrl ??
    product.images.productImageUrl;
  const usePlaceholder = !img || img.includes("placeholder");

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-card bg-navy-mid">
        {usePlaceholder ? (
          <div className="flex h-full items-center justify-center">
            <Shirt className="h-28 w-28 text-gray-muted/40" aria-hidden />
          </div>
        ) : (
          <Image
            src={img}
            alt={`${product.productTitle} in ${active?.displayColor ?? ""}`}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        )}
      </div>
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
