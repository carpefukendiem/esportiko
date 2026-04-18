"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function adminSetAccountVip(accountId: string, vip: boolean): Promise<void> {
  await requireAdmin();
  const admin = getSupabaseAdmin();
  const { error } = await admin.from("accounts").update({ vip }).eq("id", accountId);
  if (error) {
    console.error("adminSetAccountVip", error);
    throw new Error("Could not update VIP flag");
  }
  revalidatePath(`/admin/accounts/${accountId}`);
  revalidatePath("/admin");
  revalidatePath("/admin/accounts");
}

export async function adminSaveAccountNotes(accountId: string, notes: string): Promise<void> {
  await requireAdmin();
  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("accounts")
    .update({ admin_notes: notes.trim() || null })
    .eq("id", accountId);
  if (error) {
    console.error("adminSaveAccountNotes", error);
    throw new Error("Could not save account notes");
  }
  revalidatePath(`/admin/accounts/${accountId}`);
}
