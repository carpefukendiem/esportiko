export type OrderStatus =
  | "draft"
  | "submitted"
  | "in_review"
  | "in_production"
  | "complete"
  | "cancelled";

export type AccountRow = {
  id: string;
  user_id: string;
  team_name: string;
  sport: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  default_roster: DefaultRosterJson;
  use_default_roster_for_new_orders: boolean;
  vip?: boolean | null;
  admin_notes?: string | null;
  onboarding_completed?: boolean | null;
  league_or_school?: string | null;
  created_at: string;
};

export type DefaultRosterPlayer = {
  name: string;
  number: string;
  preferred_size: string;
};

export type DefaultRosterJson = DefaultRosterPlayer[];

export type OrderRow = {
  id: string;
  account_id: string;
  status: OrderStatus;
  garment_type: string | null;
  decoration_method: string | null;
  quantity: number | null;
  deadline: string | null;
  season: string | null;
  notes: string | null;
  artwork_url: string | null;
  artwork_deferred: boolean;
  roster_incomplete: boolean;
  ghl_contact_id: string | null;
  source?: string | null;
  admin_notes?: string | null;
  last_admin_update?: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  player_name: string | null;
  player_number: string | null;
  size: string | null;
  quantity: number;
};

export type SavedConfigurationRow = {
  id: string;
  account_id: string;
  name: string;
  garment_type: string | null;
  decoration_method: string | null;
  color_notes: string | null;
  created_at: string;
};

export type ArtworkAssetRow = {
  id: string;
  account_id: string;
  filename: string | null;
  storage_path: string;
  created_at: string;
};

export type Account = AccountRow;
export type Order = OrderRow;
export type OrderItem = OrderItemRow;
export type SavedConfiguration = SavedConfigurationRow;
export type ArtworkAsset = ArtworkAssetRow;
