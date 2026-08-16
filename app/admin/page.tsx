import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { fetchAdminOrders, fetchAdminStats } from "@/lib/admin/admin-orders-query";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import type { OrderStatus } from "@/types/portal";

export const dynamic = "force-dynamic";

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[#1C2333] bg-[#0F1521] p-4">
      <p className="font-sans text-xs font-semibold uppercase tracking-wider text-[#8A94A6]">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

export default async function AdminHomePage() {
  const admin = getSupabaseAdmin();
  const [stats, { rows: recent }] = await Promise.all([
    fetchAdminStats(admin),
    fetchAdminOrders(admin, {
      status: "all",
      date: "30d",
      source: "all",
      garment: "All",
      q: "",
    }, { limit: 8 }),
  ]);

  const { count: accountCount } = await admin
    .from("accounts")
    .select("*", { count: "exact", head: true });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
          Admin Dashboard
        </h1>
        <p className="mt-1 font-sans text-sm text-[#8A94A6]">
          Portal orders and team accounts. Marketing leads still flow through GoHighLevel.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total orders" value={stats.totalOrders} />
        <StatCard label="Orders this month" value={stats.ordersThisMonth} />
        <StatCard label="Accounts this month" value={stats.accountsThisMonth} />
        <StatCard label="Team accounts" value={accountCount ?? 0} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/orders"
          className="rounded-xl border border-[#2A3347] bg-[#1C2333] p-6 transition-colors hover:border-[#3B7BF8]/50 hover:bg-[#252d42]"
        >
          <h2 className="font-display text-lg font-semibold text-white">Orders</h2>
          <p className="mt-2 font-sans text-sm text-[#8A94A6]">
            Filter, review, and message customers on portal submissions.
          </p>
        </Link>
        <Link
          href="/admin/accounts"
          className="rounded-xl border border-[#2A3347] bg-[#1C2333] p-6 transition-colors hover:border-[#3B7BF8]/50 hover:bg-[#252d42]"
        >
          <h2 className="font-display text-lg font-semibold text-white">Accounts</h2>
          <p className="mt-2 font-sans text-sm text-[#8A94A6]">
            Team profiles, contact info, and order history by account.
          </p>
        </Link>
      </section>

      <section className="rounded-xl border border-[#1C2333] bg-[#0F1521] p-4 md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-white">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="font-sans text-sm font-semibold text-[#3B7BF8] hover:underline"
          >
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="font-sans text-sm text-[#8A94A6]">No orders in the last 30 days.</p>
        ) : (
          <ul className="divide-y divide-[#1C2333]">
            {recent.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="font-sans text-sm font-medium text-white">
                    {r.accounts?.team_name ?? "Unknown team"}
                  </p>
                  <p className="font-sans text-xs text-[#8A94A6]">
                    {fmtDate(r.created_at)} · {r.garment_type ?? "—"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <AdminStatusBadge status={r.status as OrderStatus} />
                  <Link
                    href={`/admin/orders/${r.id}`}
                    className="font-sans text-sm font-semibold text-[#3B7BF8] hover:underline"
                  >
                    View
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
