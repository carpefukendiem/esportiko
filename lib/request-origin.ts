import type { NextRequest } from "next/server";

/** Origin for redirects from route handlers (falls back to env or localhost). */
export function getRequestOrigin(request: NextRequest): string {
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, "") ??
    "localhost:3000";
  return `${proto}://${host}`;
}
