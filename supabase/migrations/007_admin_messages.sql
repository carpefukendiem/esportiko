-- Log outbound admin → customer messages (written via service role in server actions)

CREATE TABLE IF NOT EXISTS public.admin_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES public.accounts (id) ON DELETE CASCADE,
  order_id uuid REFERENCES public.orders (id) ON DELETE SET NULL,
  sender_email text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_messages_account_id_idx
  ON public.admin_messages (account_id);

CREATE INDEX IF NOT EXISTS admin_messages_order_id_idx
  ON public.admin_messages (order_id);

ALTER TABLE public.admin_messages ENABLE ROW LEVEL SECURITY;

-- Intentionally no policies for `authenticated` / `anon`: only the service role
-- (used in server actions) bypasses RLS and can read/write this table.
