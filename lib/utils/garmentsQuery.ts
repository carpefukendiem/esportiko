/** Parse `?garments=Jerseys,Hoodies` from the request-a-quote garment picker. */
export function parseGarmentsQueryParam(raw: string | null): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((s) => decodeURIComponent(s.trim()))
    .filter(Boolean);
}
