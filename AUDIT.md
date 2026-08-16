# Esportiko Site Audit — Phase 1 (Diagnostic Only)

**Branch:** `fix/site-audit-restore` (created from `feat/header-redesign`)  
**Date:** 2026-08-15  
**Scope:** Read-only diagnosis. No application fixes applied except this file and branch creation.

---

## Executive summary

The codebase **builds cleanly** (Next.js **14.2.29**, `tsc` 0 errors, ESLint clean). Public marketing pages **render HTTP 200**. The dominant failure mode is **infrastructure**: the Supabase project hostname in `.env.local` resolves to **NXDOMAIN** (`lteiodslfhabvptugsrg.supabase.co`). That breaks **all** auth, portal, admin data, customize catalog DB reads, and fan-shop queries at runtime—regardless of code quality.

Lead-capture forms that POST to `/api/submit-lead` → GoHighLevel **may still work** for the four configured webhook env vars, but **custom inquiry** is misconfigured locally (`GHL_WEBHOOK_URL_CUSTOM_INQUIRY` missing). Inbound GHL quote processing (`/api/webhooks/ghl-quote`) returns **500** locally because `GHL_WEBHOOK_SECRET` is unset.

---

## 1. Repo state

| Check | Result |
|-------|--------|
| `git branch --show-current` | `fix/site-audit-restore` |
| HEAD detached? | No |
| `git status` | Clean except untracked `Esportiko-Project-Synopsis.docx`, `Esportiko-SOW-Cost-Breakdown.docx` |
| vs `origin/main` | **1 commit ahead, 0 behind** (branch includes header redesign + fan-shop/cron work merged via recent history) |
| Stash | `stash@{0}: On main: pre-merge local images` |
| Worktrees | Leftover read-only worktrees under `/Users/ruben/.cursor/worktrees/esportiko/` (`aqk`, `wdk`, detached HEAD). **Not used for this audit** (per project rule: work only in `/Users/ruben/Dropbox/dev/esportiko`). |
| Recent commits | `70dd564` header redesign, `898429c` merge PR #17 fan-shop stubs + SanMar cron → GHA, fan-shop schema, customize/sanmar pipeline |

---

## 2. Dependency and build health

| Check | Result |
|-------|--------|
| Next.js version | **14.2.29** (confirmed in `package.json` and build output) |
| `npm ci` | Success. Warnings: Node **v21.6.1** EBADENGINE vs package engines, deprecated eslint/glob, **Next 14.2.29 security advisory** (Dec 2025 patch available—do **not** upgrade to 15 per project constraint) |
| `npx tsc --noEmit` | **0 errors** |
| `npm run lint` | **0 errors, 0 warnings** |
| `npm run build` | **Exit 0** — compiles, lints, types, generates 68 static pages |

### Build noise (non-fatal)

During **Generating static pages**, the build logged many:

```
TypeError: fetch failed
cause: getaddrinfo ENOTFOUND lteiodslfhabvptugsrg.supabase.co
```

These originate from server components that call Supabase during SSG/ISR (notably `/customize` via `getCustomizeProducts()`). Build still completes because callers return empty fallbacks or tolerate errors.

**No Next.js 15 async `cookies()` / `params` / `searchParams` patterns found** (grep for `await cookies(` etc. returned no matches). Codebase remains on **Next.js 14 synchronous patterns**.

---

## 3. Environment variable audit

Values below report **presence / shape only** (never secret contents).

| Variable | In `.env.local`? | Shape | Client / server | When required |
|----------|------------------|-------|-----------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | URL len=40 | Both | Build + runtime |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | JWT-like len=208 | Both | Build + runtime |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | JWT-like len=219 | Server only | Runtime (admin, cron, enrich) |
| `SUPABASE_URL` | Yes | URL len=40 | Server | Scripts / fallback |
| `ADMIN_EMAILS` | Yes | present len=19 | Server | Middleware + admin gate |
| `NEXT_PUBLIC_ADMIN_EMAILS` | Yes | present len=19 | Client + server | Portal admin bypass UI |
| `NEXT_PUBLIC_SITE_URL` | Yes | URL len=21 (`http://localhost:3000`) | Both | OAuth redirects |
| `GHL_WEBHOOK_URL` | Yes | URL len=116 | Server | Portal order → GHL |
| `GHL_WEBHOOK_URL_CONTACT` | Yes | URL len=116 | Server | Contact form |
| `GHL_WEBHOOK_URL_TEAM_ORDER` | Yes | URL len=116 | Server | Team order form |
| `GHL_WEBHOOK_URL_BUSINESS_ORDER` | Yes | URL len=116 | Server | Business order form |
| `GHL_WEBHOOK_URL_TEAM_ROSTER_DETAILS` | Yes | URL len=116 | Server | Roster form |
| `GHL_WEBHOOK_URL_CUSTOM_INQUIRY` | **MISSING** | — | Server | `/request-a-quote` “Something else?” form → **503** |
| `GHL_WEBHOOK_SECRET` | **MISSING** | — | Server | `/api/webhooks/ghl-quote` → **500** |
| `GHL_LOCATION_ID` | Yes | len=20 | Server | LeadConnector chat embed |
| `NEXT_PUBLIC_GHL_LOCATION_ID` | Missing | — | Client | Chat embed fallback |
| `SANMAR_SFTP_*` | Yes (host/port/user/password) | present | Server / GHA secrets | SanMar sync |
| `CRON_SECRET` | Yes | len=64 | Server | Manual `/api/cron/sync-sanmar` |
| `RESEND_API_KEY` | **MISSING** | — | Server | Admin customer email |
| `RESEND_FROM_EMAIL` / `RESEND_FROM` | **MISSING** | — | Server | Admin customer email |
| `VERCEL_URL` | N/A locally | Vercel-injected | Server | Production site URL fallback |

### Key format notes

- Supabase anon/service keys use **legacy JWT format** (`eyJ…`, len ~208/219), not the newer `sb_publishable_` / `sb_secret_` shape. Still valid if project exists; combined with **NXDOMAIN**, keys cannot be validated against a live project.
- `.env.example` documents most vars; matches repo usage.

### Referenced in code but missing locally

- `GHL_WEBHOOK_URL_CUSTOM_INQUIRY` → `app/api/submit-lead/route.ts` returns **503** with user-visible error via `useFormSubmit`.
- `GHL_WEBHOOK_SECRET` → `app/api/webhooks/ghl-quote/route.ts` line 12–18.
- `RESEND_*` → `lib/email/resend-config.ts` (admin messaging only).

---

## 4. Supabase connectivity

**STOP — infrastructure blocker.**

Probe script (throwaway, `/tmp`, not committed) + `nslookup`:

```
nslookup lteiodslfhabvptugsrg.supabase.co → NXDOMAIN
```

Both **anon** and **service role** clients: every table probe returned `TypeError: fetch failed` (same ENOTFOUND).

| Table | Anon | Service role |
|-------|------|--------------|
| `fan_shops` | fetch failed | fetch failed |
| `fan_shop_skus` | fetch failed | fetch failed |
| `fan_shop_decoration_config` | fetch failed | fetch failed |
| `fan_shop_orders` | fetch failed | fetch failed |
| `fan_shop_order_items` | fetch failed | fetch failed |
| `accounts` | fetch failed | fetch failed |
| `orders` | fetch failed | fetch failed |
| `sanmar_products` | fetch failed | fetch failed |
| `sanmar_sync_runs` | fetch failed | fetch failed |

**Diagnosis:** Supabase project deleted, renamed, paused beyond DNS, or `.env.local` points at a **wrong project ref**. Not a code defect.

**Action (dashboard):** Supabase → confirm project status → copy fresh **Project URL** + **anon** + **service_role** keys → update Vercel env + local `.env.local` → verify Auth redirect URLs.

---

## 5. Route inventory and smoke test

Dev server: `npm run dev` on **localhost:3000** (Ready in 3.4s).

### Route classification

| Route | Auth | Notes |
|-------|------|-------|
| `/`, `/about`, `/faq`, `/contact`, service pages, `/apparel/**`, `/request-a-quote`, `/start-*`, `/submit-team-roster`, `/thank-you`, `/privacy`, `/our-work` | **Public** | All **200** |
| `/customize` | Public | **200**; server logs Supabase fetch failures |
| `/login`, `/signup`, `/forgot-password`, `/reset-password` | Public | **200**; auth actions fail until Supabase restored |
| `/auth/callback` | Public handler | OAuth exchange; fails without Supabase |
| `/portal/**` | **Auth required** | Unauthenticated: **307** → `/login?next=…` ✓ |
| `/admin/**` | **Auth + admin email** | Unauthenticated: **307** → `/login?next=…` ✓ |
| `/api/submit-lead` | Public POST | **400** on `{}`; validates `formType` + `email` |
| `/api/orders` | Auth | **401** without session |
| `/api/webhooks/ghl-quote` | Secret header | **500** (`GHL_WEBHOOK_SECRET` unset) |
| `/api/cron/sync-sanmar` | Bearer secret | **405** on POST (GET only) |
| `/api/sanmar-image` | Public GET proxy | **400** on bad `url` param |

### Middleware (`middleware.ts`)

- **Catalog fix still in place:** `/apparel` paths use `Promise.race` 3s timeout on `updateSession`; on timeout, request proceeds with `user=null` (no hang).
- Non-catalog routes await full `updateSession` → **`supabase.auth.getUser()`** on every navigation (blocking network call when Supabase is down, but fails fast with ENOTFOUND rather than hanging indefinitely).
- **`lib/catalog/fetcher.ts`** remains **seed-only** (no Supabase on browse path). DB enrichment happens separately in `enrichCatalogProductsWithSanMarImages()` with **8s timeout** → falls back to seed URLs.

### Performance note

`/apparel/t-shirts` and `/apparel/t-shirts/PC61` took **7–15s** first compile/hit while enrichment waited for Supabase timeout—pages still returned **200** with seed fallback images.

---

## 6. Auth and member area

### Signup → portal flow (code trace)

1. User signs up / OAuth → Supabase Auth email confirm (requires live Supabase).
2. `/auth/callback` exchanges code (`app/(auth)/auth/callback/route.ts`) — synchronous `cookies()` ✓.
3. Non-admin: `ensureAccount()` inserts/selects `accounts` row (`lib/portal/ensureAccount.ts`, 5 retries).
4. Admin email: redirect **`/admin`**, skips `ensureAccount` ✓.
5. Portal layout (`app/portal/layout.tsx`) requires user; `PortalLayoutWithAccount` runs `ensureAccount` again.
6. `PortalTeamProfileGate` redirects incomplete profiles to `/portal/settings?onboarding=true` unless admin (`isAdmin` or `NEXT_PUBLIC_ADMIN_EMAILS` client check).

### Admin email parsing (`lib/auth/admin-email.ts`)

- Merges `ADMIN_EMAILS` + `NEXT_PUBLIC_ADMIN_EMAILS`.
- Split on **comma**, **trim**, **lowercase**, dedupe.
- Case-insensitive match ✓

### Redirect URL config

- `NEXT_PUBLIC_SITE_URL` = `http://localhost:3000` locally.
- Supabase Dashboard must allow: `http://localhost:3000/auth/callback`, production Vercel URL, and `/reset-password` (documented in `.env.example`).
- **Minor inconsistency:** `requireAdmin()` redirects unauthenticated users to `/login?redirect=/admin` but middleware uses `?next=`. Login page likely reads `next` — admin deep-link after login may not restore intended path (code review; not runtime-tested without auth).

### Runtime status (with NXDOMAIN Supabase)

- Login/signup UI renders; **auth API calls fail** (dev log: `AuthRetryableFetchError: fetch failed`).
- Portal/admin **cannot function** for authenticated users.

---

## 7. Admin dashboard

| Surface | Renders? | Data loads? | Notes |
|---------|----------|-------------|-------|
| `/admin` (home) | Yes (when authed) | N/A | **Intentional stub** — “Coming Soon” (`app/admin/page.tsx`). Not a regression. |
| `/admin/orders` | Yes (layout + UI) | **Requires Supabase** | Full table, filters, stat cards (`app/admin/orders/page.tsx`). Empty/broken when DB unreachable. |
| `/admin/orders/[id]` | Yes | **Requires Supabase** | Detail + `AdminOrderActions` |
| `/admin/accounts` | Yes | **Requires Supabase** | Account list/detail |
| Admin messaging (Resend) | UI present | **Fails without `RESEND_*`** | `lib/actions/admin-messaging.ts` |

**Distinction:** Admin **home** looks “broken” if expecting a dashboard, but code says **Coming Soon by design**. Orders/accounts **are implemented** but depend on live Supabase + data in `orders` / `accounts` tables.

---

## 8. Forms and GHL webhooks

### Four marketing webhooks (via `/api/submit-lead`)

| Form | `formType` | Env var | Local env | Error surfacing |
|------|------------|---------|-----------|-----------------|
| Contact | `contact` | `GHL_WEBHOOK_URL_CONTACT` | Set | `useFormSubmit` shows API error message |
| Team order | `team-order` | `GHL_WEBHOOK_URL_TEAM_ORDER` | Set | Same |
| Business order | `business-order` | `GHL_WEBHOOK_URL_BUSINESS_ORDER` | Set | Same |
| Team roster | `team-roster-details` | `GHL_WEBHOOK_URL_TEAM_ROSTER_DETAILS` | Set | Same |
| Custom inquiry | `custom-inquiry` | `GHL_WEBHOOK_URL_CUSTOM_INQUIRY` | **Missing** | **503** “Webhook not configured” |

Implementation: `app/api/submit-lead/route.ts` — validates input, logs payload, forwards to GHL; upstream failures return **502** with `{ success: false, error: "Upstream error" }`.

### `/request-a-quote` split flow

**Intact.** Hub page links to `/start-team-order` and `/start-business-order` separately (`app/(website)/request-a-quote/page.tsx`). Do not consolidate.

### Team order + incomplete roster

`teamOrderSchema`: when `rosterReady === false`, roster array is **not required** (`lib/schemas/teamOrderSchema.ts`). Form defaults `rosterReady: false`. Submission allowed without roster rows ✓

### Artwork upload

Portal uploads to Supabase Storage bucket **`artwork`** (`components/portal/ArtworkManager.tsx`, `OrderForm.tsx`). **Cannot verify bucket policies** without live Supabase. Will fail with current NXDOMAIN.

### Inbound GHL quote webhook

`POST /api/webhooks/ghl-quote` requires header `x-ghl-webhook-secret` matching `GHL_WEBHOOK_SECRET` — **missing locally → 500**.

### Portal order → GHL

`lib/ghl/webhook.ts` uses `GHL_WEBHOOK_URL` (set locally) for portal-submitted orders.

---

## 9. Catalog and SanMar

| Item | Status |
|------|--------|
| GitHub Actions schedule | **Enabled** — `.github/workflows/sanmar-sync.yml` cron `0 7 * * 0` (Sun 07:00 UTC) + manual dispatch, 30 min timeout |
| Last successful sync | **Unknown** — `sanmar_sync_runs` unreachable |
| Browse catalog data path | Seed via `lib/catalog/fetcher.ts` ✓ |
| DB enrichment | `lib/catalog/enrichSanMarCatalogFromDb.ts` — prefers `front_flat_url` / color flat URLs; **8s timeout → seed fallback** |
| `ProductCard` / `ProductDetailMedia` | Use `images.frontFlatUrl`, `flatImageUrl`, `backFlatImageUrl` when enriched; seed-only path uses `getSanMarImageUrl()` constructed URLs (`catalog.sanmar.com/imglib/...`) — **not** DB `front_flat_url` until enrichment succeeds |
| Seed product count | **20** styles in `SANMAR_SEED_PRODUCTS` |
| SanMar image HEAD spot-check | Inconclusive from audit environment (curl exit 6 / connection issues); enrichment timeout suggests DB path inactive |
| `/customize` | Loads products from **`sanmar_products` + colors/sizes tables** (`lib/customize/queries.ts`). On Supabase error → `[]` → page should show **“Customizer is loading”** fallback. Dev logs show fetch failures on every `/customize` hit. Stale `.next` cache may still serve prior successful RSC payload with image preloads until cache cleared after Supabase fix. |
| Customize UX (code review) | Front/Back toggle hidden when no back URL (`hasBack` gate); hat category detection; inline delete on canvas elements; back view from `color_product_back_url` / FlatFront→FlatBack derivation in queries |

---

## 10. Fan Shop (Phase 1)

| Item | Status |
|------|--------|
| Migrations | `008_fan_shop_schema.sql` (5 tables + RLS), `009_fan_shop_decoration_config_seed.sql` |
| Decoration configs seeded | **19** style rows in migration (matches Phase 1 spec) |
| `lib/fan-shop/types.ts` | Aligns with SQL columns ✓ |
| `lib/fan-shop/queries.ts` | Compiles; implements `getFanShopBySlug`, `getFanShopSkusForShop`, `getFanShopForOwner` |
| UI routes | **None** in `app/` yet — schema/types/queries only |
| Live DB | **Unreachable** (NXDOMAIN) — cannot confirm tables applied in remote project |

---

## 11. Cross-cutting

### Server / terminal errors (every page load)

Repeated `TypeError: fetch failed` / `AuthRetryableFetchError` from middleware + Supabase client when hostname does not resolve. Public HTML still returns **200**.

### Browser console / mobile viewport

- **Not fully audited** — browser automation MCP unavailable this session.
- Code mitigations for known **`removeChild`** issues: `LeadConnectorChatMount` deferred mount; `RootToaster` uses `next/dynamic` + `ssr: false` + post-hydration mount (`components/ui/root-toaster.tsx`).
- **Nav (code review on `feat/header-redesign`):** Screen Printing, Embroidery, Apparel dropdown (5 children), FAQ, My Team account, Contact link, Request a Quote CTA; `NavDropdown` 150ms hover grace, Escape closes, `aria-haspopup` / `aria-expanded`, active leaf via `usePathname()`; mobile accordion in `MobileNav.tsx`. **Not visually verified** at 375px/390px this session.

---

## Blockers

### B1. Supabase project unreachable (NXDOMAIN)

- **Evidence:** `nslookup lteiodslfhabvptugsrg.supabase.co` → NXDOMAIN; all Supabase probes `fetch failed`; dev server auth errors on every request.
- **Impact:** Login, portal, admin data, customize DB catalog, storage uploads, fan-shop queries, GHL inbound quote processing (writes to DB)—all non-functional.
- **Proposed fix (infra):** Restore or recreate Supabase project → update `NEXT_PUBLIC_SUPABASE_URL`, keys in Vercel + `.env.local` → run pending migrations → configure Auth redirect URLs.

### B2. `GHL_WEBHOOK_URL_CUSTOM_INQUIRY` missing locally

- **Evidence:** Env audit; `submit-lead` returns 503 for `custom-inquiry`.
- **Impact:** “Something else?” inquiries on `/request-a-quote` cannot submit (lead loss on edge-case path).
- **Proposed fix:** Add env var in GHL + `.env.local` + Vercel (one-line config).

---

## Broken

### Auth / portal / admin (downstream of B1)

- **Symptom:** Cannot sign in, create accounts, load portal or admin orders.
- **Files:** `lib/supabase/*`, `middleware.ts`, `app/portal/**`, `app/admin/orders/**`
- **Diagnosis:** Infrastructure, not application logic.

### `/api/webhooks/ghl-quote` locally

- **Symptom:** POST → **500** “Server misconfiguration”.
- **File:** `app/api/webhooks/ghl-quote/route.ts:12-18`
- **Cause:** `GHL_WEBHOOK_SECRET` unset.

### `/customize` product experience (downstream of B1)

- **Symptom:** Server errors on fetch; fallback empty catalog when queries return `[]`.
- **File:** `lib/customize/queries.ts:45-55`, `app/(website)/customize/page.tsx:18-28`

---

## Degraded

### Build-time Supabase noise

- Dozens of `fetch failed` stack traces during `next build` static generation—confusing CI logs but exit 0.

### Apparel page latency

- 7–15s first load while `enrichCatalogProductsWithSanMarImages` waits for Supabase timeout before seed fallback.

### Catalog images without DB

- Seed path uses constructed SanMar URLs; flat lay preference depends on successful DB enrichment. Placeholder shirt icon when all image candidates fail (`ProductCard.tsx`).

### Admin home expectations

- `/admin` shows “Coming Soon”—may look broken to stakeholders expecting stats (by design in code).

### Admin email redirect param

- `requireAdmin()` uses `?redirect=` vs middleware `?next=` — possible post-login routing mismatch for admin.

### Legacy Supabase JWT keys

- Still using `eyJ` anon/service keys; consider migrating to publishable/secret keys when project is restored (Supabase dashboard guidance).

### npm / Node

- Node 21 vs engine warnings; Next 14.2.29 security patch available within **14.x** (not 15).

---

## Infrastructure / Not Code

1. **Supabase Dashboard:** Confirm project `lteiodslfhabvptugsrg` status; if deleted, create new project, run migrations from `supabase/migrations/`, re-link storage buckets (`artwork`, `design-thumbnails`), re-seed decoration config.
2. **Supabase Auth → URL configuration:** Site URL + redirect allowlist for production domain, `http://localhost:3000/auth/callback`, `/reset-password`.
3. **Vercel → Environment variables:** Mirror corrected Supabase + GHL + optional Resend keys; redeploy (NEXT_PUBLIC_* baked at build).
4. **GoHighLevel:** Verify four outbound webhook URLs still active; create + env **`GHL_WEBHOOK_URL_CUSTOM_INQUIRY`**; set **`GHL_WEBHOOK_SECRET`** for inbound quote workflow.
5. **GitHub Actions → Secrets:** `SANMAR_SFTP_*`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` for weekly sync workflow.
6. **Resend (optional):** `RESEND_API_KEY` + verified sender for admin customer emails.

---

## Clean

| Area | Verified |
|------|----------|
| TypeScript | 0 errors |
| ESLint | Clean |
| Production build | Exit 0 on Next 14.2.29 |
| Next 14 sync patterns | No `await cookies/headers/params` |
| Public marketing routes | HTTP 200 smoke test (all listed paths) |
| Auth gate redirects | Portal/admin → `/login?next=…` (307) when logged out |
| Middleware catalog timeout | 3s race still present |
| Catalog browse seed path | `fetcher.ts` DB-free |
| Enrichment graceful fallback | Returns seed products on timeout/error |
| `/request-a-quote` two-path design | Team + business funnels intact |
| Team order roster optional | When `rosterReady: false` |
| Form error surfacing | `useFormSubmit` + submit-lead structured errors |
| `submit-lead` validation | Rejects bad JSON / missing formType / email |
| Fan shop Phase 1 code | Types + queries compile; migrations present |
| SanMar GHA workflow | Weekly schedule configured |
| Header nav structure (code) | Matches redesign spec |
| removeChild mitigations | Dynamic toaster + deferred chat mount |

---

## Recommended fix order

Prioritized for **lead capture** first:

1. **Restore Supabase project + env vars** (blocker B1) — *infra; unblocks auth, portal, customize, admin data, uploads.*  
2. **Set `GHL_WEBHOOK_URL_CUSTOM_INQUIRY`** in local + Vercel (one-line) — *restores custom inquiry leads on `/request-a-quote`.*  
3. **Verify GHL outbound webhooks** still accept POST from `/api/submit-lead` after ~2 month idle — *test contact + team-order submissions in GHL workflow logs.*  
4. **Set `GHL_WEBHOOK_SECRET`** + align GHL inbound workflow header — *restores quote → portal provisioning.*  
5. **Supabase Auth redirect URLs** for production + localhost — *prevents OAuth failures after URL changes.*  
6. **Run migrations** on restored DB (fan shop 008/009, sanmar catalog, accounts/orders) — *substantial if new project.*  
7. **Confirm GitHub Actions SanMar sync** secrets + run manual workflow — *catalog freshness.*  
8. **Set `RESEND_*`** if admin email messaging needed — *optional for leads.*  
9. **Fix `requireAdmin` `redirect` → `next` param** — *one-line code; lower priority.*  
10. **Patch Next.js 14.2.x security release** (stay on 14, not 15) — *dependency.*  
11. **Visual/mobile QA + browser console pass** after Supabase restored — *verification.*  
12. **Admin home “Coming Soon”** — product decision, not bug fix.

---

*Phase 1 complete. Awaiting approval before any Phase 2 fixes.*
