-- Admin UI: order/account metadata, indexes, optional source column

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS source text;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS admin_notes text;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS last_admin_update timestamptz;

ALTER TABLE public.accounts
  ADD COLUMN IF NOT EXISTS vip boolean NOT NULL DEFAULT false;

ALTER TABLE public.accounts
  ADD COLUMN IF NOT EXISTS admin_notes text;

CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders (status);

CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders (created_at DESC);
