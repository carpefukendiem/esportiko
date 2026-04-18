"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { OrderStatus } from "@/types/portal";

const STATUSES: OrderStatus[] = [
  "draft",
  "submitted",
  "in_review",
  "in_production",
  "complete",
  "cancelled",
];

function assertStatus(s: string): asserts s is OrderStatus {
  if (!STATUSES.includes(s as OrderStatus)) {
    throw new Error("Invalid status");
  }
}

export async function adminUpdateOrderStatus(orderId: string, status: string): Promise<void> {
  await requireAdmin();
  assertStatus(status);
  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("orders")
    .update({
      status,
      last_admin_update: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) {
    console.error("adminUpdateOrderStatus", error);
    throw new Error("Could not update status");
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/accounts");
}

export async function adminSaveOrderNotes(orderId: string, adminNotes: string): Promise<void> {
  await requireAdmin();
  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("orders")
    .update({
      admin_notes: adminNotes.trim() || null,
      last_admin_update: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) {
    console.error("adminSaveOrderNotes", error);
    throw new Error("Could not save notes");
  }

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin");
}
