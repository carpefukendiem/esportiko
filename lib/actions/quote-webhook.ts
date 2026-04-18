import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getSiteUrl } from "@/lib/site-url";
import type { AccountRow } from "@/types/portal";

export const ghlQuoteQuoteTypes = ["team", "business", "contact"] as const;

export type GHLQuotePayload = {
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  company?: string;
  quote_type: (typeof ghlQuoteQuoteTypes)[number];
  garment_types?: string[];
  quantity?: number;
  deadline?: string;
  notes?: string;
  sport?: string;
  league_or_school?: string;
  artwork_url?: string;
  ghl_contact_id?: string;
  ghl_opportunity_id?: string;
  source?: string;
};

const ghlQuotePayloadSchema = z.object({
  email: z.preprocess(
    (v) => (typeof v === "string" ? v.trim() : v),
    z.string().email()
  ),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  quote_type: z.enum(ghlQuoteQuoteTypes),
  garment_types: z.array(z.string()).optional(),
  quantity: z.number().int().positive().optional(),
  deadline: z.string().optional(),
  notes: z.string().optional(),
  sport: z.string().optional(),
  league_or_school: z.string().optional(),
  artwork_url: z.string().optional(),
  ghl_contact_id: z.string().optional(),
  ghl_opportunity_id: z.string().optional(),
  source: z.string().optional(),
});

export type QuoteWebhookResult = {
  user_id: string;
  account_id: string;
  order_id: string;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function displayName(payload: GHLQuotePayload): string {
  const parts = [payload.first_name?.trim(), payload.last_name?.trim()].filter(Boolean);
  return parts.join(" ").trim();
}

function defaultTeamName(payload: GHLQuotePayload, email: string): string {
  const company = payload.company?.trim();
  if (company) return company;
  const name = displayName(payload);
  if (name) return name;
  return email.split("@")[0]?.replace(/\./g, " ") ?? "My team";
}

async function findUserIdByEmail(
  admin: ReturnType<typeof getSupabaseAdmin>,
  email: string
): Promise<string | null> {
  const target = normalizeEmail(email);
  let page = 1;
  const perPage = 1000;
  const maxPages = 50;
  while (page <= maxPages) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const users = data.users ?? [];
    const hit = users.find((u) => (u.email ?? "").toLowerCase() === target);
    if (hit) return hit.id;
    if (users.length < perPage) return null;
    page += 1;
  }
  return null;
}

async function ensureAuthUser(
  admin: ReturnType<typeof getSupabaseAdmin>,
  payload: GHLQuotePayload,
  email: string
): Promise<string> {
  const existing = await findUserIdByEmail(admin, email);
  if (existing) return existing;

  const { data, error } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: {
      team_name: payload.company?.trim() ?? null,
      first_name: payload.first_name?.trim() ?? null,
      last_name: payload.last_name?.trim() ?? null,
      source: "ghl_quote_webhook",
    },
  });

  if (data?.user?.id) return data.user.id;

  const msg = error?.message?.toLowerCase() ?? "";
  if (
    msg.includes("already registered") ||
    msg.includes("already been registered") ||
    msg.includes("duplicate")
  ) {
    const again = await findUserIdByEmail(admin, email);
    if (again) return again;
  }

  throw error ?? new Error("Failed to create auth user");
}

async function ensureAccountRow(
  admin: ReturnType<typeof getSupabaseAdmin>,
  payload: GHLQuotePayload,
  userId: string,
  email: string
): Promise<AccountRow> {
  const { data: existing, error: selErr } = await admin
    .from("accounts")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (selErr) throw selErr;
  if (existing) {
    const row = existing as AccountRow;
    const patch: Record<string, unknown> = {};
    if (payload.ghl_contact_id?.trim()) {
      patch.ghl_contact_id = payload.ghl_contact_id.trim();
    }
    if (Object.keys(patch).length) {
      const { error: upErr } = await admin.from("accounts").update(patch).eq("id", row.id);
      if (upErr) throw upErr;
      return { ...row, ...patch } as AccountRow;
    }
    return row;
  }

  const teamName = defaultTeamName(payload, email);
  const contactName = displayName(payload) || null;
  const insert = {
    user_id: userId,
    team_name: teamName,
    contact_name: contactName,
    contact_email: email,
    contact_phone: payload.phone?.trim() || null,
    sport: payload.sport?.trim() || null,
    league_or_school: payload.league_or_school?.trim() || null,
    onboarding_completed: false,
    ghl_contact_id: payload.ghl_contact_id?.trim() || null,
  };

  const { data: created, error: insErr } = await admin
    .from("accounts")
    .insert(insert)
    .select("*")
    .single();

  if (insErr || !created) throw insErr ?? new Error("Failed to create account");
  return created as AccountRow;
}

function buildOrderNotes(payload: GHLQuotePayload): string | null {
  const lines: string[] = [];
  if (payload.notes?.trim()) lines.push(payload.notes.trim());
  const meta: string[] = [];
  meta.push(`Quote type: ${payload.quote_type}`);
  if (payload.source?.trim()) meta.push(`Form source: ${payload.source.trim()}`);
  if (payload.ghl_opportunity_id?.trim()) {
    meta.push(`GHL opportunity: ${payload.ghl_opportunity_id.trim()}`);
  }
  if (meta.length) lines.push(meta.join("\n"));
  return lines.length ? lines.join("\n\n") : null;
}

async function sendPasswordSetEmail(email: string): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  const publicClient = createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const redirectTo = `${getSiteUrl()}/reset-password`;
  const { error } = await publicClient.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw error;
}

export function parseGhlQuotePayload(body: unknown): GHLQuotePayload {
  return ghlQuotePayloadSchema.parse(body) as GHLQuotePayload;
}

/**
 * Creates or links auth user, account, and draft order; sends password reset email.
 * Intended for server-side webhook handlers only.
 */
export async function processQuoteWebhook(
  rawPayload: unknown
): Promise<QuoteWebhookResult> {
  const payload = parseGhlQuotePayload(rawPayload);
  const email = normalizeEmail(payload.email);
  const admin = getSupabaseAdmin();

  const userId = await ensureAuthUser(admin, payload, email);
  const account = await ensureAccountRow(admin, payload, userId, email);

  const garmentType =
    payload.garment_types?.length ? payload.garment_types.join(", ") : null;
  let deadline: string | null = null;
  if (payload.deadline?.trim()) {
    const d = payload.deadline.trim();
    deadline = /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : null;
  }

  const orderInsert = {
    account_id: account.id,
    status: "draft" as const,
    garment_type: garmentType,
    quantity: payload.quantity ?? null,
    deadline,
    notes: buildOrderNotes(payload),
    artwork_url: payload.artwork_url?.trim() || null,
    ghl_contact_id: payload.ghl_contact_id?.trim() || null,
    source: "ghl_quote_webhook",
  };

  const { data: order, error: orderErr } = await admin
    .from("orders")
    .insert(orderInsert)
    .select("id")
    .single();

  if (orderErr || !order) throw orderErr ?? new Error("Failed to create draft order");

  await sendPasswordSetEmail(email);

  return {
    user_id: userId,
    account_id: account.id,
    order_id: order.id as string,
  };
}
