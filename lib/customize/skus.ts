/**
 * Style numbers shown on /customize.
 * To add or remove SKUs from the customize page, edit this list.
 * If a SKU isn't in sanmar_products (e.g., not in SanMar's catalog),
 * it's silently omitted from the page.
 */
export const CUSTOMIZE_STYLE_NUMBERS = [
  "A4N3402", // A4 cooling performance tee
  "NL6010", // Next Level tri-blend tee
  "NL6600", // Next Level ladies CVC tee
  "NL3600", // Next Level cotton tee
  "DT6200", // District perfect tri tee
  "112", // Richardson trucker cap
  "355", // Richardson cap
  "356", // Richardson cap
  "18600", // Gildan heavy blend hoodie
  "5000", // Gildan heavy cotton tee
  "65000", // Gildan softstyle tee
  "1567", // Richardson
  "1717", // Richardson
  "9360", // Ogio
] as const;

export type CustomizeStyleNumber = (typeof CUSTOMIZE_STYLE_NUMBERS)[number];
