import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth/admin-email";

export { isAdminEmail, parseAdminEmails } from "@/lib/auth/admin-email";

/**
 * Requires a logged-in user whose email is in `ADMIN_EMAILS`.
 * Otherwise redirects to `/login?error=not-authorized`.
 */
export async function requireAdmin(): Promise<User> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !isAdminEmail(user.email)) {
    redirect("/login?error=not-authorized");
  }

  return user;
}
