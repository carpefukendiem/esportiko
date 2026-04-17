/**
 * Curated SanMar style numbers per display category.
 * ONLY these styles appear on /apparel/[category]. Everything else in SanMar's
 * catalog is invisible to the site. To add/remove products, edit this file.
 *
 * Rules:
 *  - Use the exact SanMar STYLE# (case-insensitive, stored uppercase).
 *  - Array order is display order.
 *  - Keep lists tight (6–12 per category). Quality > selection.
 *  - Prefer core, high-volume, decoration-friendly styles.
 *  - Review brand restrictions (see lib/catalog/sanmar-brand-restrictions.ts)
 *    before adding Nike, TNF, Carhartt, OGIO, Brooks Brothers, Eddie Bauer,
 *    New Era, Outdoor Research, Stanley/Stella, Tommy Bahama, Travis Mathew,
 *    tentree, Cotopaxi — these are restricted from "third party / DTC" resale
 *    per SanMar policy. Esportiko is a B2B decorator, so display for quote
 *    purposes is defensible, but Ruben should confirm with SanMar in writing
 *    before surfacing those brands.
 */
export const CURATED_STYLES_BY_CATEGORY: Record<string, readonly string[]> = {
  "t-shirts": [
    "PC61",
    "PC55",
    "PC54",
    "DT6000",
    "BC3001",
    "NL6210",
    "ST350",
    "ST450",
  ],
  "hoodies-sweatshirts": [
    "PC78H",
    "PC90H",
    "PC850H",
    "F281",
    "ST254",
    "DT6100",
    "F497",
    "PC850ZH",
  ],
  polos: [
    "K500",
    "K540",
    "K510",
    "K100",
    "ST640",
    "ST650",
  ],
  jerseys: [
    "ST350",
    "ST380",
    "T474",
    "ST700",
    "ST710",
  ],
  hats: [
    "C112",
    "C932",
    "C104",
    "NE1000",
    "CP80",
    "C938",
  ],
  "jackets-outerwear": [
    "J317",
    "J754",
    "J305",
    "ST236",
    "JST72",
    "J342",
  ],
  bottoms: [
    "ST855",
    "PT38",
    "ST800",
    "ST310",
  ],
  "bags-accessories": [
    "BG107",
    "BG204",
    "BG980",
    "BG408",
  ],
};

/** Flatten to a single uppercase set for O(1) allowlist checks. */
export const CURATED_STYLE_SET: ReadonlySet<string> = new Set(
  Object.values(CURATED_STYLES_BY_CATEGORY)
    .flat()
    .map((s) => s.toUpperCase())
);

export function isCuratedStyle(style: string): boolean {
  return CURATED_STYLE_SET.has(style.trim().toUpperCase());
}
