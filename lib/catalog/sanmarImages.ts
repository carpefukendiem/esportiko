/**
 * SanMar public catalog image URLs (no auth).
 * Pattern: https://catalog.sanmar.com/imglib/{size}/{Style}_{Color}_{View}.jpg
 */

export const SANMAR_IMGLIB_BASE = "https://catalog.sanmar.com/imglib";

/** Shown when a constructed URL 404s or fails to load (client onError). */
export const SANMAR_IMAGE_PLACEHOLDER = "/images/catalog/placeholder.svg";

/** Known mismatches between marketing color labels and SanMar filename segments. */
const COLOR_SEGMENT_OVERRIDES: Record<string, string> = {
  // Add entries when a seed/display label does not match SanMar’s file segment.
};

/**
 * Normalizes a catalog/display color string into the filename segment SanMar uses
 * (typically PascalCase words concatenated, e.g. "True Royal" → "TrueRoyal").
 */
export function normalizeSanMarColorSegment(colorCode: string): string {
  const raw = colorCode.trim().replace(/&/g, " and ");
  if (!raw) return "Unknown";
  const key = raw.toLowerCase();
  if (COLOR_SEGMENT_OVERRIDES[key]) return COLOR_SEGMENT_OVERRIDES[key];

  const words = raw
    .replace(/[^a-zA-Z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "Unknown";

  return words
    .map((w) => {
      const parts = w.split("-");
      return parts
        .map((p) => {
          if (!p.length) return p;
          return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
        })
        .join("-");
    })
    .join("");
}

function sanitizeStyleCode(styleCode: string): string {
  return styleCode.trim().replace(/[^A-Za-z0-9_-]/g, "");
}

function sanitizeView(view: string): string {
  const v = view.trim();
  if (!v) return "Front";
  return v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
}

/**
 * Constructs SanMar image URL from style code, color code, and view.
 */
export function getSanMarImageUrl(
  styleCode: string,
  colorCode: string,
  view: string = "Front",
  size: string = "600x600"
): string {
  const style = sanitizeStyleCode(styleCode).toUpperCase();
  const colorSeg = normalizeSanMarColorSegment(colorCode);
  const viewSeg = sanitizeView(view);
  const sizeSeg = size.trim() || "600x600";
  return `${SANMAR_IMGLIB_BASE}/${sizeSeg}/${style}_${colorSeg}_${viewSeg}.jpg`;
}

/**
 * Builds URLs for multiple catalog views (same color).
 */
export function getSanMarImageUrls(
  styleCode: string,
  colorCode: string,
  views: string[] = ["Front", "Back", "Side"],
  size: string = "600x600"
): string[] {
  return views.map((v) => getSanMarImageUrl(styleCode, colorCode, v, size));
}

export function getSanMarImageWithFallback(
  styleCode: string,
  colorCode: string,
  view?: string,
  size?: string
): { src: string; fallbackSrc: string } {
  return {
    src: getSanMarImageUrl(
      styleCode,
      colorCode,
      view ?? "Front",
      size ?? "600x600"
    ),
    fallbackSrc: SANMAR_IMAGE_PLACEHOLDER,
  };
}
