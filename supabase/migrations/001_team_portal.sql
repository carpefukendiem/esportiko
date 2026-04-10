-- Team Account Portal schema + RLS + storage policies
-- Run in Supabase SQL editor or via supabase db push

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  team_name text NOT NULL,
  sport text,
  contact_name text,
  contact_email text,
  contact_phone text,
  default_roster jsonb NOT NULL DEFAULT '[]'::jsonb,
  use_default_roster_for_new_orders boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES public.accounts (id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN (
      'draft',
      'submitted',
      'in_review',
      'in_production',
      'complete',
      'cancelled'
    )),
  garment_type text,
  decoration_method text,
  quantity integer,
  deadline date,
  season text,
  notes text,
  artwork_url text,
  artwork_deferred boolean NOT NULL DEFAULT false,
  roster_incomplete boolean NOT NULL DEFAULT false,
  ghl_contact_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders (id) ON DELETE CASCADE,
  player_name text,
  player_number text,
  size text,
  quantity integer NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS public.saved_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES public.accounts (id) ON DELETE CASCADE,
  name text NOT NULL,
  garment_type text,
  decoration_method text,
  color_notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.artwork_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES public.accounts (id) ON DELETE CASCADE,
  filename text,
  storage_path text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_account_id ON public.orders (account_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_saved_configurations_account_id ON public.saved_configurations (account_id);
CREATE INDEX IF NOT EXISTS idx_artwork_assets_account_id ON public.artwork_assets (account_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.touch_orders_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := timezone('utc', now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS orders_touch_updated_at ON public.orders;
CREATE TRIGGER orders_touch_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE PROCEDURE public.touch_orders_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artwork_assets ENABLE ROW LEVEL SECURITY;

-- accounts: own row only
CREATE POLICY "accounts_select_own"
  ON public.accounts FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "accounts_insert_own"
  ON public.accounts FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "accounts_update_own"
  ON public.accounts FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "accounts_delete_own"
  ON public.accounts FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- orders: via account ownership
CREATE POLICY "orders_select_own"
  ON public.orders FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.accounts a
      WHERE a.id = orders.account_id AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "orders_insert_own"
  ON public.orders FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.accounts a
      WHERE a.id = orders.account_id AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "orders_update_own"
  ON public.orders FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.accounts a
      WHERE a.id = orders.account_id AND a.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.accounts a
      WHERE a.id = orders.account_id AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "orders_delete_own"
  ON public.orders FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.accounts a
      WHERE a.id = orders.account_id AND a.user_id = auth.uid()
    )
  );

-- order_items: via order -> account
CREATE POLICY "order_items_select_own"
  ON public.order_items FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      JOIN public.accounts a ON a.id = o.account_id
      WHERE o.id = order_items.order_id AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "order_items_insert_own"
  ON public.order_items FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      JOIN public.accounts a ON a.id = o.account_id
      WHERE o.id = order_items.order_id AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "order_items_update_own"
  ON public.order_items FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      JOIN public.accounts a ON a.id = o.account_id
      WHERE o.id = order_items.order_id AND a.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      JOIN public.accounts a ON a.id = o.account_id
      WHERE o.id = order_items.order_id AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "order_items_delete_own"
  ON public.order_items FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      JOIN public.accounts a ON a.id = o.account_id
      WHERE o.id = order_items.order_id AND a.user_id = auth.uid()
    )
  );

-- saved_configurations
CREATE POLICY "saved_configurations_all_own"
  ON public.saved_configurations FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.accounts a
      WHERE a.id = saved_configurations.account_id AND a.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.accounts a
      WHERE a.id = saved_configurations.account_id AND a.user_id = auth.uid()
    )
  );

-- artwork_assets
CREATE POLICY "artwork_assets_all_own"
  ON public.artwork_assets FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.accounts a
      WHERE a.id = artwork_assets.account_id AND a.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.accounts a
      WHERE a.id = artwork_assets.account_id AND a.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Storage (private artwork bucket)
-- ---------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('artwork', 'artwork', false)
ON CONFLICT (id) DO UPDATE SET public = excluded.public;

-- Path: accounts/{account_id}/artwork/{filename}
CREATE POLICY "artwork_objects_select_own"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'artwork'
    AND split_part(name, '/', 1) = 'accounts'
    AND split_part(name, '/', 2) IN (
      SELECT id::text FROM public.accounts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "artwork_objects_insert_own"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'artwork'
    AND split_part(name, '/', 1) = 'accounts'
    AND split_part(name, '/', 2) IN (
      SELECT id::text FROM public.accounts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "artwork_objects_update_own"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'artwork'
    AND split_part(name, '/', 1) = 'accounts'
    AND split_part(name, '/', 2) IN (
      SELECT id::text FROM public.accounts WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    bucket_id = 'artwork'
    AND split_part(name, '/', 1) = 'accounts'
    AND split_part(name, '/', 2) IN (
      SELECT id::text FROM public.accounts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "artwork_objects_delete_own"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'artwork'
    AND split_part(name, '/', 1) = 'accounts'
    AND split_part(name, '/', 2) IN (
      SELECT id::text FROM public.accounts WHERE user_id = auth.uid()
    )
  );
