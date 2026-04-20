"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shirt } from "lucide-react";
import type { CatalogProduct, ProductColor } from "@/lib/catalog/types";
import { isSanMarHostedImageUrl } from "@/lib/catalog/sanmarImages";
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
  const [imgIndex, setImgIndex] = useState(0);
  const [imgExhausted, setImgExhausted] = useState(false);

  const imageCandidates = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    const add = (url: string | undefined) => {
      if (!url || url.includes("placeholder") || seen.has(url)) return;
      seen.add(url);
      out.push(url);
    };

    // Flat lay first (FTP / Supabase); never prefer model URLs.
    add(active?.flatImageUrl);
    add(active?.modelImageUrl);
    add(product.images.frontFlatUrl);
    add(product.images.productImageUrl);
    add(product.images.thumbnailUrl);
    for (const c of product.colors) {
      add(c.flatImageUrl);
      add(c.modelImageUrl);
    }

    return out;
  }, [
    active?.flatImageUrl,
    active?.modelImageUrl,
    product.colors,
    product.images.frontFlatUrl,
    product.images.productImageUrl,
    product.images.thumbnailUrl,
  ]);

  useEffect(() => {
    setImgIndex(0);
    setImgExhausted(false);
  }, [active?.catalogColor, product.uniqueKey, imageCandidates.length]);

  if (product.status === "Discontinued") {
    return null;
  }

  const img = imageCandidates[imgIndex];
  const usePlaceholder = !img || imgExhausted;

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
              className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.01]"
              sizes="(max-width: 768px) 50vw, 25vw"
              loading="lazy"
              unoptimized={isSanMarHostedImageUrl(img)}
              onError={() => {
                console.error("SanMar image failed to load:", img);
                setImgIndex((current) => {
                  const next = current + 1;
                  if (next >= imageCandidates.length) {
                    setImgExhausted(true);
                    return current;
                  }
                  return next;
                });
              }}
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
