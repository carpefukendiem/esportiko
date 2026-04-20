import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { CatalogProduct, ProductColor } from "@/lib/catalog/types";
import {
  coerceFlatProductFilename,
  flatBackFromFlatFront,
  getDirFromUrl,
  resolveCdnAsset,
} from "@/lib/catalog/sanmar-epdd-image-url";

type DbColor = {
  catalog_color: string | null;
  display_color: string | null;
  color_product_url: string | null;
  swatch_image_url: string | null;
  sort_order: number | null;
};

type DbProduct = {
  style_number: string;
  front_flat_url: string | null;
  back_flat_url: string | null;
  front_model_url: string | null;
  back_model_url: string | null;
  sanmar_product_colors?: DbColor[] | null;
};

function supabaseServerClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim();
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function norm(s: string | null | undefined) {
  return (s ?? "").trim().toLowerCase();
}

function findDbColor(dbColors: DbColor[], seed: ProductColor): DbColor | undefined {
  const cc = norm(seed.catalogColor);
  const dc = norm(seed.displayColor);
  return dbColors.find(
    (c) => norm(c.catalog_color) === cc || norm(c.display_color) === dc
  );
}

/**
 * Merges SanMar EPDD image URLs from Supabase into seed `CatalogProduct`s.
 * Prefers flat lay assets; never assigns model URLs to display fields.
 */
export async function enrichCatalogProductsWithSanMarImages(
  products: CatalogProduct[]
): Promise<CatalogProduct[]> {
  if (!products.length) return products;

  const client = supabaseServerClient();
  if (!client) return products;

  const styles = [...new Set(products.map((p) => p.styleNumber.trim().toUpperCase()))];
  const query = client
    .from("sanmar_products")
    .select(
      `
      style_number,
      front_flat_url,
      back_flat_url,
      front_model_url,
      back_model_url,
      sanmar_product_colors (
        catalog_color,
        display_color,
        color_product_url,
        swatch_image_url,
        sort_order
      )
    `
    )
    .in("style_number", styles);

  const SANMAR_DB_TIMEOUT_MS = 8000;
  let data: DbProduct[] | null = null;
  let error: { message: string } | null = null;
  try {
    const res = await Promise.race([
      query,
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error("sanmar-db-timeout")),
          SANMAR_DB_TIMEOUT_MS
        )
      ),
    ]);
    if (res.error) {
      error = res.error;
    } else {
      data = (res.data ?? []) as DbProduct[];
    }
  } catch {
    return products;
  }

  if (error || !data?.length) return products;

  const byStyle = new Map(
    (data as DbProduct[]).map((row) => [row.style_number.trim().toUpperCase(), row])
  );

  return products.map((p) => {
    const row = byStyle.get(p.styleNumber.trim().toUpperCase());
    if (!row) return p;

    const frontDir = getDirFromUrl(row.front_model_url);
    const backDir = getDirFromUrl(row.back_model_url) || frontDir;

    const styleFrontFlat = resolveCdnAsset(row.front_flat_url, frontDir);
    const styleBackFlat = resolveCdnAsset(row.back_flat_url, backDir);

    const dbColors = [...(row.sanmar_product_colors ?? [])].sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    );

    const colors: ProductColor[] = p.colors.map((seedColor) => {
      const dbColor = findDbColor(dbColors, seedColor);
      let flatFront = "";
      if (dbColor?.color_product_url?.trim()) {
        const flatFile = coerceFlatProductFilename(dbColor.color_product_url);
        flatFront = resolveCdnAsset(flatFile, frontDir);
      }
      let flatBack = "";
      if (flatFront) {
        const d = flatBackFromFlatFront(flatFront);
        if (d && d !== flatFront) flatBack = d;
      }
      if (!flatBack) flatBack = styleBackFlat || "";

      const swatchRaw = (dbColor?.swatch_image_url ?? "").trim();
      const swatchUrl = swatchRaw
        ? resolveCdnAsset(swatchRaw, frontDir)
        : seedColor.swatchImageUrl;

      const mergedFlat = flatFront || seedColor.flatImageUrl || "";

      return {
        ...seedColor,
        swatchImageUrl: swatchUrl || seedColor.swatchImageUrl,
        flatImageUrl: mergedFlat || undefined,
        backFlatImageUrl: flatBack || undefined,
        // Legacy field: flat-only when DB matches this color.
        modelImageUrl: mergedFlat || seedColor.modelImageUrl,
      };
    });

    const thumb =
      colors.find((c) => c.flatImageUrl)?.flatImageUrl ||
      styleFrontFlat ||
      p.images.productImageUrl;

    return {
      ...p,
      colors,
      images: {
        ...p.images,
        productImageUrl: thumb,
        thumbnailUrl: thumb,
        frontFlatUrl: styleFrontFlat || p.images.frontFlatUrl,
        backFlatUrl: styleBackFlat || p.images.backFlatUrl,
        frontModelUrl: undefined,
        backModelUrl: undefined,
      },
    };
  });
}
