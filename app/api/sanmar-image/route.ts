import { NextRequest, NextResponse } from "next/server";

// Whitelist of allowed SanMar CDN hosts to prevent abuse as an open proxy
const ALLOWED_HOSTS = new Set([
  "cdnp.sanmar.com",
  "cdnm.sanmar.com",
]);

export const runtime = "nodejs";
export const revalidate = 86400; // 24h

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return new NextResponse("Invalid url", { status: 400 });
  }

  if (!ALLOWED_HOSTS.has(parsed.hostname)) {
    return new NextResponse("Host not allowed", { status: 403 });
  }

  try {
    const upstream = await fetch(parsed.toString(), {
      headers: {
        // Some CDNs are picky about UA
        "User-Agent": "Mozilla/5.0 Esportiko-ImageProxy",
      },
      // Cache aggressively at the edge
      next: { revalidate: 86400 },
    });

    if (!upstream.ok) {
      return new NextResponse(`Upstream error: ${upstream.status}`, {
        status: upstream.status,
      });
    }

    const contentType = upstream.headers.get("content-type") ?? "image/jpeg";
    const buffer = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("[sanmar-image proxy] fetch failed", err);
    return new NextResponse("Proxy fetch failed", { status: 502 });
  }
}
