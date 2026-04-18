import { NextRequest, NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/auth/admin-email";
import { updateSession } from "@/lib/supabase/middleware";

/** Catalog browse is public; cap Supabase wait so a slow auth.getUser() never blocks HTML. */
const CATALOG_SESSION_TIMEOUT_MS = 3000;

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Let the route handler exchange the OAuth code without refreshing session first;
  // otherwise PKCE cookies can break and Google sign-in fails.
  if (path === "/auth/callback") {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-es-pathname", path);
  const requestWithPath = new NextRequest(request, { headers: requestHeaders });

  const isCatalog =
    path === "/apparel" || path.startsWith("/apparel/");

  let response: NextResponse;
  let user: Awaited<ReturnType<typeof updateSession>>["user"];

  if (isCatalog) {
    try {
      const result = await Promise.race([
        updateSession(requestWithPath),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error("catalog-session-timeout")),
            CATALOG_SESSION_TIMEOUT_MS
          )
        ),
      ]);
      response = result.response;
      user = result.user;
    } catch {
      // Still advance the request with pathname header; skip refresh on timeout only.
      response = NextResponse.next({ request: requestWithPath });
      user = null;
    }
  } else {
    const result = await updateSession(requestWithPath);
    response = result.response;
    user = result.user;
  }

  if (path.startsWith("/portal")) {
    if (!user) {
      const login = new URL("/login", request.url);
      login.searchParams.set("next", path);
      return NextResponse.redirect(login);
    }
  }

  if (path.startsWith("/admin")) {
    if (!user) {
      const login = new URL("/login", request.url);
      login.searchParams.set("next", path);
      return NextResponse.redirect(login);
    }
  }

  if (path === "/login" && user) {
    const nextParam = request.nextUrl.searchParams.get("next") ?? "";
    const goAdmin = nextParam.startsWith("/admin") && isAdminEmail(user.email ?? "");
    const dest = goAdmin ? "/admin" : "/portal/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Skip Next internals, API routes, and static assets so CSS/JS/RSC payloads
     * and HMR are never wrapped by Supabase session refresh.
     */
    "/((?!api|_next/static|_next/image|_next/data|_next/webpack-hmr|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)",
  ],
};
