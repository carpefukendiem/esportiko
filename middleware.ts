import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Let the route handler exchange the OAuth code without refreshing session first;
  // otherwise PKCE cookies can break and Google sign-in fails.
  if (path === "/auth/callback") {
    return NextResponse.next();
  }

  const { response, user } = await updateSession(request);

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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
