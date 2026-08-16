import "server-only";

import { createClient } from "@/lib/supabase/server";
import { proxySanmarUrl } from "@/lib/customize/proxy-image";
import type { GarmentSvgKind } from "@/lib/customize/design-types";
import type { LogoPlacement } from "./types";
import { DEFAULT_FAN_SHOP_STYLES, defaultPriceCents } from "./default-catalog";
import { garmentKindForStyle } from "./garment-kind";
import { getFanShopForOwner, getFanShopSkusForShop } from "./queries";

export type FanShopPreviewItem = {
  styleNumber: string;
  productTitle: string;
  garmentKind: GarmentSvgKind;
  garmentRasterUrl: string | null;
  garmentColor: string;
  logoPlacement: LogoPlacement;
  logoMaxWidthInches: number;
  retailPriceCents: number;
  decorationMethod: string;
};

export type FanShopPreviewBundle = {
  logoUrl: string | null;
  logoOptions: { id: string; label: string; url: string }[];
  items: FanShopPreviewItem[];
  shopName: string | null;
  teamName: string | null;
};

const RASTER = /\.(png|jpg|jpeg|webp|svg)$/i;

async function signedArtworkUrls(
  supabase: ReturnType<typeof createClient>,
  accountId: string
): Promise<{ id: string; label: string; url: string }[]> {
  const { data: rows } = await supabase
    .from("artwork_assets")
    .select("id, filename, storage_path")
    .eq("account_id", accountId)
    .order("created_at", { ascending: false });

  const assets = rows ?? [];
  const out: { id: string; label: string; url: string }[] = [];

  for (const a of assets) {
    const name = a.filename ?? a.storage_path.split("/").pop() ?? "Artwork";
    if (!RASTER.test(name)) continue;
    const { data: signed } = await supabase.storage
      .from("artwork")
      .createSignedUrl(a.storage_path, 3600);
    if (signed?.signedUrl) {
      out.push({ id: a.id, label: name, url: signed.signedUrl });
    }
  }
  return out;
}

export async function getFanShopPreviewBundle(params: {
  userId: string;
  accountId: string;
  teamName: string;
}): Promise<FanShopPreviewBundle> {
  const supabase = createClient();
  const shop = await getFanShopForOwner(params.userId);
  const shopSkus = shop ? await getFanShopSkusForShop(shop.id) : [];

  const styleNumbers =
    shopSkus.length > 0
      ? shopSkus.map((s) => s.style_number)
      : [...DEFAULT_FAN_SHOP_STYLES];

  const priceByStyle = new Map<string, number>();
  for (const sku of shopSkus) {
    priceByStyle.set(sku.style_number.toUpperCase(), sku.retail_price_cents);
  }

  const [{ data: products }, { data: configs }, { data: colors }] = await Promise.all([
    supabase
      .from("sanmar_products")
      .select("style_number, product_title, sanmar_category, front_flat_url")
      .in("style_number", styleNumbers),
    supabase
      .from("fan_shop_decoration_config")
      .select("style_number, decoration_method, logo_placement, logo_max_width_inches")
      .in("style_number", styleNumbers),
    supabase
      .from("sanmar_product_colors")
      .select("style_number, color_product_url, display_color")
      .in("style_number", styleNumbers)
      .order("sort_order"),
  ]);

  const firstColorByStyle = new Map<string, { url: string | null; display: string | null }>();
  for (const c of colors ?? []) {
    if (!firstColorByStyle.has(c.style_number)) {
      firstColorByStyle.set(c.style_number, {
        url: c.color_product_url,
        display: c.display_color,
      });
    }
  }

  const configByStyle = new Map(
    (configs ?? []).map((c) => [c.style_number.toUpperCase(), c])
  );

  const logoOptions = await signedArtworkUrls(supabase, params.accountId);
  const shopLogo =
    shop?.logo_decoration_url ??
    shop?.logo_url ??
    logoOptions[0]?.url ??
    null;

  const items: FanShopPreviewItem[] = (products ?? [])
    .map((p) => {
      const key = p.style_number.toUpperCase();
      const cfg = configByStyle.get(key);
      const colorRow = firstColorByStyle.get(p.style_number);
      const rawRaster = colorRow?.url ?? p.front_flat_url;
      return {
        styleNumber: p.style_number,
        productTitle: p.product_title,
        garmentKind: garmentKindForStyle(p.style_number, p.sanmar_category ?? ""),
        garmentRasterUrl: proxySanmarUrl(rawRaster),
        garmentColor: "#4b5563",
        logoPlacement: (cfg?.logo_placement ?? "chest_center") as LogoPlacement,
        logoMaxWidthInches: Number(cfg?.logo_max_width_inches ?? 4),
        retailPriceCents: priceByStyle.get(key) ?? defaultPriceCents(p.style_number),
        decorationMethod: cfg?.decoration_method ?? "screenprint",
      };
    })
    .sort((a, b) => {
      const ai = DEFAULT_FAN_SHOP_STYLES.indexOf(
        a.styleNumber.toUpperCase() as (typeof DEFAULT_FAN_SHOP_STYLES)[number]
      );
      const bi = DEFAULT_FAN_SHOP_STYLES.indexOf(
        b.styleNumber.toUpperCase() as (typeof DEFAULT_FAN_SHOP_STYLES)[number]
      );
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });

  return {
    logoUrl: shopLogo,
    logoOptions,
    items,
    shopName: shop?.name ?? null,
    teamName: shop?.team_name ?? params.teamName,
  };
}
