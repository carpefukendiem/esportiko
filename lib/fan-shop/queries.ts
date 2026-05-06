import { createClient } from "@/lib/supabase/server";
import type { FanShop, FanShopSku } from "./types";

export async function getFanShopBySlug(slug: string): Promise<FanShop | null> {
  // TODO: Phase 3 — implement public storefront query
  return null;
}

export async function getFanShopSkusForShop(fanShopId: string): Promise<FanShopSku[]> {
  // TODO: Phase 3 — implement
  return [];
}

export async function getFanShopForOwner(userId: string): Promise<FanShop | null> {
  // TODO: Phase 2 — implement team admin query
  return null;
}
