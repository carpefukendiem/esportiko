# GoHighLevel → Esportiko quote-to-order webhook

When a prospect submits a quote on the website, your existing flow can still send the lead **into GoHighLevel**. Add a GHL **workflow** step that POSTs the same (or richer) data **back to Esportiko**. Esportiko will:

1. Validate a shared secret header.
2. Find or create a Supabase **Auth** user for the email (confirmed, no separate “verify email” step).
3. Find or create an **`accounts`** row for that user.
4. Create a **`orders`** row in **`draft`** with `source = 'ghl_quote_webhook'`.
5. Send a **password recovery** email so they can set a password and open the portal.

After they reset their password, they land in the portal; the dashboard can show a banner pointing at the draft order.

---

## Prerequisites

- [ ] Supabase project with Team Portal schema applied (`001`, `002`, …).
- [ ] Migration **`005_order_source_column.sql`** applied (adds `orders.source`, `accounts.ghl_contact_id` if missing). Run the SQL in **Supabase → SQL Editor**, or use the Supabase CLI: `supabase db push` / your usual migration path.
- [ ] **Vercel** (or host) env vars set (see below) and app redeployed after changing `NEXT_PUBLIC_*` values.
- [ ] **Supabase Auth → URL configuration** includes your production origin and `/reset-password` (see [Supabase Auth URLs](#supabase-auth-urls)).
- [ ] GHL **location** has inbound quote forms working; you know which **custom fields** or form fields hold garment types, quantity, deadline, notes, sport, etc.

---

## Environment variables

| Variable | Where it’s used | Notes |
|----------|-----------------|--------|
| `GHL_WEBHOOK_SECRET` | Esportiko `POST /api/webhooks/ghl-quote` | Long random string. **Same value** in GHL as header `x-ghl-webhook-secret`. Never commit to git; use Vercel + local `.env.local`. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only admin API (create user, insert rows) | Supabase Dashboard → **Project Settings → API → service_role**. Treat like a root password. |
| `NEXT_PUBLIC_SUPABASE_URL` | App + anon client | Already required for the app. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Recovery email trigger | Used server-side to call `resetPasswordForEmail` after provisioning. |
| `NEXT_PUBLIC_SITE_URL` | Recovery redirect | **No trailing slash.** Example: `https://esportiko.vercel.app`. Recovery links redirect to `{NEXT_PUBLIC_SITE_URL}/reset-password`. |

**Local:** copy `.env.example` → `.env.local` and fill all of the above.  
**Vercel:** **Project → Settings → Environment Variables** — add for **Production** and **Preview** as needed; redeploy.

---

## Supabase Auth URLs

In **Supabase Dashboard → Authentication → URL Configuration**:

1. **Site URL** — your primary public origin (e.g. `https://esportiko.vercel.app`).
2. **Redirect URLs** — allow at least:
   - `https://YOUR_DOMAIN/auth/callback` (OAuth)
   - `https://YOUR_DOMAIN/reset-password` (password recovery from email)

Use the same values for Preview/staging if you test recovery there.

---

## Esportiko endpoints

### Production webhook (GHL)

| | |
|--|--|
| **URL** | `https://YOUR_DOMAIN/api/webhooks/ghl-quote` |
| **Method** | `POST` |
| **Headers** | `Content-Type: application/json` |
| | `x-ghl-webhook-secret: <GHL_WEBHOOK_SECRET>` |

- Valid body → **200** `{ "success": true, "user_id", "account_id", "order_id" }`
- Bad JSON / validation → **400**
- Missing or wrong secret → **401**
- Server / Supabase error → **500** (includes an error message in JSON for debugging; avoid logging secrets)

### Local test helper (no secret)

Only when **`NODE_ENV=development`** (e.g. `npm run dev`):

| | |
|--|--|
| **URL** | `http://localhost:3000/api/webhooks/ghl-quote/test` |
| **Method** | `POST` |
| **Headers** | `Content-Type: application/json` |
| **Body** | Same JSON shape as production (see [Payload reference](#payload-reference)). |

This runs the **same** provisioning logic as production; it does **not** require `x-ghl-webhook-secret`. Do not rely on this route in production builds.

---

## Payload reference

Esportiko expects JSON matching this shape (Zod-validated):

| Field | Required | Type | Notes |
|-------|------------|------|--------|
| `email` | **Yes** | string | Valid email; trimmed. |
| `quote_type` | **Yes** | `"team"` \| `"business"` \| `"contact"` | Drives internal metadata in order notes. |
| `first_name` | No | string | |
| `last_name` | No | string | |
| `phone` | No | string | |
| `company` | No | string | Team / business name; used for `accounts.team_name` when creating a new account. |
| `garment_types` | No | string[] | Stored as comma-separated `orders.garment_type`. |
| `quantity` | No | number | Positive integer. |
| `deadline` | No | string | Prefer `YYYY-MM-DD` (ISO date). Other formats may be stored as `null` for `deadline`. |
| `notes` | No | string | |
| `sport` | No | string | `accounts.sport` on new account. |
| `league_or_school` | No | string | `accounts.league_or_school` on new account. |
| `artwork_url` | No | string | Optional URL or empty string. |
| `ghl_contact_id` | No | string | Stored on account (when column exists) and order. |
| `ghl_opportunity_id` | No | string | Appended into order notes metadata when present. |
| `source` | No | string | e.g. `request-a-quote`, `team-orders`; recorded in order notes for traceability. |

`orders.source` is always set to **`ghl_quote_webhook`** for rows created by this endpoint (distinct from `source` in the payload, which is “marketing source”).

---

## GHL workflow setup (step by step)

1. In GHL, go **Automation → Workflows**.
2. Open the workflow that runs when a quote is submitted (e.g. form submitted, tag applied, or “Opportunity created”), or create a new workflow with that trigger.
3. After the contact exists (and any custom fields you need are set), add **Outbound Webhook** or **Custom Webhook** / **HTTP** action (name varies by GHL UI version).
4. Set **URL** to your production webhook (see [Production webhook](#production-webhook-ghl)).
5. Set **Method** to **POST**.
6. Add **headers**:
   - `Content-Type`: `application/json`
   - `x-ghl-webhook-secret`: paste the exact value of `GHL_WEBHOOK_SECRET` from Vercel (or your secret manager).
7. Set **body** to **raw JSON** and map GHL merge fields to the keys in [Payload reference](#payload-reference). Example (merge tags are illustrative; use the merge field picker in GHL):

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
  "notes": "{{contact.notes}}",
  "sport": "{{contact.sport}}",
  "league_or_school": "{{contact.league_or_school}}",
  "artwork_url": "",
  "ghl_contact_id": "{{contact.id}}",
  "source": "request-a-quote"
}
```

8. **Arrays in GHL:** Some webhook builders cannot emit a JSON array literal. Options:
   - Use a **Code** / **Formatter** step (if available) to build valid JSON with a `garment_types` array, or  
   - Send a single string (e.g. `"Jerseys, Hoodies"`) and adjust your GHL payload to match what Esportiko accepts — today the API expects **`garment_types` as an array of strings** for multi-select. If you only have one string, you may need a small GHL workflow step to split or a follow-up app change; prefer a JSON array when possible.
9. **`quote_type`:** Use a fixed literal (`"team"`, `"business"`, or `"contact"`) per workflow, or map from a custom field if you branch workflows per funnel.
10. Save the workflow and run a **test contact** through it.

---

## Supabase email template (manual)

Esportiko triggers Supabase’s **Reset password** flow (`resetPasswordForEmail`) so the user receives the standard recovery email.

**Customize in Supabase:** **Authentication → Email Templates → Reset password**

Suggested tone:

- **Subject:** `Welcome to Esportiko — Set your password to view your quote`
- **Body:** Thank them for requesting a quote; explain a portal draft was created; include **`{{ .ConfirmationURL }}`**; mention they can review the draft and submit when ready; support phone **(805) 335-2239** (or your current number).

This template cannot be edited from the repo; configure it in the Supabase dashboard.

---

## Verification checklist

After a test webhook (GHL or local `/test`):

1. **Supabase → Authentication → Users** — user exists for the email (email confirmed).
2. **Table `accounts`** — row with `user_id`, sensible `team_name` / contact fields; new GHL-created accounts typically have `onboarding_completed = false` until they finish onboarding or dismiss the dashboard banner (see app behavior).
3. **Table `orders`** — new row: `status = draft`, `source = ghl_quote_webhook`, expected `garment_type` / `quantity` / `deadline` / `notes` / `ghl_contact_id` as applicable.
4. **Inbox** — recovery email received; link opens `/reset-password` on your domain and completes without redirect errors.
5. **Portal** — after login, **Dashboard** shows the “quote saved as a draft” banner when conditions match (draft from GHL + onboarding flag); **View draft** goes to `/portal/orders/[id]/edit`.

---

## Local test with curl

Use a **unique email** per run so you are not fighting duplicate-user edge cases.

**Static email:**

```bash
curl -sS -X POST "http://localhost:3000/api/webhooks/ghl-quote/test" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testquote+static@example.com",
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

**Unique email (shell substitution):**

```bash
curl -sS -X POST "http://localhost:3000/api/webhooks/ghl-quote/test" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"testquote+$(date +%s)@example.com\",\"first_name\":\"Test\",\"last_name\":\"User\",\"phone\":\"8051234567\",\"company\":\"Test FC\",\"quote_type\":\"team\",\"garment_types\":[\"Jerseys\",\"Hoodies\"],\"quantity\":25,\"deadline\":\"2026-06-01\",\"notes\":\"Spring season order\",\"sport\":\"Soccer\"}"
```

**Production-style call (requires secret):**

```bash
curl -sS -X POST "https://esportiko.vercel.app/api/webhooks/ghl-quote" \
  -H "Content-Type: application/json" \
  -H "x-ghl-webhook-secret: YOUR_GHL_WEBHOOK_SECRET" \
  -d '{"email":"…","quote_type":"team"}'
```

---

## Troubleshooting

| Symptom | Things to check |
|---------|-------------------|
| **401** from `/api/webhooks/ghl-quote` | Header name exactly `x-ghl-webhook-secret`; value matches `GHL_WEBHOOK_SECRET` on the server; no extra spaces/quotes in Vercel. |
| **400** Invalid payload | `email` and `quote_type` required; `quote_type` must be `team`, `business`, or `contact`. |
| **500** Supabase | `SUPABASE_SERVICE_ROLE_KEY` and `NEXT_PUBLIC_SUPABASE_URL` set on the server; migration **005** applied; RLS is bypassed by service role for inserts (if errors persist, read server logs / Supabase logs). |
| No recovery email | Check spam; confirm **SMTP** / Auth email enabled in Supabase; `NEXT_PUBLIC_SITE_URL` correct; redirect URL allowlisted. |
| Recovery link wrong domain | `NEXT_PUBLIC_SITE_URL` at **build** time on Vercel; redeploy after changing it. |
| User created but no order | Check API JSON response for `order_id`; inspect `orders` insert errors in function logs. |

---

## Related files in the repo

| Area | Path |
|------|------|
| Webhook route | `app/api/webhooks/ghl-quote/route.ts` |
| Dev test route | `app/api/webhooks/ghl-quote/test/route.ts` |
| Provisioning logic | `lib/actions/quote-webhook.ts` |
| Admin Supabase client | `lib/supabase/admin.ts` |
| Migration | `supabase/migrations/005_order_source_column.sql` |
| Dashboard banner | `app/portal/dashboard/page.tsx`, `components/portal/GhlQuoteDraftBanner.tsx` |

---

## README

The project **README** links here for a short overview and local smoke tests.
