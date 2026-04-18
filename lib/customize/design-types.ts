export type DesignElementType = "image" | "text";

export type DesignElement = {
  id: string;
  type: DesignElementType;
  /** Which garment face this element belongs to. */
  view: "front" | "back";
  src?: string;
  text?: string;
  fontFamily?: string;
  color?: string;
  bold?: boolean;
  letterSpacing?: number;
  fontSize?: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked?: boolean;
};

export type GarmentSvgKind = "tshirt" | "hoodie" | "polo" | "jersey" | "cap";

export const FONT_OPTIONS = [
  { id: "Bebas Neue", label: "Bebas Neue (condensed block)" },
  { id: "Oswald", label: "Oswald (athletic condensed)" },
  { id: "Anton", label: "Anton (heavy impact)" },
  { id: "Permanent Marker", label: "Permanent Marker (hand-drawn)" },
  { id: "Archivo Black", label: "Archivo Black (modern bold)" },
  { id: "Playfair Display", label: "Playfair Display (elegant serif)" },
  { id: "Staatliches", label: "Staatliches (collegiate)" },
] as const;

export const INK_SWATCHES = [
  { name: "White", hex: "#ffffff" },
  { name: "Black", hex: "#111111" },
  { name: "Red", hex: "#dc2626" },
  { name: "Royal Blue", hex: "#2563eb" },
  { name: "Yellow", hex: "#facc15" },
  { name: "Forest Green", hex: "#166534" },
  { name: "Orange", hex: "#ea580c" },
  { name: "Pink", hex: "#db2777" },
  { name: "Purple", hex: "#7c3aed" },
  { name: "Silver", hex: "#cbd5e1" },
  { name: "Gold", hex: "#d4af37" },
] as const;

export type SanMarSeedCategory =
  import("@/lib/data/sanmar-seed").SanMarSeedCategory;

export function seedCategoryToGarmentKind(cat: SanMarSeedCategory): GarmentSvgKind {
  switch (cat) {
    case "Hoodies":
      return "hoodie";
    case "Polos":
      return "polo";
    case "Jerseys":
      return "jersey";
    case "Hats":
      return "cap";
    default:
      return "tshirt";
  }
}

export function cloneElementsForPersist(elements: DesignElement[]): DesignElement[] {
  return elements.map((e) => ({ ...e }));
}
