"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Circle,
  CircleDot,
  Footprints,
  Layers,
  Shirt,
  ShoppingBag,
  Trophy,
  Wind,
} from "lucide-react";
import { CATEGORY_CARD_IMAGE_BY_SLUG } from "@/lib/catalog/category-card-images";
import type { DisplayCategory } from "@/lib/catalog/types";

const ICON_MAP: Record<string, LucideIcon> = {
  Shirt,
  Layers,
  CircleDot,
  Trophy,
  Circle,
  Wind,
  Footprints,
  ShoppingBag,
};

export function CategoryCard({ category }: { category: DisplayCategory }) {
  const Icon = ICON_MAP[category.icon] ?? Shirt;
  const imageSrc = CATEGORY_CARD_IMAGE_BY_SLUG[category.slug];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="h-full"
    >
      <Link
        href={`/apparel/${category.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#2A3347] bg-[#1C2333] transition-all hover:border-[#3B7BF8]"
        aria-label={`Browse ${category.label}`}
      >
        <div className="relative aspect-square w-full overflow-hidden bg-[#2A3347]">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={category.label}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 45vw, 18vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-blue-light/40 transition-colors group-hover:text-blue-light/60">
              <Icon className="h-14 w-14" aria-hidden />
            </div>
          )}
        </div>
        <div className="px-4 py-4 text-center">
          <h2 className="font-display text-base font-semibold text-white md:text-lg">
            {category.label}
          </h2>
        </div>
      </Link>
    </motion.div>
  );
}
