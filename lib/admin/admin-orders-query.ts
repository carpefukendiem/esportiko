import type { SupabaseClient } from "@supabase/supabase-js";
import type { AccountRow, OrderRow } from "@/types/portal";

export type AdminOrderRow = OrderRow & {
  accounts: AccountRow | null;
};

export type AdminOrdersFilters = {
  status: string;
  date: string;
  source: string;
  garment: string;
  q: string;
};

const GARMENT_OPTIONS = [
  "All",
  "Jerseys",
  "Hoodies",
  "T-Shirts",
  "Polos",
  "Hats",
  "Shorts",
  "Warmup",
] as const;

export function garmentFilterOptions(): string[] {
  return [...GARMENT_OPTIONS];
}

function startIsoForRange(dateKey: string): string | null {
  if (dateKey === "all" || !dateKey) return null;
  const days =
    dateKey === "7d" ? 7 : dateKey === "30d" ? 30 : dateKey === "90d" ? 90 : null;
  if (!days) return null;
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export async function fetchAdminOrders(
  admin: SupabaseClient,
  filters: AdminOrdersFilters,
  opts?: { limit?: number }
): Promise<{ rows: AdminOrderRow[]; totalFetched: number }> {
  const limit = opts?.limit ?? 800;
  let q = admin
    .from("orders")
    .select(
      `
      id,
      account_id,
      status,
      garment_type,
      decoration_method,
      quantity,
      deadline,
      season,
      notes,
      artwork_url,
      artwork_deferred,
      roster_incomplete,
      ghl_contact_id,
      source,
      admin_notes,
      last_admin_update,
      created_at,
      updated_at,
      accounts (
        id,
        user_id,
        team_name,
        sport,
        contact_name,
        contact_email,
        contact_phone,
        default_roster,
        use_default_roster_for_new_orders,
        vip,
        admin_notes,
        created_at
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  const start = startIsoForRange(filters.date);
  if (start) q = q.gte("created_at", start);

  if (filters.status && filters.status !== "all") {
    q = q.eq("status", filters.status);
  }

  if (filters.source === "ghl") {
    q = q.eq("source", "ghl_quote_webhook");
  } else if (filters.source === "portal") {
    q = q.or("source.is.null,source.neq.ghl_quote_webhook");
  }

  if (filters.garment && filters.garment !== "All") {
    q = q.ilike("garment_type", `%${filters.garment}%`);
  }

  const { data, error } = await q;
  if (error) {
    console.error("fetchAdminOrders", error);
    throw new Error("Failed to load orders");
  }

  const raw = (data ?? []) as unknown[];
  let rows: AdminOrderRow[] = raw.map((row) => {
    const r = row as Record<string, unknown> & { accounts?: AccountRow | AccountRow[] | null };
    const acc = r.accounts;
    const accounts = Array.isArray(acc) ? acc[0] ?? null : acc ?? null;
    return { ...(r as unknown as OrderRow), accounts } as AdminOrderRow;
  });
  const totalFetched = rows.length;

  const needle = filters.q.trim().toLowerCase();
  if (needle) {
    rows = rows.filter((r) => {
      const a = r.accounts;
      const hay = [
        a?.team_name,
        a?.contact_email,
        a?.contact_name,
        r.notes,
        r.garment_type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }

  return { rows, totalFetched };
}

export type AdminStats = {
  totalOrders: number;
  ordersThisMonth: number;
  accountsThisMonth: number;
  byStatus: Record<string, number>;
};

export async function fetchAdminStats(admin: SupabaseClient): Promise<AdminStats> {
  const now = new Date();
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const statuses = [
    "draft",
    "submitted",
    "in_review",
    "in_production",
    "complete",
    "cancelled",
  ] as const;

  const [totalRes, monthOrdersRes, monthAccountsRes, ...perStatus] = await Promise.all([
    admin.from("orders").select("*", { count: "exact", head: true }),
    admin.from("orders").select("*", { count: "exact", head: true }).gte("created_at", startMonth),
    admin.from("accounts").select("*", { count: "exact", head: true }).gte("created_at", startMonth),
    ...statuses.map((s) =>
      admin.from("orders").select("*", { count: "exact", head: true }).eq("status", s)
    ),
  ]);

  const byStatus: Record<string, number> = {};
  statuses.forEach((s, i) => {
    byStatus[s] = perStatus[i].count ?? 0;
  });

  return {
    totalOrders: totalRes.count ?? 0,
    ordersThisMonth: monthOrdersRes.count ?? 0,
    accountsThisMonth: monthAccountsRes.count ?? 0,
    byStatus,
  };
}
