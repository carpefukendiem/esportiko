import { createClient } from "@/lib/supabase/server";
import type { FanShop, FanShopSku } from "./types";

export async function getFanShopBySlug(slug: string): Promise<FanShop | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("fan_shops")
      .select("*")
      .eq("slug", slug)
      .eq("status", "active")
      .maybeSingle();

    if (error) {
      console.error("[fan-shop/queries] getFanShopBySlug:", error);
      return null;
    }
    return data as FanShop | null;
  } catch (e) {
    console.error("[fan-shop/queries] getFanShopBySlug:", e);
    return null;
  }
}

export async function getFanShopSkusForShop(fanShopId: string): Promise<FanShopSku[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("fan_shop_skus")
      .select("*")
      .eq("fan_shop_id", fanShopId)
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[fan-shop/queries] getFanShopSkusForShop:", error);
      return [];
    }
    return (data ?? []) as FanShopSku[];
  } catch (e) {
    console.error("[fan-shop/queries] getFanShopSkusForShop:", e);
    return [];
  }
}

export async function getFanShopForOwner(userId: string): Promise<FanShop | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("fan_shops")
      .select("*")
      .eq("created_by", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[fan-shop/queries] getFanShopForOwner:", error);
      return null;
    }
    return data as FanShop | null;
  } catch (e) {
    console.error("[fan-shop/queries] getFanShopForOwner:", e);
    return null;
  }
}
