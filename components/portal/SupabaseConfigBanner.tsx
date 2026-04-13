"use client";

import {
  isBrowserSupabaseConfigured,
  SUPABASE_ENV_MISSING_USER_MESSAGE,
} from "@/lib/supabase/client";

export function SupabaseConfigBanner() {
  if (isBrowserSupabaseConfigured()) return null;
  return (
    <div
      className="mb-6 rounded-lg border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-left font-sans text-sm leading-relaxed text-amber-100"
      role="alert"
    >
      {SUPABASE_ENV_MISSING_USER_MESSAGE}
    </div>
  );
}
