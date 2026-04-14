-- SanMar product catalog (curated, ingested nightly via SFTP)
-- One row per STYLE# (dedup'd across SanMar's per-color-per-size EPDD rows).
-- Pricing columns intentionally omitted. We are not an ecommerce site.

create table if not exists public.sanmar_products (
  style_number          text primary key,
  product_title         text not null,
  brand_name            text not null,
  product_description   text,
  sanmar_category       text not null,
  sanmar_subcategory    text,
  status                text not null check (status in ('Active','New','Coming Soon','Regular','Discontinued')),
  available_sizes       text,
  front_model_url       text,
  back_model_url        text,
  front_flat_url        text,
  back_flat_url         text,
  spec_sheet_url        text,
  last_synced_at        timestamptz not null default now()
);

create index if not exists sanmar_products_status_idx on public.sanmar_products(status);
create index if not exists sanmar_products_category_idx on public.sanmar_products(sanmar_category);

create table if not exists public.sanmar_product_colors (
  style_number        text not null references public.sanmar_products(style_number) on delete cascade,
  catalog_color       text not null,
  display_color       text not null,
  swatch_image_url    text,
  color_product_url   text,
  pms_color           text,
  sort_order          int not null default 0,
  primary key (style_number, catalog_color)
);

create index if not exists sanmar_product_colors_style_idx on public.sanmar_product_colors(style_number);

create table if not exists public.sanmar_product_sizes (
  style_number     text not null references public.sanmar_products(style_number) on delete cascade,
  catalog_color    text not null,
  size             text not null,
  size_index       text,
  primary key (style_number, catalog_color, size)
);

create index if not exists sanmar_product_sizes_style_idx on public.sanmar_product_sizes(style_number);

alter table public.sanmar_products        enable row level security;
alter table public.sanmar_product_colors  enable row level security;
alter table public.sanmar_product_sizes   enable row level security;

create policy "sanmar_products_public_read"
  on public.sanmar_products for select
  to anon, authenticated using (true);
create policy "sanmar_product_colors_public_read"
  on public.sanmar_product_colors for select
  to anon, authenticated using (true);
create policy "sanmar_product_sizes_public_read"
  on public.sanmar_product_sizes for select
  to anon, authenticated using (true);

create table if not exists public.sanmar_sync_runs (
  id            bigserial primary key,
  started_at    timestamptz not null default now(),
  finished_at   timestamptz,
  status        text not null default 'running' check (status in ('running','success','error')),
  rows_parsed   int,
  styles_upserted int,
  error_message text
);

alter table public.sanmar_sync_runs enable row level security;
