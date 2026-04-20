/**
 * SanMar public catalog image URLs (no auth).
 * Pattern: https://catalog.sanmar.com/imglib/{size}/{Style}_{Color}_{View}.jpg
 */

export const SANMAR_IMGLIB_BASE = "https://catalog.sanmar.com/imglib";

/** Shown when a constructed URL 404s or fails to load (client onError). */
export const SANMAR_IMAGE_PLACEHOLDER = "/images/catalog/placeholder.svg";

/**
 * Known mismatches between marketing color labels and SanMar filename segments.
 * Keys: lowercase, normalized single spaces (slashes already flattened to spaces).
 */
const COLOR_SEGMENT_OVERRIDES: Record<string, string> = {
  "true royal": "TrueRoyal",
  "true navy": "TrueNavy",
  "royal blue": "Royal",
  "navy blue": "Navy",
  "dark grey": "Charcoal",
  "dark gray": "Charcoal",
  "light blue": "LightBlue",
  "safety green": "SafetyGreen",
  "safety orange": "SafetyOrange",
  "cardinal red": "Cardinal",
  maroon: "Maroon",
  "sports grey": "SportGrey",
  "sport grey": "SportGrey",
  "athletic heather": "AthleticHeather",
  "heather navy": "HeatherNavy",
  "iron grey": "IronGrey",
  "iron gray": "IronGrey",
  "grey steel": "GreySteel",
  "forest green": "ForestGreen",
  "kelly green": "KellyGreen",
  "pink raspberry": "PinkRaspberry",
  scarlet: "Scarlet",
  graphite: "Graphite",
  loden: "Loden",
  khaki: "Khaki",
  spruce: "Spruce",
  charcoal: "Charcoal",
  asphalt: "Asphalt",
  "heather grey": "HeatherGrey",
  "heather gray": "HeatherGrey",
};

/**
 * Normalizes a catalog/display color string into the filename segment SanMar uses
 * (PascalCase words concatenated, e.g. "True Royal" → "TrueRoyal").
 * Handles slashes in two-tone names (e.g. "Navy/White" → "NavyWhite").
 */
export function normalizeSanMarColorSegment(colorCode: string): string {
  const raw = colorCode
    .trim()
    .replace(/&/g, " and ")
    .replace(/\//g, " ");
  if (!raw) return "Unknown";

  const key = raw.toLowerCase().replace(/\s+/g, " ").trim();
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

/** True when URL is served from SanMar’s public imglib CDN (use with next/image unoptimized). */
export function isSanMarCatalogUrl(url: string): boolean {
  return url.includes("catalog.sanmar.com");
}

/** Any known SanMar CDN / site host (model, flat, or imglib). Use with next/image unoptimized. */
export function isSanMarHostedImageUrl(url: string): boolean {
  if (!url) return false;
  return /sanmar\.com/i.test(url);
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
