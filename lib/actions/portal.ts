"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { ensureAccount } from "@/lib/portal/ensureAccount";
import { sendOrderToGHL } from "@/lib/ghl/webhook";
import type { AccountRow, OrderRow, OrderItemRow } from "@/types/portal";
import type { PortalOrderFormValues } from "@/lib/schemas/portalOrderFormSchema";

async function requireAccount(): Promise<{
  supabase: SupabaseClient;
  account: AccountRow;
  userId: string;
}> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  const account = await ensureAccount(
    supabase,
    user.id,
    user.email ?? undefined,
    user
  );
  if (!account) {
    redirect("/login");
  }
  return { supabase, account, userId: user.id };
}

export async function createDraftOrder(
  savedConfigId?: string | null
): Promise<string> {
  const { supabase, account } = await requireAccount();
  const { data, error } = await supabase
    .from("orders")
    .insert({
      account_id: account.id,
      status: "draft",
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("createDraftOrder", error);
    throw new Error("Could not create order");
  }

  const id = data.id as string;

  if (savedConfigId) {
    const { data: cfg } = await supabase
      .from("saved_configurations")
      .select("*")
      .eq("id", savedConfigId)
      .eq("account_id", account.id)
      .maybeSingle();
    if (cfg) {
      await supabase
        .from("orders")
        .update({
          garment_type: cfg.garment_type,
          decoration_method: cfg.decoration_method,
          notes: cfg.color_notes,
        })
        .eq("id", id);
    }
  }

  revalidatePath("/portal/dashboard");
  revalidatePath("/portal/orders");
  return id;
}

function buildNotes(values: Partial<PortalOrderFormValues>): string | undefined {
  const parts: string[] = [];
  if (values.notes) parts.push(values.notes);
  if (values.color_notes) parts.push(`Color / design: ${values.color_notes}`);
  if (!parts.length) return undefined;
  return parts.join("\n\n");
}

export async function savePortalDraft(
  orderId: string,
  values: Partial<PortalOrderFormValues> & {
    roster_incomplete?: boolean;
  }
): Promise<void> {
  const { supabase, account } = await requireAccount();

  const { data: order } = await supabase
    .from("orders")
    .select("id, account_id")
    .eq("id", orderId)
    .single();

  if (!order || order.account_id !== account.id) {
    throw new Error("Order not found");
  }

  const patch: Record<string, unknown> = {};
  if (values.garment_type !== undefined) {
    patch.garment_type = Array.isArray(values.garment_type)
      ? values.garment_type.join(", ")
      : values.garment_type;
  }
  if (values.decoration_method !== undefined)
    patch.decoration_method = values.decoration_method;
  if (values.quantity !== undefined) patch.quantity = values.quantity;
  if (values.deadline !== undefined) patch.deadline = values.deadline || null;
  if (values.season !== undefined) patch.season = values.season;
  if (values.artwork_url !== undefined) patch.artwork_url = values.artwork_url || null;
  if (values.artwork_deferred !== undefined)
    patch.artwork_deferred = values.artwork_deferred;
  if (values.roster_skip !== undefined || values.roster_incomplete !== undefined) {
    patch.roster_incomplete =
      (values.roster_skip ?? values.roster_incomplete) === true;
  }

  const mergedNotes = buildNotes(values);
  if (mergedNotes !== undefined) patch.notes = mergedNotes;

  if (
    (values.team_name !== undefined &&
      values.team_name !== account.team_name) ||
    (values.sport !== undefined && values.sport !== account.sport)
  ) {
    await supabase
      .from("accounts")
      .update({
        ...(values.team_name !== undefined
          ? { team_name: values.team_name }
          : {}),
        ...(values.sport !== undefined ? { sport: values.sport || null } : {}),
      })
      .eq("id", account.id);
  }

  if (Object.keys(patch).length) {
    await supabase.from("orders").update(patch).eq("id", orderId);
  }

  if (values.roster_skip) {
    await supabase.from("order_items").delete().eq("order_id", orderId);
    await supabase
      .from("orders")
      .update({ roster_incomplete: true })
      .eq("id", orderId);
  } else if (values.roster !== undefined) {
    await supabase.from("order_items").delete().eq("order_id", orderId);
    const rows = values.roster
      .filter((r) => r.player_name || r.player_number || r.size)
      .map((r) => ({
        order_id: orderId,
        player_name: r.player_name || null,
        player_number: r.player_number || null,
        size: r.size || null,
        quantity: r.quantity,
      }));
    if (rows.length) {
      await supabase.from("order_items").insert(rows);
    }
  }

  revalidatePath(`/portal/orders/${orderId}`);
  revalidatePath("/portal/orders");
  revalidatePath("/portal/dashboard");
}

export async function submitPortalOrder(
  orderId: string,
  values: PortalOrderFormValues
): Promise<{ ok: true }> {
  const { supabase, account } = await requireAccount();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (!order || (order as OrderRow).account_id !== account.id) {
    throw new Error("Order not found");
  }

  await savePortalDraft(orderId, {
    ...values,
    roster_incomplete: values.roster_skip,
  });

  const notes =
    buildNotes(values) ??
    (order as OrderRow).notes ??
    "";

  const { data: updated } = await supabase
    .from("orders")
    .update({
      status: "submitted",
      garment_type: Array.isArray(values.garment_type)
        ? values.garment_type.join(", ")
        : values.garment_type,
      decoration_method: values.decoration_method,
      quantity: values.quantity,
      deadline: values.deadline || null,
      season: values.season,
      artwork_url: values.artwork_url || null,
      artwork_deferred: values.artwork_deferred,
      roster_incomplete: values.roster_skip,
      notes,
    })
    .eq("id", orderId)
    .select("*")
    .single();

  if (!updated) {
    throw new Error("Failed to submit");
  }

  const submittedRow = updated as OrderRow;
  if (submittedRow.source === "ghl_quote_webhook") {
    await supabase
      .from("accounts")
      .update({ onboarding_completed: true })
      .eq("id", account.id);
  }

  await sendOrderToGHL(updated as OrderRow, {
    ...account,
    team_name: values.team_name,
  });

  revalidatePath(`/portal/orders/${orderId}`);
  revalidatePath("/portal/orders");
  revalidatePath("/portal/dashboard");
  return { ok: true };
}

export async function reorderAndRedirect(orderId: string): Promise<void> {
  const newId = await cloneOrderToDraft(orderId);
  redirect(`/portal/orders/${newId}/quick-reorder?from=${orderId}`);
}

export async function cloneOrderToDraft(orderId: string): Promise<string> {
  const { supabase, account } = await requireAccount();

  const { data: src } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (!src || (src as OrderRow).account_id !== account.id) {
    throw new Error("Order not found");
  }

  const o = src as OrderRow;
  const { data: created, error } = await supabase
    .from("orders")
    .insert({
      account_id: account.id,
      status: "draft",
      garment_type: o.garment_type,
      decoration_method: o.decoration_method,
      quantity: o.quantity,
      deadline: o.deadline,
      season: o.season,
      notes: o.notes,
      artwork_url: o.artwork_url,
      artwork_deferred: o.artwork_deferred,
      roster_incomplete: o.roster_incomplete,
    })
    .select("id")
    .single();

  if (error || !created) {
    console.error("cloneOrderToDraft", error);
    throw new Error("Could not clone order");
  }

  const newId = created.id as string;

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);

  if (items?.length) {
    const copy = (items as OrderItemRow[]).map((i) => ({
      order_id: newId,
      player_name: i.player_name,
      player_number: i.player_number,
      size: i.size,
      quantity: i.quantity,
    }));
    await supabase.from("order_items").insert(copy);
  }

  revalidatePath("/portal/orders");
  revalidatePath("/portal/dashboard");
  return newId;
}

export type QuickReorderRosterRow = {
  player_name?: string | null;
  player_number?: string | null;
  size?: string | null;
  quantity: number;
};

/**
 * Replaces `order_items` for a draft; syncs `orders.quantity` to roster sum.
 * Drops lines with no player name (per quick-reorder UX).
 */
export async function updateDraftRoster(
  orderId: string,
  roster: QuickReorderRosterRow[]
): Promise<void> {
  const { supabase, account } = await requireAccount();

  const { data: order } = await supabase
    .from("orders")
    .select("id, account_id, status")
    .eq("id", orderId)
    .single();

  if (!order || order.account_id !== account.id || order.status !== "draft") {
    throw new Error("Cannot update this order");
  }

  await supabase.from("order_items").delete().eq("order_id", orderId);

  const rows = roster
    .filter((r) => (r.player_name ?? "").trim().length > 0)
    .map((r) => ({
      order_id: orderId,
      player_name: (r.player_name ?? "").trim(),
      player_number: (r.player_number ?? "").trim() || null,
      size: (r.size ?? "").trim() || null,
      quantity: Math.max(1, Math.floor(Number(r.quantity) || 1)),
    }));

  if (rows.length) {
    const { error: insErr } = await supabase.from("order_items").insert(rows);
    if (insErr) {
      console.error("updateDraftRoster insert", insErr);
      throw new Error("Could not save roster");
    }
  }

  const totalQty = rows.reduce((s, r) => s + r.quantity, 0);
  const { error: upErr } = await supabase
    .from("orders")
    .update({
      quantity: totalQty > 0 ? totalQty : null,
      roster_incomplete: rows.length === 0,
    })
    .eq("id", orderId);

  if (upErr) {
    console.error("updateDraftRoster order", upErr);
    throw new Error("Could not update order");
  }

  revalidatePath(`/portal/orders/${orderId}/quick-reorder`);
  revalidatePath(`/portal/orders/${orderId}`);
  revalidatePath("/portal/orders");
  revalidatePath("/portal/dashboard");
}

/**
 * Submit quick-reorder draft (roster already on `order_items`).
 */
export async function submitQuickReorder(
  orderId: string,
  fromOriginalId?: string | null
): Promise<void> {
  const { supabase, account } = await requireAccount();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (!order || (order as OrderRow).account_id !== account.id) {
    throw new Error("Order not found");
  }
  if ((order as OrderRow).status !== "draft") {
    throw new Error("Order is not a draft");
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);

  if (!items?.length) {
    const q = new URLSearchParams();
    if (fromOriginalId) q.set("from", fromOriginalId);
    q.set("error", "empty-roster");
    redirect(`/portal/orders/${orderId}/quick-reorder?${q.toString()}`);
  }

  const { data: updated, error: upErr } = await supabase
    .from("orders")
    .update({
      status: "submitted",
      roster_incomplete: false,
    })
    .eq("id", orderId)
    .select("*")
    .single();

  if (upErr || !updated) {
    console.error("submitQuickReorder", upErr);
    throw new Error("Failed to submit order");
  }

  const submittedRow = updated as OrderRow;
  if (submittedRow.source === "ghl_quote_webhook") {
    await supabase
      .from("accounts")
      .update({ onboarding_completed: true })
      .eq("id", account.id);
  }

  await sendOrderToGHL(submittedRow, account);

  revalidatePath(`/portal/orders/${orderId}`);
  revalidatePath("/portal/orders");
  revalidatePath("/portal/dashboard");
  redirect(`/portal/orders/${orderId}?submitted=1`);
}

export async function updateAccountProfile(payload: {
  team_name: string;
  sport?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
}): Promise<void> {
  const { supabase, account } = await requireAccount();
  await supabase
    .from("accounts")
    .update({
      team_name: payload.team_name,
      sport: payload.sport ?? null,
      contact_name: payload.contact_name ?? null,
      contact_email: payload.contact_email ?? null,
      contact_phone: payload.contact_phone ?? null,
    })
    .eq("id", account.id);
  revalidatePath("/portal");
}

export async function updateDefaultRoster(payload: {
  default_roster: import("@/types/portal").DefaultRosterJson;
  use_default_roster_for_new_orders: boolean;
}): Promise<void> {
  const { supabase, account } = await requireAccount();
  await supabase
    .from("accounts")
    .update({
      default_roster: payload.default_roster,
      use_default_roster_for_new_orders: payload.use_default_roster_for_new_orders,
    })
    .eq("id", account.id);
  revalidatePath("/portal/roster");
}

export async function registerArtworkAsset(filename: string, storagePath: string): Promise<void> {
  const { supabase, account } = await requireAccount();
  await supabase.from("artwork_assets").insert({
    account_id: account.id,
    filename,
    storage_path: storagePath,
  });
  revalidatePath("/portal/artwork");
}

export async function removeArtworkAsset(assetId: string): Promise<void> {
  const { supabase, account } = await requireAccount();
  const { data: row } = await supabase
    .from("artwork_assets")
    .select("storage_path")
    .eq("id", assetId)
    .eq("account_id", account.id)
    .single();

  if (!row) return;

  await supabase.storage.from("artwork").remove([row.storage_path]);
  await supabase.from("artwork_assets").delete().eq("id", assetId);
  revalidatePath("/portal/artwork");
}


export async function dismissGhlQuoteOnboardingBanner(): Promise<void> {
  const { supabase, account } = await requireAccount();
  const { error } = await supabase
    .from("accounts")
    .update({ onboarding_completed: true })
    .eq("id", account.id);
  if (error) {
    console.error("dismissGhlQuoteOnboardingBanner", error);
    throw new Error("Could not update account");
  }
  revalidatePath("/portal/dashboard");
}
