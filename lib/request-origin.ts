import type { NextRequest } from "next/server";

/**
 * Public site origin for redirects (Vercel uses x-forwarded-host; request.url can be internal).
 */
export function getRequestOrigin(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (forwardedHost) {
    const hostOnly = forwardedHost.split(":")[0] ?? forwardedHost;
    const proto =
      forwardedProto ??
      (hostOnly === "localhost" || hostOnly === "127.0.0.1"
        ? "http"
        : "https");
    return `${proto}://${forwardedHost}`;
  }
  return request.nextUrl.origin;
}
