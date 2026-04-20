import "server-only";

import { enrichCatalogProductsWithSanMarImages } from "@/lib/catalog/enrichSanMarCatalogFromDb";
import {
  getProductInDisplayCategory,
  getProductsByDisplayCategory,
} from "@/lib/catalog/fetcher";
import type { CatalogProduct } from "@/lib/catalog/types";

export async function getCatalogProductsForCategoryPage(
  slug: string
): Promise<CatalogProduct[]> {
  const seed = getProductsByDisplayCategory(slug);
  return enrichCatalogProductsWithSanMarImages(seed);
}

export async function getCatalogProductInCategoryPage(
  categorySlug: string,
  styleNumber: string
): Promise<CatalogProduct | null> {
  const seed = getProductInDisplayCategory(categorySlug, styleNumber);
  if (!seed) return null;
  const [merged] = await enrichCatalogProductsWithSanMarImages([seed]);
  return merged ?? null;
}
