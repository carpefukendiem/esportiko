/**
 * Normalizes legacy or alternate /apparel/[category] URL segments to the canonical
 * slugs used in DISPLAY_CATEGORIES and CURATED_STYLES_BY_CATEGORY.
 */
const SLUG_ALIASES: Record<string, string> = {
  tshirts: "t-shirts",
  "jerseys-uniforms": "jerseys",
  "t-shirts": "t-shirts",
  "hoodies-sweatshirts": "hoodies-sweatshirts",
  polos: "polos",
  jerseys: "jerseys",
  hats: "hats",
  "jackets-outerwear": "jackets-outerwear",
  bottoms: "bottoms",
  "bags-accessories": "bags-accessories",
};

export function normalizeCategorySlug(raw: string): string {
  const s = raw.trim().toLowerCase();
  return SLUG_ALIASES[s] ?? s;
}
