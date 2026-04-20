"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shirt } from "lucide-react";
import type { CatalogProduct, ProductColor } from "@/lib/catalog/types";
import { ColorSwatchRow } from "@/components/catalog/ColorSwatchRow";
import { DecorationBadge } from "@/components/catalog/DecorationBadge";
import { ProductStatusBadge } from "@/components/catalog/ProductStatusBadge";

export function ProductCard({
  product,
  categorySlug,
}: {
  product: CatalogProduct;
  categorySlug: string;
}) {
  const [active, setActive] = useState<ProductColor | undefined>(
    product.colors[0]
  );
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [active?.catalogColor, product.uniqueKey]);

  if (product.status === "Discontinued") {
    return null;
  }

  const img =
    active?.modelImageUrl ??
    product.images.productImageUrl ??
    product.images.thumbnailUrl;
  const missingImage = !img || img.includes("placeholder");
  const usePlaceholder = missingImage || imgError;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="h-full"
    >
      <div className="group flex h-full flex-col overflow-hidden rounded-card border border-slate/20 bg-navy-light transition-colors hover:border-blue-accent/40">
        <Link
          href={`/apparel/${categorySlug}/${encodeURIComponent(product.styleNumber)}`}
          className="relative block aspect-[4/3] w-full overflow-hidden bg-navy-mid"
        >
          {product.status === "New" ? <ProductStatusBadge /> : null}
          {usePlaceholder ? (
            <div className="flex h-full items-center justify-center">
              <Shirt className="h-12 w-12 text-gray-muted/45" aria-hidden />
            </div>
          ) : (
            <Image
              src={img}
              alt={`${product.productTitle} in ${active?.displayColor ?? ""}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 50vw, 25vw"
              onError={() => setImgError(true)}
            />
          )}
        </Link>
        <div className="flex flex-1 flex-col px-4 py-4">
          <Link
            href={`/apparel/${categorySlug}/${encodeURIComponent(product.styleNumber)}`}
          >
            <p className="font-display text-body-sm font-semibold leading-snug text-white">
              {product.productTitle}
            </p>
          </Link>
          <p className="mt-1 font-sans text-xs font-medium uppercase tracking-wide text-gray-muted">
            {product.brandName}
          </p>
          <p className="mt-1 font-mono text-xs text-gray-muted">
            Style #{product.styleNumber}
          </p>
          <ColorSwatchRow
            colors={product.colors}
            selectedColor={active?.catalogColor}
            onSelect={setActive}
          />
          <div className="mt-3 flex flex-wrap gap-1">
            {product.decorationTypes.map((d) => (
              <DecorationBadge key={d} label={d} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
