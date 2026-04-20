/**
 * Resolve SanMar EPDD image fields: full HTTPS URLs pass through; bare filenames
 * join against a directory taken from any full SanMar CDN URL on the same row.
 */

export function isHttpUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  return /^https?:\/\//i.test(value.trim());
}

export function joinUrl(base: string, file: string): string {
  const left = base.endsWith("/") ? base.slice(0, -1) : base;
  const right = file.startsWith("/") ? file.slice(1) : file;
  return `${left}/${right}`;
}

/** Directory portion of a full URL (no trailing slash). */
export function getDirFromUrl(url: string | null | undefined): string {
  if (!url || !isHttpUrl(url)) return "";
  const idx = url.lastIndexOf("/");
  if (idx < 0) return "";
  return url.slice(0, idx);
}

export function resolveCdnAsset(
  maybeUrl: string | null | undefined,
  fallbackDir: string | null | undefined
): string {
  const raw = (maybeUrl ?? "").trim();
  if (!raw) return "";
  if (isHttpUrl(raw)) return raw;
  const dir = (fallbackDir ?? "").trim();
  if (!dir) return "";
  return joinUrl(dir, raw);
}

/** Prefer flat filenames; if EPDD only has model filename, swap to flat. */
export function coerceFlatProductFilename(file: string | null | undefined): string {
  const t = (file ?? "").trim();
  if (!t) return "";
  if (/flat/i.test(t)) return t;
  return t
    .replace(/_model_/gi, "_flat_")
    .replace(/model_front/gi, "flat_front")
    .replace(/model_back/gi, "flat_back");
}

export function flatBackFromFlatFront(flatFrontUrl: string): string {
  if (!flatFrontUrl) return "";
  return flatFrontUrl.replace(/_flat_front(?=\.[a-z0-9]+($|\?))/i, "_flat_back");
}
