export type FanShopStatus = "draft" | "active" | "closed" | "archived";
export type FulfillmentMethod = "ship" | "pickup";
export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";
export type ProductionStatus =
  | "received"
  | "in_production"
  | "ready"
  | "shipped"
  | "delivered"
  | "picked_up"
  | "canceled";
export type DecorationMethod = "screenprint" | "embroidery" | "dtg";
export type LogoPlacement =
  | "chest_center"
  | "front_center"
  | "back_center"
  | "left_chest"
  | "right_chest";

export interface FanShop {
  id: string;
  slug: string;
  name: string;
  team_name: string;
  sport: string | null;
  description: string | null;
  logo_url: string | null;
  logo_decoration_url: string | null;
  logo_background_url: string | null;
  hero_text: string | null;
  status: FanShopStatus;
  opens_at: string | null;
  closes_at: string | null;
  contact_email: string;
  contact_phone: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface FanShopSku {
  id: string;
  fan_shop_id: string;
  style_number: string;
  retail_price_cents: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface FanShopDecorationConfig {
  id: string;
  style_number: string;
  decoration_method: DecorationMethod;
  logo_placement: LogoPlacement;
  logo_max_width_inches: number;
  notes: string | null;
  created_at: string;
}

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string; // 'US' for now
}

export interface FanShopOrder {
  id: string;
  fan_shop_id: string;
  order_number: string;
  buyer_email: string;
  buyer_name: string;
  buyer_phone: string | null;
  fulfillment_method: FulfillmentMethod;
  shipping_address: ShippingAddress | null;
  subtotal_cents: number;
  shipping_cents: number;
  tax_cents: number;
  total_cents: number;
  stripe_payment_intent_id: string;
  payment_status: PaymentStatus;
  production_status: ProductionStatus;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface FanShopOrderItem {
  id: string;
  order_id: string;
  fan_shop_sku_id: string;
  style_number: string;
  product_title: string;
  catalog_color: string;
  display_color: string;
  size: string;
  quantity: number;
  unit_price_cents: number;
  line_total_cents: number;
  created_at: string;
}
