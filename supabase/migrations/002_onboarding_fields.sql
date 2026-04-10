-- Portal onboarding: extra account fields + completion flag
-- sport already exists on public.accounts from 001

ALTER TABLE public.accounts
  ADD COLUMN IF NOT EXISTS league_or_school text;

ALTER TABLE public.accounts
  ADD COLUMN IF NOT EXISTS heard_about_us text;

ALTER TABLE public.accounts
  ADD COLUMN IF NOT EXISTS likely_order_types text[] NOT NULL DEFAULT '{}'::text[];

ALTER TABLE public.accounts
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false;

ALTER TABLE public.accounts
  ADD COLUMN IF NOT EXISTS onboarding_notes text;

-- Existing rows: skip onboarding (they already use the portal)
UPDATE public.accounts
SET onboarding_completed = true
WHERE onboarding_completed = false;
