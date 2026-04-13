import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Shown on auth UI when NEXT_PUBLIC_* vars were missing at build time. */
export const SUPABASE_ENV_MISSING_USER_MESSAGE =
  "Team sign-in isn’t configured for this deployment. In Vercel go to Settings → Environment Variables and set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY for Production (and Preview if you use it), then redeploy. These must be present at build time so they are included in the app.";

export function isBrowserSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return Boolean(url && key);
}

/** Use in client components that must not throw when env is missing (e.g. site header). */
export function createBrowserClientIfConfigured(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}

/** Throws if misconfigured — use where fail-fast is acceptable. */
export function createClient(): SupabaseClient {
  const client = createBrowserClientIfConfigured();
  if (!client) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return client;
}
