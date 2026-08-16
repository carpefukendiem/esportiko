import type { GarmentSvgKind } from "@/lib/customize/design-types";

const HAT_STYLES = new Set(["112", "355", "356", "1567", "1717"]);

/** Map SanMar category text to compositor garment kind. */
export function garmentKindFromSanmarCategory(category: string): GarmentSvgKind {
  const c = category.toLowerCase();
  if (c.includes("hood") || (c.includes("fleece") && c.includes("pullover"))) return "hoodie";
  if (c.includes("polo")) return "polo";
  if (c.includes("cap") || c.includes("hat") || c.includes("headwear")) return "cap";
  if (c.includes("jersey")) return "jersey";
  return "tshirt";
}

export function garmentKindForStyle(styleNumber: string, sanmarCategory: string): GarmentSvgKind {
  const key = styleNumber.trim().toUpperCase();
  if (HAT_STYLES.has(key)) return "cap";
  return garmentKindFromSanmarCategory(sanmarCategory);
}
