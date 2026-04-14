/**
 * Catalog data fetcher — reads from Supabase, filtered by the curated allowlist.
 * Pages in app/(website)/apparel/** import exclusively from this file.
 * Never import sanmar-ftp / sanmar-parser / sanmar-upsert from page components.
 */

import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { DISPLAY_CATEGORIES } from "@/lib/catalog/categories";
import {
  CURATED_STYLES_BY_CATEGORY,
  CURATED_STYLE_SET,
} from "@/lib/catalog/curated";
import type {
  CatalogProduct,
  DisplayCategory,
  ProductColor,
  SanMarCategory,
} from "@/lib/catalog/types";

const PLACEHOLDER = "/images/catalog/placeholder.svg";

const SANMAR_CATEGORY_VALUES: readonly SanMarCategory[] = [
  "Activewear",
  "Accessories",
  "Bags",
  "Bottoms",
  "Caps",
  "Infant & Toddler",
  "Juniors & Young Men",
  "Outerwear",
  "Personal Protection",
  "Polos/Knits",
  "Sweatshirts/Fleece",
  "T-Shirts",
  "Tall",
  "Women's",
  "Workwear",
  "Woven Shirts",
  "Youth",
] as const;

function coerceSanMarCategory(raw: string): SanMarCategory {
  const t = raw.trim();
  const hit = SANMAR_CATEGORY_VALUES.find(
    (c) => c.toLowerCase() === t.toLowerCase()
  );
  return hit ?? "T-Shirts";
}

function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

type DbProduct = {
  style_number: string;
  product_title: string;
  brand_name: string;
  product_description: string | null;
  sanmar_category: string;
  status: string;
  available_sizes: string | null;
  front_model_url: string | null;
  back_model_url: string | null;
  front_flat_url: string | null;
  back_flat_url: string | null;
  spec_sheet_url: string | null;
};

type DbColor = {
  style_number: string;
  catalog_color: string;
  display_color: string;
  swatch_image_url: string | null;
  color_product_url: string | null;
  sort_order: number;
};

function toCatalogProduct(p: DbProduct, colors: DbColor[]): CatalogProduct {
  const sorted = [...colors].sort((a, b) => a.sort_order - b.sort_order);
  const status = (p.status as CatalogProduct["status"]) ?? "Regular";
  const mapColor = (c: DbColor): ProductColor => ({
    catalogColor: c.catalog_color,
    displayColor: c.display_color,
    swatchImageUrl: c.swatch_image_url ?? PLACEHOLDER,
    modelImageUrl:
      c.color_product_url ??
      p.front_model_url ??
      PLACEHOLDER,
  });
  return {
    uniqueKey: p.style_number,
    styleNumber: p.style_number,
    productTitle: p.product_title,
    brandName: p.brand_name,
    productDescription: p.product_description ?? "",
    status,
    sanMarCategory: coerceSanMarCategory(p.sanmar_category),
    availableSizes: p.available_sizes ?? "",
    colors: sorted.map(mapColor),
    images: {
      productImageUrl: p.front_model_url ?? PLACEHOLDER,
      thumbnailUrl: p.front_model_url ?? PLACEHOLDER,
      frontModelUrl: p.front_model_url ?? undefined,
      backModelUrl: p.back_model_url ?? undefined,
      frontFlatUrl: p.front_flat_url ?? undefined,
      specSheetUrl: p.spec_sheet_url ?? undefined,
    },
    decorationTypes: ["Screen Print", "Embroidery"],
  };
}

const PRODUCT_SELECT =
  "style_number,product_title,brand_name,product_description,sanmar_category,status,available_sizes,front_model_url,back_model_url,front_flat_url,back_flat_url,spec_sheet_url";

const COLOR_SELECT =
  "style_number,catalog_color,display_color,swatch_image_url,color_product_url,sort_order";

async function loadAllCuratedInner(): Promise<Map<string, CatalogProduct>> {
  const supa = publicClient();
  if (!supa) return new Map();

  const styles = Array.from(CURATED_STYLE_SET);
  if (!styles.length) return new Map();

  const { data: products, error: pErr } = await supa
    .from("sanmar_products")
    .select(PRODUCT_SELECT)
    .in("style_number", styles)
    .neq("status", "Discontinued");

  if (pErr) throw new Error(pErr.message);

  const { data: colors, error: cErr } = await supa
    .from("sanmar_product_colors")
    .select(COLOR_SELECT)
    .in("style_number", styles);

  if (cErr) throw new Error(cErr.message);

  const colorsByStyle = new Map<string, DbColor[]>();
  for (const c of colors ?? []) {
    const arr = colorsByStyle.get(c.style_number) ?? [];
    arr.push(c);
    colorsByStyle.set(c.style_number, arr);
  }

  const result = new Map<string, CatalogProduct>();
  for (const p of products ?? []) {
    result.set(
      p.style_number.toUpperCase(),
      toCatalogProduct(p, colorsByStyle.get(p.style_number) ?? [])
    );
  }
  return result;
}

const loadAllCurated = unstable_cache(
  async () => loadAllCuratedInner(),
  ["sanmar-catalog-all"],
  { revalidate: 3600, tags: ["sanmar-catalog"] }
);

export async function getDisplayCategories(): Promise<DisplayCategory[]> {
  return DISPLAY_CATEGORIES;
}

export async function getDisplayCategoryBySlug(
  slug: string
): Promise<DisplayCategory | null> {
  return DISPLAY_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export async function getProductsByDisplayCategory(
  slug: string
): Promise<CatalogProduct[]> {
  const order = CURATED_STYLES_BY_CATEGORY[slug];
  if (!order?.length) return [];
  try {
    const all = await loadAllCurated();
    return order
      .map((s) => all.get(s.toUpperCase()))
      .filter((p): p is CatalogProduct => Boolean(p));
  } catch {
    return [];
  }
}

export async function getProductByStyle(
  styleNumber: string
): Promise<CatalogProduct | null> {
  const key = styleNumber.trim().toUpperCase();
  try {
    const all = await loadAllCurated();
    const found = all.get(key);
    if (!found || found.status === "Discontinued") return null;
    return found;
  } catch {
    return null;
  }
}

export async function getRelatedProducts(
  slug: string,
  excludeStyleNumber: string
): Promise<CatalogProduct[]> {
  const all = await getProductsByDisplayCategory(slug);
  const ex = excludeStyleNumber.trim().toUpperCase();
  return all.filter((p) => p.styleNumber.toUpperCase() !== ex).slice(0, 4);
}

export async function getProductInDisplayCategory(
  categorySlug: string,
  styleNumber: string
): Promise<CatalogProduct | null> {
  const product = await getProductByStyle(styleNumber);
  if (!product) return null;
  const inCategory = await getProductsByDisplayCategory(categorySlug);
  const match = inCategory.some(
    (p) => p.styleNumber.toUpperCase() === product.styleNumber.toUpperCase()
  );
  return match ? product : null;
}
