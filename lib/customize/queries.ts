import "server-only";
import { createClient } from "@supabase/supabase-js";
import { CUSTOMIZE_STYLE_NUMBERS } from "./skus";
import type { CustomizeProduct } from "./types";

export type { CustomizeProduct } from "./types";

export async function getCustomizeProducts(): Promise<CustomizeProduct[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error("[customize/queries] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    return [];
  }

  const supabase = createClient(url, key);

  const styleKeys = CUSTOMIZE_STYLE_NUMBERS.map((s) => s.toUpperCase());

  const { data: products, error } = await supabase
    .from("sanmar_products")
    .select(
      "style_number, product_title, brand_name, product_description, sanmar_category, available_sizes, front_flat_url, back_flat_url"
    )
    .in("style_number", styleKeys);

  if (error) {
    console.error("[customize/queries] products error:", error);
    return [];
  }
  if (!products?.length) return [];

  const styles = products.map((p) => p.style_number);

  const [colorsRes, sizesRes] = await Promise.all([
    supabase
      .from("sanmar_product_colors")
      .select("style_number, catalog_color, display_color, pms_color, swatch_image_url")
      .in("style_number", styles)
      .order("sort_order"),
    supabase.from("sanmar_product_sizes").select("style_number, size").in("style_number", styles),
  ]);

  const colorsByStyle = new Map<string, CustomizeProduct["colors"]>();
  const sizesByStyle = new Map<string, Set<string>>();

  for (const c of colorsRes.data ?? []) {
    if (!colorsByStyle.has(c.style_number)) colorsByStyle.set(c.style_number, []);
    colorsByStyle.get(c.style_number)!.push({
      catalog_color: c.catalog_color,
      display_color: c.display_color,
      pms_color: c.pms_color,
      swatch_image_url: c.swatch_image_url,
    });
  }

  for (const s of sizesRes.data ?? []) {
    if (!sizesByStyle.has(s.style_number)) sizesByStyle.set(s.style_number, new Set());
    sizesByStyle.get(s.style_number)!.add(s.size);
  }

  const orderMap = new Map(CUSTOMIZE_STYLE_NUMBERS.map((s, i) => [s.toUpperCase(), i]));

  return products
    .sort((a, b) => (orderMap.get(a.style_number) ?? 999) - (orderMap.get(b.style_number) ?? 999))
    .map((p) => ({
      style_number: p.style_number,
      product_title: p.product_title,
      brand_name: p.brand_name,
      product_description: p.product_description,
      sanmar_category: p.sanmar_category,
      available_sizes: p.available_sizes,
      front_flat_url: p.front_flat_url,
      back_flat_url: p.back_flat_url,
      colors: colorsByStyle.get(p.style_number) ?? [],
      sizes: Array.from(sizesByStyle.get(p.style_number) ?? []).sort(),
    }));
}
