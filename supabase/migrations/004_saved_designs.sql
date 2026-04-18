-- Saved customize designs + public thumbnail storage
-- Note: repo already has 003_sanmar_catalog.sql; this is 004.

CREATE TABLE IF NOT EXISTS public.saved_designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES public.accounts (id) ON DELETE CASCADE,
  name text NOT NULL,
  garment_category text,
  garment_style_number text,
  garment_color text,
  view_mode text NOT NULL DEFAULT 'front',
  elements jsonb NOT NULL DEFAULT '[]'::jsonb,
  thumbnail_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_saved_designs_account_id ON public.saved_designs (account_id);

CREATE OR REPLACE FUNCTION public.touch_saved_designs_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := timezone('utc', now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS saved_designs_touch_updated_at ON public.saved_designs;
CREATE TRIGGER saved_designs_touch_updated_at
  BEFORE UPDATE ON public.saved_designs
  FOR EACH ROW
  EXECUTE PROCEDURE public.touch_saved_designs_updated_at();

ALTER TABLE public.saved_designs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_designs_select_own"
  ON public.saved_designs FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.accounts a
      WHERE a.id = saved_designs.account_id AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "saved_designs_insert_own"
  ON public.saved_designs FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.accounts a
      WHERE a.id = saved_designs.account_id AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "saved_designs_update_own"
  ON public.saved_designs FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.accounts a
      WHERE a.id = saved_designs.account_id AND a.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.accounts a
      WHERE a.id = saved_designs.account_id AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "saved_designs_delete_own"
  ON public.saved_designs FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.accounts a
      WHERE a.id = saved_designs.account_id AND a.user_id = auth.uid()
    )
  );

INSERT INTO storage.buckets (id, name, public)
VALUES ('design-thumbnails', 'design-thumbnails', true)
ON CONFLICT (id) DO UPDATE SET public = excluded.public;

-- Public read for thumbnails
DROP POLICY IF EXISTS "design_thumbnails_public_read" ON storage.objects;
CREATE POLICY "design_thumbnails_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'design-thumbnails');

DROP POLICY IF EXISTS "design_thumbnails_insert_own" ON storage.objects;
CREATE POLICY "design_thumbnails_insert_own"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'design-thumbnails'
    AND split_part(name, '/', 1) IN (
      SELECT id::text FROM public.accounts WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "design_thumbnails_update_own" ON storage.objects;
CREATE POLICY "design_thumbnails_update_own"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'design-thumbnails'
    AND split_part(name, '/', 1) IN (
      SELECT id::text FROM public.accounts WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    bucket_id = 'design-thumbnails'
    AND split_part(name, '/', 1) IN (
      SELECT id::text FROM public.accounts WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "design_thumbnails_delete_own" ON storage.objects;
CREATE POLICY "design_thumbnails_delete_own"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'design-thumbnails'
    AND split_part(name, '/', 1) IN (
      SELECT id::text FROM public.accounts WHERE user_id = auth.uid()
    )
  );
