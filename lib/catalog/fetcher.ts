/**
 * Catalog data for marketing / browse UI — **seed only** (no Supabase on request path).
 * Pages in app/(website)/apparel/** import exclusively from this file.
 */

import { DISPLAY_CATEGORIES } from "@/lib/catalog/categories";
import { CURATED_STYLES_BY_CATEGORY, CURATED_STYLE_SET } from "@/lib/catalog/curated";
import { normalizeCategorySlug } from "@/lib/catalog/slug-aliases";
import {
  SANMAR_SEED_PRODUCTS,
  type SanMarSeedCategory,
} from "@/lib/data/sanmar-seed";
import { getSanMarImageUrl } from "@/lib/catalog/sanmarImages";
import type {
  CatalogProduct,
  DisplayCategory,
  ProductColor,
  SanMarCategory,
} from "@/lib/catalog/types";

const PLACEHOLDER = "/images/catalog/placeholder.svg";

function seedCategoryToSanMarCategory(cat: SanMarSeedCategory): SanMarCategory {
  switch (cat) {
    case "T-Shirts":
      return "T-Shirts";
    case "Hoodies":
      return "Sweatshirts/Fleece";
    case "Polos":
      return "Polos/Knits";
    case "Jerseys":
      return "Activewear";
    case "Hats":
      return "Caps";
    default:
      return "T-Shirts";
  }
}

function seedDecorationTypes(
  methods: import("@/lib/data/sanmar-seed").SanMarSeedProduct["decoration_methods"]
): string[] {
  const out: string[] = [];
  for (const m of methods) {
    if (m === "Both") {
      out.push("Screen Print", "Embroidery");
    } else {
      out.push(m);
    }
  }
  return [...new Set(out)];
}

function seedProductToCatalogProduct(
  p: import("@/lib/data/sanmar-seed").SanMarSeedProduct
): CatalogProduct {
  const override = p.image_url?.trim();
  const firstColor = p.available_colors[0];
  const colors: ProductColor[] = p.available_colors.map((displayColor) => ({
    catalogColor: displayColor,
    displayColor,
    swatchImageUrl: PLACEHOLDER,
    modelImageUrl: override
      ? override
      : getSanMarImageUrl(p.style_number, displayColor, "Front", "400x400"),
  }));
  const img =
    override ||
    (firstColor
      ? getSanMarImageUrl(p.style_number, firstColor, "Front", "400x400")
      : PLACEHOLDER);
  return {
    uniqueKey: p.style_number.toUpperCase(),
    styleNumber: p.style_number,
    productTitle: p.name,
    brandName: p.brand,
    productDescription: p.description,
    status: "Regular",
    sanMarCategory: seedCategoryToSanMarCategory(p.category),
    availableSizes: p.available_sizes.join(", "),
    colors,
    images: {
      productImageUrl: img,
      thumbnailUrl: img,
    },
    decorationTypes: seedDecorationTypes(p.decoration_methods),
  };
}

let seedCatalogMapCache: Map<string, CatalogProduct> | null = null;

/** Curated seed products as a map (DB-free). */
function getSeedCatalogMap(): Map<string, CatalogProduct> {
  if (seedCatalogMapCache) return seedCatalogMapCache;
  const map = new Map<string, CatalogProduct>();
  for (const p of SANMAR_SEED_PRODUCTS) {
    const key = p.style_number.trim().toUpperCase();
    if (!CURATED_STYLE_SET.has(key)) continue;
    map.set(key, seedProductToCatalogProduct(p));
  }
  seedCatalogMapCache = map;
  return map;
}

export function getDisplayCategories(): DisplayCategory[] {
  return DISPLAY_CATEGORIES;
}

export function getDisplayCategoryBySlug(slug: string): DisplayCategory | null {
  const key = normalizeCategorySlug(slug);
  return DISPLAY_CATEGORIES.find((c) => c.slug === key) ?? null;
}

export function getProductsByDisplayCategory(slug: string): CatalogProduct[] {
  const key = normalizeCategorySlug(slug);
  const order = CURATED_STYLES_BY_CATEGORY[key];
  if (!order?.length) return [];
  const all = getSeedCatalogMap();
  return order
    .map((s) => all.get(s.toUpperCase()))
    .filter((p): p is CatalogProduct => Boolean(p));
}

/** Featured grid on /apparel — curated seed products only. */
export function getCatalogProductsForIndex(limit = 24): CatalogProduct[] {
  return Array.from(getSeedCatalogMap().values())
    .filter((p) => p.status !== "Discontinued")
    .slice(0, limit);
}

export function getProductByStyle(styleNumber: string): CatalogProduct | null {
  const key = styleNumber.trim().toUpperCase();
  const found = getSeedCatalogMap().get(key);
  if (!found || found.status === "Discontinued") return null;
  return found;
}

export function getRelatedProducts(
  slug: string,
  excludeStyleNumber: string
): CatalogProduct[] {
  const all = getProductsByDisplayCategory(slug);
  const ex = excludeStyleNumber.trim().toUpperCase();
  return all.filter((p) => p.styleNumber.toUpperCase() !== ex).slice(0, 4);
}

export function getProductInDisplayCategory(
  categorySlug: string,
  styleNumber: string
): CatalogProduct | null {
  const product = getProductByStyle(styleNumber);
  if (!product) return null;
  const inCategory = getProductsByDisplayCategory(
    normalizeCategorySlug(categorySlug)
  );
  const match = inCategory.some(
    (p) => p.styleNumber.toUpperCase() === product.styleNumber.toUpperCase()
  );
  return match ? product : null;
}
