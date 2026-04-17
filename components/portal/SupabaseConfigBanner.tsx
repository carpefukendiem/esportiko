"use client";

import {
  isBrowserSupabaseConfigured,
  SUPABASE_ENV_MISSING_USER_MESSAGE,
} from "@/lib/supabase/client";

/** Shown when NEXT_PUBLIC_SUPABASE_* are missing in the client bundle. */
export function SupabaseConfigBanner() {
  if (isBrowserSupabaseConfigured()) return null;
  return (
    <p
      className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 font-sans text-xs font-medium text-amber-200"
      role="status"
    >
      {SUPABASE_ENV_MISSING_USER_MESSAGE}
    </p>
  );
}
