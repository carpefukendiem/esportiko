import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth/admin-email";

/**
 * Admin gate: authenticated user whose email is in ADMIN_EMAILS.
 */
export async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  if (!user.email || !isAdminEmail(user.email)) {
    redirect("/portal/dashboard");
  }

  return { user, supabase };
}
