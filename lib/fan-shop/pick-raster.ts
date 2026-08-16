import type { GarmentSvgKind } from "@/lib/customize/design-types";
import { isBrokenSanmarProductImage } from "./product-image";

type ColorRow = { color_product_url: string | null };

/**
 * Pick the best SanMar raster for fan shop previews.
 * Hats: color hat_detail shots. Apparel: prefer style-level flat front for stable overlays.
 */
export function pickFanShopRasterUrl(params: {
  garmentKind: GarmentSvgKind;
  flatUrl: string | null | undefined;
  colorRows: ColorRow[];
}): string | null {
  const { garmentKind, colorRows } = params;
  const flatUrl = params.flatUrl ?? null;

  if (garmentKind === "cap") {
    for (const row of colorRows) {
      const u = row.color_product_url;
      if (u && /hat_detail|_hat_/i.test(u)) return u;
    }
    return (
      colorRows.find((r) => r.color_product_url && !isBrokenSanmarProductImage(r.color_product_url))
        ?.color_product_url ??
      flatUrl ??
      colorRows[0]?.color_product_url ??
      null
    );
  }

  if (flatUrl && !isBrokenSanmarProductImage(flatUrl)) {
    return flatUrl;
  }

  for (const row of colorRows) {
    const u = row.color_product_url;
    if (!u || isBrokenSanmarProductImage(u)) continue;
    if (/flatfront|flat_front|_flat\./i.test(u)) return u;
  }

  for (const row of colorRows) {
    const u = row.color_product_url;
    if (u && !isBrokenSanmarProductImage(u)) return u;
  }

  return flatUrl ?? colorRows[0]?.color_product_url ?? null;
}
