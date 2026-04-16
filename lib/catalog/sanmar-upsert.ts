import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { ParsedStyle } from "@/lib/catalog/sanmar-parser";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase admin env vars missing");
  return createClient(url, key, { auth: { persistSession: false } });
}

const CHUNK = 800;

export async function upsertStyles(styles: ParsedStyle[]): Promise<number> {
  if (!styles.length) return 0;

  const supa = getAdminClient();
  const styleNumbers = styles.map((s) => s.styleNumber);

  const productRows = styles.map((s) => ({
    style_number: s.styleNumber,
    product_title: s.productTitle,
    brand_name: s.brandName,
    product_description: s.productDescription || null,
    sanmar_category: s.sanmarCategory,
    sanmar_subcategory: s.sanmarSubcategory || null,
    status: s.status,
    available_sizes: s.availableSizes || null,
    front_model_url: s.frontModelUrl,
    back_model_url: s.backModelUrl,
    front_flat_url: s.frontFlatUrl,
    back_flat_url: s.backFlatUrl,
    spec_sheet_url: s.specSheetUrl,
    last_synced_at: new Date().toISOString(),
  }));

  const { error: pErr } = await supa
    .from("sanmar_products")
    .upsert(productRows, { onConflict: "style_number" });
  if (pErr) throw new Error(`Upsert products failed: ${pErr.message}`);

  const { error: delSz } = await supa
    .from("sanmar_product_sizes")
    .delete()
    .in("style_number", styleNumbers);
  if (delSz) throw new Error(`Delete sizes failed: ${delSz.message}`);

  const { error: delCol } = await supa
    .from("sanmar_product_colors")
    .delete()
    .in("style_number", styleNumbers);
  if (delCol) throw new Error(`Delete colors failed: ${delCol.message}`);

  const colorRows = styles.flatMap((s) =>
    s.colors.map((c) => ({
      style_number: s.styleNumber,
      catalog_color: c.catalogColor,
      display_color: c.displayColor,
      swatch_image_url: c.swatchImageUrl,
      color_product_url: c.colorProductUrl,
      pms_color: c.pmsColor,
      sort_order: c.sortOrder,
    }))
  );

  for (let i = 0; i < colorRows.length; i += CHUNK) {
    const chunk = colorRows.slice(i, i + CHUNK);
    const { error: cErr } = await supa.from("sanmar_product_colors").insert(chunk);
    if (cErr) throw new Error(`Insert colors failed: ${cErr.message}`);
  }

  const sizeRows = styles.flatMap((s) =>
    s.sizes.map((sz) => ({
      style_number: s.styleNumber,
      catalog_color: sz.catalogColor,
      size: sz.size,
      size_index: sz.sizeIndex || null,
    }))
  );

  for (let i = 0; i < sizeRows.length; i += CHUNK) {
    const chunk = sizeRows.slice(i, i + CHUNK);
    const { error: szErr } = await supa.from("sanmar_product_sizes").insert(chunk);
    if (szErr) throw new Error(`Insert sizes failed: ${szErr.message}`);
  }

  return styles.length;
}

export async function recordSyncRun(input: {
  status: "success" | "error";
  startedAt: string;
  finishedAt: string;
  rowsParsed: number | null;
  stylesUpserted: number | null;
  errorMessage?: string | null;
}) {
  const supa = getAdminClient();
  await supa.from("sanmar_sync_runs").insert({
    started_at: input.startedAt,
    finished_at: input.finishedAt,
    status: input.status,
    rows_parsed: input.rowsParsed,
    styles_upserted: input.stylesUpserted,
    error_message: input.errorMessage ?? null,
  });
}
