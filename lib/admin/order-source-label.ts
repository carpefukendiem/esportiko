export function orderSourceLabel(source: string | null | undefined): "GHL Quote" | "Portal" {
  if (source === "ghl_quote_webhook") return "GHL Quote";
  return "Portal";
}
