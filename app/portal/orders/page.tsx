import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ensureAccount } from "@/lib/portal/ensureAccount";
import { OrderStatusBadge } from "@/components/portal/OrderStatusBadge";
import type { OrderRow, OrderStatus } from "@/types/portal";

const STATUSES: OrderStatus[] = [
  "draft",
  "submitted",
  "in_review",
  "in_production",
  "complete",
  "cancelled",
];

const PAGE_SIZE = 20;

export default async function OrdersListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const statusFilter = sp.status;
  const validStatus =
    statusFilter && STATUSES.includes(statusFilter as OrderStatus)
      ? (statusFilter as OrderStatus)
      : undefined;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const account = await ensureAccount(
    supabase,
    user.id,
    user.email ?? undefined
  );
  if (!account) return null;

  let q = supabase
    .from("orders")
    .select("*", { count: "exact" })
    .eq("account_id", account.id)
    .order("created_at", { ascending: false });

  if (validStatus) {
    q = q.eq("status", validStatus);
  }

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const { data: orders, count, error } = await q.range(from, to);

  if (error) {
    return (
      <p className="font-sans text-sm font-medium text-red-400">
        Could not load orders.
      </p>
    );
  }

  const rows = (orders ?? []) as OrderRow[];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const buildQuery = (overrides: {
    page?: string;
    status?: string | null;
  }) => {
    const p = new URLSearchParams();
    const st =
      overrides.status !== undefined ? overrides.status : validStatus;
    if (st) p.set("status", st);
    const pg =
      overrides.page !== undefined ? overrides.page : String(page);
    if (pg !== "1") p.set("page", pg);
    const s = p.toString();
    return s ? `?${s}` : "";
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="font-sans text-2xl font-semibold text-white md:text-3xl">
        My orders
      </h1>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/portal/orders"
          className={`rounded-lg border px-3 py-1.5 font-sans text-xs font-medium ${
            !validStatus
              ? "border-[#3B7BF8] text-[#3B7BF8]"
              : "border-[#2A3347] text-[#8A94A6] hover:border-[#3B7BF8]"
          }`}
        >
          All
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/portal/orders${buildQuery({ status: s, page: "1" })}`}
            className={`rounded-lg border px-3 py-1.5 font-sans text-xs font-medium capitalize ${
              validStatus === s
                ? "border-[#3B7BF8] text-[#3B7BF8]"
                : "border-[#2A3347] text-[#8A94A6] hover:border-[#3B7BF8]"
            }`}
          >
            {s.replace(/_/g, " ")}
          </Link>
        ))}
      </div>

      <div className="hidden md:block overflow-x-auto rounded-xl border border-[#2A3347]">
        <table className="w-full text-left font-sans text-sm">
          <thead className="border-b border-[#2A3347] bg-[#1C2333] text-xs font-medium uppercase tracking-wider text-[#8A94A6]">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Garment</th>
              <th className="px-4 py-3">Decoration</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Deadline</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr
                key={o.id}
                className="border-b border-[#2A3347] last:border-0 hover:bg-[#1C2333]"
              >
                <td className="px-4 py-3 font-mono text-xs text-[#8A94A6]">
                  {o.id.slice(0, 8)}…
                </td>
                <td className="px-4 py-3 font-medium text-white">
                  {o.garment_type ?? "—"}
                </td>
                <td className="px-4 py-3 text-[#8A94A6]">
                  {o.decoration_method ?? "—"}
                </td>
                <td className="px-4 py-3 text-[#8A94A6]">{o.quantity ?? "—"}</td>
                <td className="px-4 py-3 text-[#8A94A6]">
                  {o.deadline
                    ? new Date(o.deadline).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={o.status as OrderStatus} />
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/portal/orders/${o.id}`}
                    className="font-semibold text-[#3B7BF8] hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {rows.map((o) => (
          <li
            key={o.id}
            className="rounded-xl border border-[#2A3347] bg-[#1C2333] p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-mono text-xs text-[#8A94A6]">
                  {o.id.slice(0, 8)}…
                </p>
                <p className="mt-1 font-sans text-sm font-semibold text-white">
                  {o.garment_type ?? "Order"}
                </p>
              </div>
              <OrderStatusBadge status={o.status as OrderStatus} />
            </div>
            <dl className="mt-3 space-y-1 font-sans text-xs font-medium text-[#8A94A6]">
              <div className="flex justify-between">
                <dt>Decoration</dt>
                <dd className="text-white">{o.decoration_method ?? "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Qty</dt>
                <dd className="text-white">{o.quantity ?? "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Deadline</dt>
                <dd className="text-white">
                  {o.deadline
                    ? new Date(o.deadline).toLocaleDateString()
                    : "—"}
                </dd>
              </div>
            </dl>
            <Link
              href={`/portal/orders/${o.id}`}
              className="mt-3 inline-block font-sans text-sm font-semibold text-[#3B7BF8]"
            >
              View order
            </Link>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/portal/orders${buildQuery({ page: String(page - 1) })}`}
              className="rounded-lg border border-[#2A3347] px-4 py-2 font-sans text-sm font-semibold text-[#8A94A6] hover:border-[#3B7BF8]"
            >
              Previous
            </Link>
          )}
          <span className="self-center font-sans text-xs font-medium text-[#8A94A6]">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/portal/orders${buildQuery({ page: String(page + 1) })}`}
              className="rounded-lg border border-[#2A3347] px-4 py-2 font-sans text-sm font-semibold text-[#8A94A6] hover:border-[#3B7BF8]"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
