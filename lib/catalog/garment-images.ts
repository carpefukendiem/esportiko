/**
 * Optional raster garment images (SanMar CDN pattern when known).
 * When null, /customize uses vector placeholders tinted by selected color.
 */
export type GarmentImageUrls = {
  front: string | null;
  back: string | null;
};

/** Example CDN shape — swap in real brand/style/color codes when available. */
const EXAMPLES: Record<string, GarmentImageUrls> = {
  // Add verified SanMar URLs per style when available; otherwise compositor uses SVG placeholders.
};

export function getGarmentImageUrls(styleNumber: string): GarmentImageUrls {
  const key = styleNumber.trim().toUpperCase();
  return EXAMPLES[key] ?? { front: null, back: null };
}
