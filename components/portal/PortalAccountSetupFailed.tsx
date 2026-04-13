"use client";

import { createBrowserClientIfConfigured } from "@/lib/supabase/client";

export function PortalAccountSetupFailed() {
  const signOut = async () => {
    const supabase = createBrowserClientIfConfigured();
    if (supabase) {
      await supabase.auth.signOut();
    }
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0F1521] px-6 text-center">
      <p className="max-w-md font-sans text-sm font-medium text-[#8A94A6]">
        We couldn&apos;t finish setting up your team account. This is usually
        temporary — try refreshing the page. If it keeps happening, sign out and
        sign in again.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-lg bg-[#3B7BF8] px-5 py-2.5 font-sans text-sm font-semibold text-white hover:opacity-90"
        >
          Refresh
        </button>
        <button
          type="button"
          onClick={() => void signOut()}
          className="rounded-lg border border-[#2A3347] px-5 py-2.5 font-sans text-sm font-semibold text-[#8A94A6] hover:bg-[#1C2333] hover:text-white"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
