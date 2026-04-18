/**
 * Map common apparel color names (SanMar / catalog display) to CSS hex.
 * Used by /customize placeholder garment fill when no raster is available.
 */
export const APPAREL_COLOR_HEX: Record<string, string> = {
  Black: "#1a1a1a",
  White: "#f5f5f5",
  Navy: "#1a2744",
  "True Navy": "#152238",
  "Royal Blue": "#2451a3",
  Royal: "#2451a3",
  "True Royal": "#1d4ed8",
  Red: "#c41230",
  Scarlet: "#b91c1c",
  Cardinal: "#8b1538",
  "Forest Green": "#1e4d2b",
  "Kelly Green": "#166534",
  Charcoal: "#36454f",
  "Athletic Gold": "#ffb81c",
  Maroon: "#5c0a23",
  "Sport Grey": "#8a8d8f",
  "Sports Grey": "#8a8d8f",
  "Athletic Heather": "#6b7280",
  "Iron Grey": "#4b5563",
  "Heather Navy": "#374151",
  Asphalt: "#4b5563",
  Stone: "#a8a29e",
  Khaki: "#c4b89a",
  Spruce: "#2f4f4f",
  Loden: "#556b2f",
  "Grey Steel": "#6b7280",
  "Pink Raspberry": "#be185d",
  Graphite: "#3f3f46",
  "Grey/Black": "#4b5563",
  "White/Black": "#e5e7eb",
  "True Royal/White": "#1d4ed8",
  "Scarlet/White": "#dc2626",
  "Navy/White": "#1e3a5f",
  "Black/Scarlet": "#1a1a1a",
  "Royal/White": "#2563eb",
  "Purple/Gold": "#6b21a8",
  "Navy/Charcoal": "#1e293b",
  "Black/Charcoal": "#27272a",
  "Cardinal/White": "#991b1b",
  "Black/Black": "#171717",
};

export function colorNameToHex(name: string): string {
  const key = name.trim();
  if (APPAREL_COLOR_HEX[key]) return APPAREL_COLOR_HEX[key];
  const lower = Object.keys(APPAREL_COLOR_HEX).find(
    (k) => k.toLowerCase() === key.toLowerCase()
  );
  if (lower) return APPAREL_COLOR_HEX[lower];
  return "#4b5563";
}
