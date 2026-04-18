# GoHighLevel → Esportiko quote webhook

When a prospect submits a quote on the site, GHL receives the lead (existing inbound webhooks). A **workflow** can then POST quote fields to Esportiko so we create a portal user, account, draft order, and send a password-reset email.

## Environment

- **`GHL_WEBHOOK_SECRET`** — Long random string. Stored in Vercel (Production + Preview) and in `.env.local` for local dev.
- **`SUPABASE_SERVICE_ROLE_KEY`** — Supabase Dashboard → Project Settings → API (server only; never expose to the browser).
- **`NEXT_PUBLIC_SITE_URL`** — Public site origin with no trailing slash (e.g. `https://esportiko.vercel.app`). Used for the recovery email redirect to `/reset-password`.

## Esportiko endpoint

- **URL:** `https://esportiko.vercel.app/api/webhooks/ghl-quote` (or your production domain)
- **Method:** `POST`
- **Headers:**
  - `Content-Type: application/json`
  - `x-ghl-webhook-secret: <same value as GHL_WEBHOOK_SECRET>`

Missing or wrong secret → **401 Unauthorized**.

## GHL workflow steps

1. Open **Automation → Workflows**.
2. Open the workflow that runs when a quote/contact form is submitted (or create one).
3. Add an **Outbound Webhook** (or HTTP request) action **after** the contact is created/updated.
4. Configure:
   - **URL:** your production URL above (or ngrok/local only for experiments).
   - **Method:** POST
   - **Headers:** as above.
   - **Body:** JSON. Map merge fields from your form / custom fields. Example shape:

```json
{
  "email": "{{contact.email}}",
  "first_name": "{{contact.first_name}}",
  "last_name": "{{contact.last_name}}",
  "phone": "{{contact.phone}}",
  "company": "{{contact.company_name}}",
  "quote_type": "team",
  "garment_types": ["Jerseys", "Hoodies"],
  "quantity": 25,
  "deadline": "2026-06-01",
  "notes": "{{custom_field.notes}}",
  "sport": "{{custom_field.sport}}",
  "league_or_school": "{{custom_field.league_or_school}}",
  "artwork_url": "",
  "ghl_contact_id": "{{contact.id}}",
  "source": "request-a-quote"
}
```

- **`quote_type`** must be one of: `team`, `business`, `contact`.
- **`garment_types`** should be a JSON array of strings if your GHL action supports it; otherwise send a single string and adjust the workflow (or map multiple custom fields in GHL).

5. Save and test with a real submission.

## Supabase: recovery email template

The app sends a **password recovery** email via Supabase Auth (`resetPasswordForEmail`) so the user can set a password and open the portal.

**Manual step (Supabase Dashboard):** Authentication → Email Templates → **Reset Password** — customize subject/body so it reads like a welcome + “your quote is in the portal”, for example:

- **Subject:** `Welcome to Esportiko — Set your password to view your quote`
- **Body:** Explain that their quote is saved as a draft, include `{{ .ConfirmationURL }}`, and your support phone.

## Database migration

Run in Supabase SQL Editor (or migrate via CLI) the file:

`supabase/migrations/005_order_source_column.sql`

This adds `orders.source` and `accounts.ghl_contact_id` if missing.

## Local test (no GHL)

With `npm run dev` and `NODE_ENV=development`, POST JSON to:

`http://localhost:3000/api/webhooks/ghl-quote/test`

This runs the same logic as production **without** the `x-ghl-webhook-secret` header.

```bash
curl -sS -X POST "http://localhost:3000/api/webhooks/ghl-quote/test" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testquote+'"$(date +%s)"'@example.com",
    "first_name": "Test",
    "last_name": "User",
    "phone": "8051234567",
    "company": "Test FC",
    "quote_type": "team",
    "garment_types": ["Jerseys", "Hoodies"],
    "quantity": 25,
    "deadline": "2026-06-01",
    "notes": "Spring season order",
    "sport": "Soccer"
  }'
```

Use a real inbox you control if you want to click the recovery link.

See also: project **README** (GHL quote webhook section).
