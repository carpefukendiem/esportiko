import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { ensureAccount } from "@/lib/portal/ensureAccount";
import { getRequestOrigin } from "@/lib/request-origin";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get("code");
  const nextPath = url.searchParams.get("next") ?? "/portal/dashboard";
  const origin = getRequestOrigin(request);
  const safeNext = nextPath.startsWith("/") ? nextPath : `/${nextPath}`;

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.redirect(`${origin}/login?error=config`);
  }

  const cookieStore = cookies();
  const redirectTo = `${origin}${safeNext}`;

  // Session cookies must be attached to this response (Route Handler + redirect).
  const response = NextResponse.redirect(redirectTo);

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: { name: string; value: string; options?: object }[]
      ) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("auth callback exchangeCodeForSession", error.message);
    return NextResponse.redirect(`${origin}/login?error=callback`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await ensureAccount(
      supabase,
      user.id,
      user.email ?? undefined,
      user
    );
  }

  return response;
}
