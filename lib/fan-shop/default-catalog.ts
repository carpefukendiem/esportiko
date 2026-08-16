/** Default fan shop lineup when no custom SKUs are configured (competitor-style starter set). */
export const DEFAULT_FAN_SHOP_STYLES = [
  "5000",
  "65000",
  "NL3600",
  "18600",
  "PC78H",
  "K500",
  "112",
  "ST650",
] as const;

export const DEFAULT_RETAIL_PRICE_CENTS: Record<string, number> = {
  "5000": 2200,
  "65000": 2400,
  "NL3600": 2600,
  "18600": 4500,
  "PC78H": 4200,
  "K500": 3800,
  "112": 2800,
  "ST650": 3600,
};

export function defaultPriceCents(styleNumber: string): number {
  return DEFAULT_RETAIL_PRICE_CENTS[styleNumber.toUpperCase()] ?? 2999;
}
