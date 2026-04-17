import { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ensureAccount } from "@/lib/portal/ensureAccount";
import type { AccountRow } from "@/types/portal";

/**
 * Loads (or creates) the portal account for the current user.
 *
 * - `unstable_noStore()` opts this tree out of static/prerender caching so you
 *   don’t serve a stale account after mutations (Next.js equivalent of
 *   fetch(..., { cache: "no-store" }) for route data).
 * - React `cache()` deduplicates identical calls within the same request, so
 *   the layout header and the page can both call this without duplicate DB
 *   round-trips on a single navigation.
 */
export const loadPortalAccount = cache(
  async (
    userId: string,
    userEmail: string | undefined
  ): Promise<AccountRow | null> => {
    noStore();
    const supabase = createClient();
    return ensureAccount(supabase, userId, userEmail);
  }
);
