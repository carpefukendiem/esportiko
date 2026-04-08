"use client";

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

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="h-full"
    >
      <Link
        href={`/apparel/${category.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-card border border-slate/20 bg-navy-light transition-colors hover:border-blue-accent/50"
      >
        <div className="relative aspect-[4/3] w-full bg-slate/20">
          <div className="flex h-full items-center justify-center text-blue-light/40 transition-colors group-hover:text-blue-light/60">
            <Icon className="h-14 w-14" aria-hidden />
          </div>
        </div>
        <div className="flex flex-1 flex-col px-4 py-4">
          <h2 className="font-display text-base font-semibold text-white">
            {category.label}
          </h2>
          <p className="mt-2 flex-1 text-body-sm text-gray-soft">
            {category.description}
          </p>
          <span className="mt-3 inline-flex font-sans text-body-sm font-semibold text-blue-light transition-colors group-hover:text-white">
            View styles →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
