import "server-only";
import Papa from "papaparse";
import { CURATED_STYLE_SET } from "@/lib/catalog/curated";

/**
 * Columns we care about from SanMar_EPDD.csv.
 * Ignore all PRICE_* and CASE_* fields — this is not an ecommerce site.
 */
export interface EpddRow {
  UNIQUE_KEY?: string;
  PRODUCT_TITLE?: string;
  PRODUCT_DESCRIPTION?: string;
  "STYLE#"?: string;
  AVAILABLE_SIZES?: string;
  CATEGORY_NAME?: string;
  SUBCATEGORY_NAME?: string;
  COLOR_NAME?: string;
  SANMAR_MAINFRAME_COLOR?: string;
  COLOR_SQUARE_IMAGE?: string;
  COLOR_PRODUCT_IMAGE?: string;
  PMS_COLOR?: string;
  SIZE?: string;
  SIZE_INDEX?: string;
  MILL?: string;
  PRODUCT_STATUS?: string;
  MSRP?: string;
  FRONT_MODEL_IMAGE_URL?: string;
  BACK_MODEL_IMAGE_URL?: string;
  FRONT_FLAT_IMAGE_URL?: string;
  BACK_FLAT_IMAGE_URL?: string;
  DECORATION_SPEC_SHEET?: string;
}

export interface ParsedStyle {
  styleNumber: string;
  productTitle: string;
  brandName: string;
  productDescription: string;
  status: "Active" | "New" | "Coming Soon" | "Regular" | "Discontinued";
  sanmarCategory: string;
  sanmarSubcategory: string;
  availableSizes: string;
  frontModelUrl: string | null;
  backModelUrl: string | null;
  frontFlatUrl: string | null;
  backFlatUrl: string | null;
  specSheetUrl: string | null;
  colors: Array<{
    catalogColor: string;
    displayColor: string;
    swatchImageUrl: string | null;
    colorProductUrl: string | null;
    pmsColor: string | null;
    sortOrder: number;
  }>;
  sizes: Array<{
    catalogColor: string;
    size: string;
    sizeIndex: string;
  }>;
}

const EMPTY = (v: string | undefined | null) => (v ?? "").trim();

function normalizeStatus(raw: string | undefined): ParsedStyle["status"] {
  const s = (raw ?? "").trim();
  const lower = s.toLowerCase();
  if (lower === "active") return "Active";
  if (lower === "new") return "New";
  if (lower === "coming soon") return "Coming Soon";
  if (lower === "discontinued") return "Discontinued";
  if (lower === "regular") return "Regular";
  if (
    s === "Active" ||
    s === "New" ||
    s === "Coming Soon" ||
    s === "Regular" ||
    s === "Discontinued"
  ) {
    return s;
  }
  return "Regular";
}

function firstNonEmpty(...vals: (string | null | undefined)[]): string | null {
  for (const v of vals) {
    const t = (v ?? "").trim();
    if (t) return t;
  }
  return null;
}

export interface ParseEpddResult {
  styles: ParsedStyle[];
  rowCount: number;
}

/**
 * Parse EPDD CSV → one ParsedStyle per STYLE# in the curated allowlist.
 * Non-curated rows are discarded on the first pass for memory efficiency.
 */
export function parseEpddCsv(csv: string): ParseEpddResult {
  const parsed = Papa.parse<EpddRow>(csv, {
    header: true,
    skipEmptyLines: true,
    quoteChar: '"',
    delimiter: ",",
  });

  const data = parsed.data ?? [];
  const rowCount = data.length;

  const byStyle = new Map<string, ParsedStyle>();

  for (const row of data) {
    const style = EMPTY(row["STYLE#"]).toUpperCase();
    if (!style || !CURATED_STYLE_SET.has(style)) continue;

    let entry = byStyle.get(style);
    if (!entry) {
      const catRaw = EMPTY(row.CATEGORY_NAME);
      const catFirst = catRaw.split(";")[0]?.trim() ?? "";
      entry = {
        styleNumber: style,
        productTitle: EMPTY(row.PRODUCT_TITLE),
        brandName: EMPTY(row.MILL),
        productDescription: EMPTY(row.PRODUCT_DESCRIPTION),
        status: normalizeStatus(row.PRODUCT_STATUS),
        sanmarCategory: catFirst,
        sanmarSubcategory: EMPTY(row.SUBCATEGORY_NAME),
        availableSizes: EMPTY(row.AVAILABLE_SIZES),
        frontModelUrl: firstNonEmpty(row.FRONT_MODEL_IMAGE_URL),
        backModelUrl: firstNonEmpty(row.BACK_MODEL_IMAGE_URL),
        frontFlatUrl: firstNonEmpty(row.FRONT_FLAT_IMAGE_URL),
        backFlatUrl: firstNonEmpty(row.BACK_FLAT_IMAGE_URL),
        specSheetUrl: firstNonEmpty(row.DECORATION_SPEC_SHEET),
        colors: [],
        sizes: [],
      };
      byStyle.set(style, entry);
    }

    const catalogColor =
      EMPTY(row.SANMAR_MAINFRAME_COLOR) || EMPTY(row.COLOR_NAME);
    const displayColor = EMPTY(row.COLOR_NAME);
    if (
      catalogColor &&
      !entry.colors.find((c) => c.catalogColor === catalogColor)
    ) {
      entry.colors.push({
        catalogColor,
        displayColor: displayColor || catalogColor,
        swatchImageUrl: firstNonEmpty(row.COLOR_SQUARE_IMAGE),
        colorProductUrl: firstNonEmpty(row.COLOR_PRODUCT_IMAGE),
        pmsColor: firstNonEmpty(row.PMS_COLOR),
        sortOrder: entry.colors.length,
      });
    }

    const size = EMPTY(row.SIZE);
    if (catalogColor && size) {
      const sizeKey = `${catalogColor}::${size}`;
      if (
        !entry.sizes.find((sz) => `${sz.catalogColor}::${sz.size}` === sizeKey)
      ) {
        entry.sizes.push({
          catalogColor,
          size,
          sizeIndex: EMPTY(row.SIZE_INDEX),
        });
      }
    }
  }

  return { styles: Array.from(byStyle.values()), rowCount };
}
