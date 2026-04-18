-- Quote-to-order webhook: track order origin + GHL contact on accounts

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS source text;

ALTER TABLE public.accounts
  ADD COLUMN IF NOT EXISTS ghl_contact_id text;
