import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { orderSourceLabel } from "@/lib/admin/order-source-label";
import {
  fetchAdminOrders,
  fetchAdminStats,
  garmentFilterOptions,
  type AdminOrdersFilters,
} from "@/lib/admin/admin-orders-query";
import type { OrderStatus } from "@/types/portal";

export const dynamic = "force-dynamic";

function parseFilters(sp: Record<string, string | string[] | undefined>): AdminOrdersFilters {
  const g = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };
  return {
    status: g("status") ?? "all",
    date: g("date") ?? "30d",
    source: g("source") ?? "all",
    garment: g("garment") ?? "All",
    q: g("q") ?? "",
  };
}

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

function shortId(id: string) {
  return id.slice(0, 8);
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const filters = parseFilters(searchParams);
  const admin = getSupabaseAdmin();
  const [stats, { rows, totalFetched }] = await Promise.all([
    fetchAdminStats(admin),
    fetchAdminOrders(admin, filters),
  ]);

  const garmentOpts = garmentFilterOptions();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
          Orders
        </h1>
        <p className="mt-1 font-sans text-sm text-[#8A94A6]">
          All portal orders across accounts. Filters use the URL so you can bookmark views.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total orders" value={stats.totalOrders} />
        <StatCard label="Orders this month" value={stats.ordersThisMonth} />
        <StatCard label="Accounts this month" value={stats.accountsThisMonth} />
        <div className="rounded-xl border border-[#1C2333] bg-[#0F1521] p-4">
          <p className="font-sans text-xs font-semibold uppercase tracking-wider text-[#8A94A6]">
            By status
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(stats.byStatus).map(([k, v]) => (
              <span
                key={k}
                className="rounded-full border border-[#2A3347] bg-[#1C2333] px-2.5 py-1 font-sans text-xs font-medium text-[#8A94A6]"
              >
                {k.replaceAll("_", " ")}: <span className="text-white">{v}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#1C2333] bg-[#0F1521] p-4 md:p-6">
        <form method="get" className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
          <label className="flex flex-col gap-1 font-sans text-xs font-medium text-[#8A94A6]">
            Status
            <select
              name="status"
              defaultValue={filters.status}
              className="rounded-lg border border-[#2A3347] bg-[#0A0F1A] px-3 py-2 font-sans text-sm text-white"
            >
              <option value="all">All</option>
              {(
                [
                  "draft",
                  "submitted",
                  "in_review",
                  "in_production",
                  "complete",
                  "cancelled",
                ] as const
              ).map((s) => (
                <option key={s} value={s}>
                  {s.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 font-sans text-xs font-medium text-[#8A94A6]">
            Date range
            <select
              name="date"
              defaultValue={filters.date}
              className="rounded-lg border border-[#2A3347] bg-[#0A0F1A] px-3 py-2 font-sans text-sm text-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 font-sans text-xs font-medium text-[#8A94A6]">
            Source
            <select
              name="source"
              defaultValue={filters.source}
              className="rounded-lg border border-[#2A3347] bg-[#0A0F1A] px-3 py-2 font-sans text-sm text-white"
            >
              <option value="all">All</option>
              <option value="portal">Portal</option>
              <option value="ghl">GHL Quote</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 font-sans text-xs font-medium text-[#8A94A6]">
            Garment
            <select
              name="garment"
              defaultValue={filters.garment}
              className="rounded-lg border border-[#2A3347] bg-[#0A0F1A] px-3 py-2 font-sans text-sm text-white"
            >
              {garmentOpts.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>
          <label className="flex min-w-[200px] flex-1 flex-col gap-1 font-sans text-xs font-medium text-[#8A94A6]">
            Search
            <input
              name="q"
              defaultValue={filters.q}
              placeholder="Team, email, notes…"
              className="rounded-lg border border-[#2A3347] bg-[#0A0F1A] px-3 py-2 font-sans text-sm text-white placeholder:text-[#5C6578]"
            />
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-lg bg-[#3B7BF8] px-4 py-2 font-sans text-sm font-semibold text-white hover:opacity-90"
            >
              Apply
            </button>
            <Link
              href="/admin"
              className="rounded-lg border border-[#2A3347] px-4 py-2 font-sans text-sm font-semibold text-[#8A94A6] hover:bg-[#1C2333] hover:text-white"
            >
              Clear filters
            </Link>
          </div>
        </form>
        <p className="mt-4 font-sans text-sm text-[#8A94A6]">
          Showing <span className="font-semibold text-white">{rows.length}</span>
          {filters.q.trim()
            ? ` matching search (scanned ${totalFetched} in range)`
            : ` of ${totalFetched} in range`}
          {totalFetched >= 800 ? " — cap 800 newest; narrow filters if needed." : ""}
        </p>
      </section>

      <div className="overflow-x-auto rounded-xl border border-[#1C2333]">
        <table className="min-w-full border-collapse font-sans text-sm">
          <thead className="sticky top-0 z-20 bg-[#0A0F1A] shadow-[0_1px_0_#1C2333]">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-[#8A94A6]">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Team / account</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Garment</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const a = r.accounts;
              const contact =
                [a?.contact_name, a?.contact_email].filter(Boolean).join(" · ") || "—";
              return (
                <tr
                  key={r.id}
                  className="border-t border-[#1C2333] transition-colors hover:bg-[#1C2333]"
                >
                  <td className="px-4 py-3 align-top text-white">{fmtDate(r.created_at)}</td>
                  <td className="px-4 py-3 align-top font-medium text-white">
                    <div>{a?.team_name ?? "—"}</div>
                    {a?.id ? (
                      <Link
                        href={`/admin/accounts/${a.id}`}
                        className="mt-1 inline-block font-sans text-xs font-semibold text-[#3B7BF8] hover:underline"
                      >
                        Account
                      </Link>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 align-top text-[#8A94A6]">{contact}</td>
                  <td className="px-4 py-3 align-top text-[#8A94A6]">{r.garment_type ?? "—"}</td>
                  <td className="px-4 py-3 align-top text-white">{r.quantity ?? "—"}</td>
                  <td className="px-4 py-3 align-top">
                    <AdminStatusBadge status={r.status as OrderStatus} />
                  </td>
                  <td className="px-4 py-3 align-top text-[#8A94A6]">
                    {orderSourceLabel(r.source)}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <Link
                      href={`/admin/orders/${r.id}`}
                      className="font-semibold text-[#3B7BF8] hover:underline"
                    >
                      View
                    </Link>
                    <p className="mt-2 font-mono text-[10px] text-[#5C6578]">#{shortId(r.id)}</p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <p className="px-4 py-10 text-center font-sans text-sm text-[#8A94A6]">
            No orders match these filters.
          </p>
        ) : null}
      </div>
    </div>
  );
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
