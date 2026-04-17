import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Let the route handler exchange the OAuth code without refreshing session first;
  // otherwise PKCE cookies can break and Google sign-in fails.
  if (path === "/auth/callback") {
    return NextResponse.next();
  }

  // Public marketing catalog — skip Supabase session refresh so browse pages never
  // block on auth.getUser() network latency or stalls.
  if (path === "/apparel" || path.startsWith("/apparel/")) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-es-pathname", path);
  const requestWithPath = new NextRequest(request, { headers: requestHeaders });

  const { response, user } = await updateSession(requestWithPath);

  if (path.startsWith("/portal")) {
    if (!user) {
      const login = new URL("/login", request.url);
      login.searchParams.set("next", path);
      return NextResponse.redirect(login);
    }
  }

  if (path === "/login" && user) {
    return NextResponse.redirect(new URL("/portal/dashboard", request.url));
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
