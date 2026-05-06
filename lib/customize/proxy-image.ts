const SANMAR_HOSTS = ["cdnp.sanmar.com", "cdnm.sanmar.com"];

/**
 * Wraps a SanMar CDN URL in our /api/sanmar-image proxy so canvas/CORS works.
 * Non-SanMar URLs and falsy values pass through unchanged.
 */
export function proxySanmarUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (SANMAR_HOSTS.includes(parsed.hostname)) {
      return `/api/sanmar-image?url=${encodeURIComponent(url)}`;
    }
    return url;
  } catch {
    return url;
  }
}
