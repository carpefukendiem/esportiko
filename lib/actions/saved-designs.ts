"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { DesignElement } from "@/lib/customize/design-types";

export type SavedDesignRow = {
  id: string;
  account_id: string;
  name: string;
  garment_category: string | null;
  garment_style_number: string | null;
  garment_color: string | null;
  view_mode: string;
  elements: DesignElement[];
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
};

async function getAccountId(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("accounts")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error || !data) return null;
  return String((data as { id: string }).id);
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const m = /^data:image\/png;base64,(.+)$/i.exec(dataUrl.trim());
  if (!m) throw new Error("Thumbnail must be a PNG data URL");
  return Uint8Array.from(Buffer.from(m[1], "base64"));
}

export async function listSavedDesigns(): Promise<SavedDesignRow[]> {
  const supabase = createClient();
  const accountId = await getAccountId();
  if (!accountId) return [];
  const { data, error } = await supabase
    .from("saved_designs")
    .select("*")
    .eq("account_id", accountId)
    .order("updated_at", { ascending: false });
  if (error) {
    console.error("listSavedDesigns", error);
    return [];
  }
  return (data as SavedDesignRow[]).map((row) => ({
    ...row,
    elements: Array.isArray(row.elements) ? (row.elements as DesignElement[]) : [],
  }));
}

export async function loadSavedDesign(id: string): Promise<SavedDesignRow | null> {
  const supabase = createClient();
  const accountId = await getAccountId();
  if (!accountId) return null;
  const { data, error } = await supabase
    .from("saved_designs")
    .select("*")
    .eq("id", id)
    .eq("account_id", accountId)
    .maybeSingle();
  if (error || !data) return null;
  const row = data as SavedDesignRow;
  return {
    ...row,
    elements: Array.isArray(row.elements) ? (row.elements as DesignElement[]) : [],
  };
}

export async function deleteSavedDesign(id: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = createClient();
  const accountId = await getAccountId();
  if (!accountId) return { ok: false, error: "Not signed in" };
  const existing = await loadSavedDesign(id);
  if (!existing) return { ok: false, error: "Not found" };
  if (existing.thumbnail_url) {
    try {
      const u = new URL(existing.thumbnail_url);
      const parts = u.pathname.split("/object/public/");
      if (parts.length === 2) {
        const rest = parts[1];
        const idx = rest.indexOf("/");
        if (idx > -1) {
          const bucket = rest.slice(0, idx);
          const path = rest.slice(idx + 1);
          if (bucket === "design-thumbnails") {
            await supabase.storage.from(bucket).remove([path]);
          }
        }
      }
    } catch {
      /* ignore thumbnail delete failures */
    }
  }
  const { error } = await supabase.from("saved_designs").delete().eq("id", id).eq("account_id", accountId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/customize");
  revalidatePath("/portal/designs");
  return { ok: true };
}

export type SaveDesignInput = {
  id?: string;
  name: string;
  garment_category: string | null;
  garment_style_number: string | null;
  garment_color: string | null;
  view_mode: "front" | "back";
  elements: DesignElement[];
  thumbnailPngDataUrl: string;
};

export async function saveDesign(input: SaveDesignInput): Promise<{ ok: boolean; id?: string; error?: string }> {
  const supabase = createClient();
  const accountId = await getAccountId();
  if (!accountId) return { ok: false, error: "Not signed in" };

  const designId = input.id ?? crypto.randomUUID();
  const objectPath = `${accountId}/${designId}.png`;

  let thumbBytes: Uint8Array;
  try {
    thumbBytes = dataUrlToBytes(input.thumbnailPngDataUrl);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Bad thumbnail" };
  }

  const { error: upErr } = await supabase.storage
    .from("design-thumbnails")
    .upload(objectPath, thumbBytes, {
      contentType: "image/png",
      upsert: true,
    });
  if (upErr) {
    console.error("thumbnail upload", upErr);
    return { ok: false, error: upErr.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("design-thumbnails").getPublicUrl(objectPath);

  const payload = {
    id: designId,
    account_id: accountId,
    name: input.name,
    garment_category: input.garment_category,
    garment_style_number: input.garment_style_number,
    garment_color: input.garment_color,
    view_mode: input.view_mode,
    elements: input.elements,
    thumbnail_url: publicUrl,
  };

  const { error } = await supabase.from("saved_designs").upsert(payload, { onConflict: "id" });
  if (error) {
    console.error("saveDesign upsert", error);
    return { ok: false, error: error.message };
  }
  revalidatePath("/customize");
  revalidatePath("/portal/designs");
  return { ok: true, id: designId };
}
