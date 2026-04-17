/**
 * Map catalog color names to approximate CSS fills for swatches.
 */
const NAMED: Record<string, string> = {
  black: "#1a1a1a",
  white: "#f5f5f5",
  navy: "#1e3a5f",
  red: "#c41e3a",
  royal: "#2563eb",
  "royal blue": "#2563eb",
  "heather grey": "#9ca3af",
  "heather gray": "#9ca3af",
  charcoal: "#4b5563",
  maroon: "#7f1d1d",
  forest: "#14532d",
  "forest green": "#14532d",
  kelly: "#15803d",
  gold: "#ca8a04",
  orange: "#ea580c",
  purple: "#7c3aed",
  pink: "#db2777",
  sand: "#d6c4a8",
  natural: "#e8dcc8",
  athletic: "#6b7280",
};

export function approximateSwatchColor(displayColor: string): string {
  const key = displayColor.trim().toLowerCase();
  if (NAMED[key]) return NAMED[key];
  for (const [k, v] of Object.entries(NAMED)) {
    if (key.includes(k)) return v;
  }
  return "#6b7280";
}
