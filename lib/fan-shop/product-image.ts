/** SanMar sometimes returns a generic “image not available” JPEG for model_front URLs. */
export function isBrokenSanmarProductImage(url: string | null | undefined): boolean {
  if (!url?.trim()) return true;
  const u = url.toLowerCase();
  return (
    u.includes("not_yet_available") ||
    u.includes("not yet available") ||
    u.includes("image_not_available") ||
    u.includes("noimage")
  );
}

/** Prefer a color-specific photo; fall back to style-level flat when color art is missing. */
export function pickProductRasterUrl(
  colorUrl: string | null | undefined,
  flatUrl: string | null | undefined
): string | null {
  if (colorUrl && !isBrokenSanmarProductImage(colorUrl)) return colorUrl;
  if (flatUrl && !isBrokenSanmarProductImage(flatUrl)) return flatUrl;
  return colorUrl ?? flatUrl ?? null;
}
