import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { supabaseDashboardProjectUrl } from "@/lib/admin/supabase-dashboard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { orderSourceLabel } from "@/lib/admin/order-source-label";
import type { AccountRow, OrderRow, OrderStatus } from "@/types/portal";
import { AdminAccountControls } from "./AdminAccountControls";

export const dynamic = "force-dynamic";

function fmt(iso: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(iso));
}

export default async function AdminAccountPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const admin = getSupabaseAdmin();
  const accountId = params.id;

  const { data: account, error } = await admin.from("accounts").select("*").eq("id", accountId).maybeSingle();

  if (error || !account) notFound();
  const a = account as AccountRow;

  const { data: orders } = await admin
    .from("orders")
    .select("*")
    .eq("account_id", accountId)
    .order("created_at", { ascending: false });

  const list = (orders ?? []) as OrderRow[];

  const { data: orderIds } = await admin.from("orders").select("id").eq("account_id", accountId);
  const ids = (orderIds ?? []).map((r) => r.id as string);
  let totalItems = 0;
  if (ids.length) {
    const { data: items } = await admin.from("order_items").select("quantity").in("order_id", ids);
    totalItems = (items ?? []).reduce((s, r) => s + Number((r as { quantity: number }).quantity ?? 0), 0);
  }

  const dash = supabaseDashboardProjectUrl();

  return (
    <div className="space-y-10">
      <nav className="font-sans text-sm text-[#8A94A6]">
        <Link href="/admin/accounts" className="hover:text-white">
          Admin
        </Link>
        <span className="mx-2">→</span>
        <span className="text-white">Account</span>
      </nav>

      <header className="flex flex-col justify-between gap-4 border-b border-[#1C2333] pb-6 md:flex-row md:items-start">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">{a.team_name}</h1>
          <p className="mt-2 font-sans text-sm text-[#8A94A6]">Created {fmt(a.created_at)}</p>
          <dl className="mt-4 grid gap-2 font-sans text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[#8A94A6]">Sport</dt>
              <dd className="text-white">{a.sport ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[#8A94A6]">Contact</dt>
              <dd className="text-white">
                {[a.contact_name, a.contact_email].filter(Boolean).join(" · ") || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-[#8A94A6]">Phone</dt>
              <dd className="text-white">{a.contact_phone ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[#8A94A6]">Totals</dt>
              <dd className="text-white">
                {list.length} orders · {totalItems} roster line qty
              </dd>
            </div>
          </dl>
        </div>
        <AdminAccountControls
          accountId={a.id}
          initialVip={Boolean(a.vip)}
          dashboardUrl={dash}
        />
      </header>

      <section>
        <h2 className="mb-4 font-sans text-lg font-semibold text-white">Orders</h2>
        <div className="overflow-x-auto rounded-xl border border-[#1C2333]">
          <table className="min-w-full font-sans text-sm">
            <thead className="bg-[#0A0F1A] text-left text-xs font-semibold uppercase tracking-wider text-[#8A94A6]">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Garment</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3"> </th>
              </tr>
            </thead>
            <tbody>
              {list.map((o) => (
                <tr key={o.id} className="border-t border-[#1C2333] hover:bg-[#1C2333]">
                  <td className="px-4 py-3 text-white">{fmt(o.created_at)}</td>
                  <td className="px-4 py-3 text-[#8A94A6]">{o.garment_type ?? "—"}</td>
                  <td className="px-4 py-3 text-white">{o.quantity ?? "—"}</td>
                  <td className="px-4 py-3">
                    <AdminStatusBadge status={o.status as OrderStatus} />
                  </td>
                  <td className="px-4 py-3 text-[#8A94A6]">{orderSourceLabel(o.source)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="font-semibold text-[#3B7BF8] hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-[#8A94A6]">No orders yet.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
