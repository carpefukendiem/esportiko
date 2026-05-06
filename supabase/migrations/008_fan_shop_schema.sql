-- =============================================================================
-- Fan Shop MVP schema
-- Phase 1 of feat/fan-shop-schema
-- =============================================================================

-- fan_shops: a team's storefront (per-season, ephemeral by design — no separate teams table)
create table if not exists public.fan_shops (
  id                     uuid primary key default gen_random_uuid(),
  slug                   text not null unique,
  name                   text not null,                          -- "Pumas U12 — Spring 2026"
  team_name              text not null,                          -- "Pumas U12" (separate from store name)
  sport                  text,                                   -- soccer, baseball, etc. (filtering, optional)
  description            text,
  logo_url               text,                                   -- raw uploaded file
  logo_decoration_url    text,                                   -- preprocessed for canvas decoration
  logo_background_url    text,                                   -- preprocessed for storefront bg tile
  hero_text              text,
  status                 text not null default 'draft',          -- draft, active, closed, archived
  opens_at               timestamptz,
  closes_at              timestamptz,
  contact_email          text not null,
  contact_phone          text,
  created_by             uuid references auth.users(id) on delete set null,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  constraint fan_shops_status_check check (status in ('draft', 'active', 'closed', 'archived'))
);

create index if not exists fan_shops_slug_idx on public.fan_shops(slug);
create index if not exists fan_shops_status_idx on public.fan_shops(status);
create index if not exists fan_shops_created_by_idx on public.fan_shops(created_by);

-- fan_shop_skus: SKUs the team admin selected for their store
create table if not exists public.fan_shop_skus (
  id                  uuid primary key default gen_random_uuid(),
  fan_shop_id         uuid not null references public.fan_shops(id) on delete cascade,
  style_number        text not null references public.sanmar_products(style_number),
  retail_price_cents  int not null check (retail_price_cents > 0),
  display_order       int not null default 0,
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),
  unique (fan_shop_id, style_number)
);

create index if not exists fan_shop_skus_shop_idx on public.fan_shop_skus(fan_shop_id);
create index if not exists fan_shop_skus_style_idx on public.fan_shop_skus(style_number);

-- fan_shop_decoration_config: pre-defined decoration rules per garment type
-- Esportiko sets this. Coaches don't see it. Tells production HOW to decorate each SKU.
create table if not exists public.fan_shop_decoration_config (
  id                       uuid primary key default gen_random_uuid(),
  style_number             text not null unique references public.sanmar_products(style_number),
  decoration_method        text not null,                       -- screenprint, embroidery, dtg
  logo_placement           text not null,                       -- chest_center, front_center, back_center, left_chest, etc.
  logo_max_width_inches    numeric(4,2) not null,
  notes                    text,
  created_at               timestamptz not null default now(),
  constraint decoration_method_check check (decoration_method in ('screenprint', 'embroidery', 'dtg'))
);

-- fan_shop_orders: each customer purchase
create table if not exists public.fan_shop_orders (
  id                          uuid primary key default gen_random_uuid(),
  fan_shop_id                 uuid not null references public.fan_shops(id),
  order_number                text not null unique,             -- ESP-2026-0247
  buyer_email                 text not null,
  buyer_name                  text not null,
  buyer_phone                 text,
  fulfillment_method          text not null,                    -- ship, pickup
  shipping_address            jsonb,                            -- null if pickup; structured address obj
  subtotal_cents              int not null check (subtotal_cents >= 0),
  shipping_cents              int not null default 0 check (shipping_cents >= 0),
  tax_cents                   int not null default 0 check (tax_cents >= 0),
  total_cents                 int not null check (total_cents >= 0),
  stripe_payment_intent_id    text not null,
  payment_status              text not null default 'pending',  -- pending, paid, refunded, failed
  production_status           text not null default 'received', -- received, in_production, ready, shipped, delivered, picked_up, canceled
  internal_notes              text,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now(),
  constraint fulfillment_method_check check (fulfillment_method in ('ship', 'pickup')),
  constraint payment_status_check check (payment_status in ('pending', 'paid', 'refunded', 'failed')),
  constraint production_status_check check (production_status in ('received', 'in_production', 'ready', 'shipped', 'delivered', 'picked_up', 'canceled'))
);

create index if not exists fan_shop_orders_shop_idx on public.fan_shop_orders(fan_shop_id);
create index if not exists fan_shop_orders_status_idx on public.fan_shop_orders(production_status);
create index if not exists fan_shop_orders_email_idx on public.fan_shop_orders(buyer_email);
create index if not exists fan_shop_orders_payment_intent_idx on public.fan_shop_orders(stripe_payment_intent_id);

-- fan_shop_order_items: line items per order
create table if not exists public.fan_shop_order_items (
  id                  uuid primary key default gen_random_uuid(),
  order_id            uuid not null references public.fan_shop_orders(id) on delete cascade,
  fan_shop_sku_id     uuid not null references public.fan_shop_skus(id),
  style_number        text not null,                            -- denormalized for historical accuracy
  product_title       text not null,
  catalog_color       text not null,
  display_color       text not null,
  size                text not null,
  quantity            int not null check (quantity > 0),
  unit_price_cents    int not null check (unit_price_cents > 0),
  line_total_cents    int not null check (line_total_cents > 0),
  created_at          timestamptz not null default now()
);

create index if not exists fan_shop_order_items_order_idx on public.fan_shop_order_items(order_id);

-- =============================================================================
-- updated_at triggers
-- =============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists fan_shops_set_updated_at on public.fan_shops;
create trigger fan_shops_set_updated_at
  before update on public.fan_shops
  for each row execute function public.set_updated_at();

drop trigger if exists fan_shop_orders_set_updated_at on public.fan_shop_orders;
create trigger fan_shop_orders_set_updated_at
  before update on public.fan_shop_orders
  for each row execute function public.set_updated_at();

-- =============================================================================
-- Row Level Security
-- =============================================================================

alter table public.fan_shops                   enable row level security;
alter table public.fan_shop_skus               enable row level security;
alter table public.fan_shop_decoration_config  enable row level security;
alter table public.fan_shop_orders             enable row level security;
alter table public.fan_shop_order_items        enable row level security;

-- Public can read active fan shops (storefront)
create policy "fan_shops_public_read_active"
  on public.fan_shops for select
  to anon, authenticated
  using (status = 'active');

-- Owners can read+manage their own shops (any status)
create policy "fan_shops_owner_full"
  on public.fan_shops for all
  to authenticated
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

-- Public can read SKUs of active shops
create policy "fan_shop_skus_public_read_active"
  on public.fan_shop_skus for select
  to anon, authenticated
  using (
    is_active = true
    and exists (
      select 1 from public.fan_shops fs
      where fs.id = fan_shop_skus.fan_shop_id and fs.status = 'active'
    )
  );

-- Owners can manage their shop's SKUs
create policy "fan_shop_skus_owner_full"
  on public.fan_shop_skus for all
  to authenticated
  using (
    exists (
      select 1 from public.fan_shops fs
      where fs.id = fan_shop_skus.fan_shop_id and fs.created_by = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.fan_shops fs
      where fs.id = fan_shop_skus.fan_shop_id and fs.created_by = auth.uid()
    )
  );

-- Decoration config is public-readable (anyone seeing the storefront sees decoration preview)
create policy "fan_shop_decoration_config_public_read"
  on public.fan_shop_decoration_config for select
  to anon, authenticated using (true);

-- Decoration config write-protected (service role only — Esportiko admins set via direct DB or future admin UI)
-- No policy = no access for anon/authenticated by default. Service role bypasses RLS.

-- Orders: buyers can read their own by email match (best-effort, since no buyer auth)
-- For MVP: orders are READ via service role only (admin panels). No buyer-side reads.
-- Owners (coaches) can read orders for their shop
create policy "fan_shop_orders_owner_read"
  on public.fan_shop_orders for select
  to authenticated
  using (
    exists (
      select 1 from public.fan_shops fs
      where fs.id = fan_shop_orders.fan_shop_id and fs.created_by = auth.uid()
    )
  );

-- Order items: coaches can read items for their shop's orders
create policy "fan_shop_order_items_owner_read"
  on public.fan_shop_order_items for select
  to authenticated
  using (
    exists (
      select 1 from public.fan_shop_orders o
      join public.fan_shops fs on fs.id = o.fan_shop_id
      where o.id = fan_shop_order_items.order_id and fs.created_by = auth.uid()
    )
  );

-- All write operations on orders + order_items go through service role (Stripe webhook, admin UI).
