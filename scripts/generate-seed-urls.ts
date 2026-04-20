import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { flatBackFromFlatFront } from "../lib/catalog/sanmar-epdd-image-url";

function loadEnvLocal() {
  try {
    const p = resolve(process.cwd(), ".env.local");
    const txt = readFileSync(p, "utf8");
    for (const line of txt.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    /* no .env.local */
  }
}

loadEnvLocal();

type SanmarColorRow = {
  catalog_color: string | null;
  display_color: string | null;
  color_product_url: string | null;
  swatch_image_url: string | null;
  sort_order: number | null;
};

type SanmarProductRow = {
  style_number: string;
  product_title: string | null;
  brand_name: string | null;
  front_flat_url: string | null;
  back_flat_url: string | null;
  front_model_url: string | null;
  back_model_url: string | null;
  sanmar_product_colors?: SanmarColorRow[];
};

function isHttpUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  return /^https?:\/\//i.test(value);
}

function joinUrl(base: string, file: string): string {
  const left = base.endsWith("/") ? base.slice(0, -1) : base;
  const right = file.startsWith("/") ? file.slice(1) : file;
  return `${left}/${right}`;
}

function resolveImageUrl(
  maybeUrl: string | null | undefined,
  fallbackDir: string | null | undefined
): string {
  if (!maybeUrl) return "";
  if (isHttpUrl(maybeUrl)) return maybeUrl;
  if (!fallbackDir) return "";
  return joinUrl(fallbackDir, maybeUrl);
}

function getDirFromUrl(url: string | null | undefined): string {
  if (!url || !isHttpUrl(url)) return "";
  const idx = url.lastIndexOf("/");
  if (idx < 0) return "";
  return url.slice(0, idx);
}

async function generateSeedUrls() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      "Missing required env vars NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY"
    );
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabase
    .from("sanmar_products")
    .select(
      `
      style_number,
      product_title,
      brand_name,
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
    .order("style_number");

  if (error) {
    console.error("Error fetching products:", error.message);
    process.exit(1);
  }

  const products = (data ?? []) as SanmarProductRow[];
  console.log(`Found products: ${products.length}`);
  console.log("");
  console.log("// Copy this into your seed enrichment data file:");
  console.log("// Prefer FLAT images, resolve COLOR_PRODUCT_IMAGE filenames against SanMar CDN dirs.");
  console.log("");
  console.log("export const SANMAR_FLAT_IMAGE_OVERRIDES = {");

  for (const product of products) {
    const frontDir = getDirFromUrl(product.front_model_url);
    const backDir = getDirFromUrl(product.back_model_url) || frontDir;
    const frontFlatResolved = resolveImageUrl(product.front_flat_url, frontDir);
    const backFlatResolved = resolveImageUrl(product.back_flat_url, backDir);
    const colors = [...(product.sanmar_product_colors ?? [])].sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    );

    console.log(`  "${product.style_number}": {`);
    console.log(`    frontFlatUrl: "${frontFlatResolved}",`);
    console.log(`    backFlatUrl: "${backFlatResolved}",`);
    console.log("    colors: {");
    for (const color of colors) {
      const display = color.display_color ?? color.catalog_color ?? "";
      const front = resolveImageUrl(color.color_product_url, frontDir);
      const back = front ? flatBackFromFlatFront(front) : "";
      const swatch = resolveImageUrl(color.swatch_image_url, frontDir);
      console.log(`      "${display}": {`);
      console.log(`        catalogColor: "${color.catalog_color ?? ""}",`);
      console.log(`        flatImageUrl: "${front}",`);
      console.log(`        backFlatImageUrl: "${back}",`);
      console.log(`        swatchImageUrl: "${swatch}",`);
      console.log("      },");
    }
    console.log("    },");
    console.log("  },");
  }

  console.log("} as const;");
}

generateSeedUrls().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
