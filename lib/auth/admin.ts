import type { User } from "@supabase/supabase-js";
import { requireAdmin as requireAdminGate } from "@/lib/admin/requireAdmin";

export { isAdminEmail, parseAdminEmails } from "@/lib/auth/admin-email";

/**
 * Server actions: require admin; returns `user` only.
 * For `supabase` in RSC, use `@/lib/admin/requireAdmin` instead.
 */
export async function requireAdmin(): Promise<User> {
  const { user } = await requireAdminGate();
  return user;
}
