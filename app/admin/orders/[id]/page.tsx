import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { orderSourceLabel } from "@/lib/admin/order-source-label";
import type { AccountRow, OrderItemRow, OrderRow, OrderStatus } from "@/types/portal";
import { AdminOrderActions } from "./AdminOrderActions";

export const dynamic = "force-dynamic";

function fmt(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function shortId(id: string) {
  return id.slice(0, 8);
}

function isProbablyImageUrl(url: string) {
  return /\.(png|jpe?g|gif|webp|svg)$/i.test(url.split("?")[0] ?? "");
}

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const admin = getSupabaseAdmin();
  const id = params.id;

  const { data: order, error } = await admin
    .from("orders")
    .select(
      `
      *,
      accounts (*)
    `
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !order) notFound();

  const row = order as OrderRow & { accounts: AccountRow | null };
  const account = row.accounts;
  if (!account) notFound();

  const { data: items } = await admin
    .from("order_items")
    .select("*")
    .eq("order_id", id)
    .order("id", { ascending: true });

  const { count: acctOrderCount } = await admin
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("account_id", account.id);

  const roster = (items ?? []) as OrderItemRow[];

  return (
    <div className="space-y-8">
      <nav className="font-sans text-sm text-[#8A94A6]">
        <Link href="/admin" className="hover:text-white">
          Admin
        </Link>
        <span className="mx-2">→</span>
        <span className="text-white">Orders</span>
        <span className="mx-2">→</span>
        <span className="font-mono text-white">#{shortId(row.id)}</span>
      </nav>

      <header className="flex flex-col gap-4 border-b border-[#1C2333] pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-mono text-xs text-[#8A94A6]">{row.id}</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-white">
            Order #{shortId(row.id)}
          </h1>
          <p className="mt-2 font-sans text-sm text-[#8A94A6]">
            Created {fmt(row.created_at)} · Updated {fmt(row.updated_at)}
          </p>
        </div>
        <AdminStatusBadge status={row.status as OrderStatus} />
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl border border-[#1C2333] bg-[#0F1521] p-6">
            <h2 className="font-sans text-lg font-semibold text-white">Order details</h2>
            <dl className="mt-4 grid gap-3 font-sans text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[#8A94A6]">Garment</dt>
                <dd className="text-white">{row.garment_type ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-[#8A94A6]">Decoration</dt>
                <dd className="text-white">{row.decoration_method ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-[#8A94A6]">Quantity</dt>
                <dd className="text-white">{row.quantity ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-[#8A94A6]">Deadline</dt>
                <dd className="text-white">{row.deadline ?? "—"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[#8A94A6]">Notes</dt>
                <dd className="whitespace-pre-wrap text-white">{row.notes ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-[#8A94A6]">Source</dt>
                <dd className="text-white">{orderSourceLabel(row.source)}</dd>
              </div>
              <div>
                <dt className="text-[#8A94A6]">Artwork</dt>
                <dd className="text-white">
                  {row.artwork_url ? (
                    isProbablyImageUrl(row.artwork_url) ? (
                      <a href={row.artwork_url} target="_blank" rel="noreferrer" className="inline-block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={row.artwork_url}
                          alt="Artwork"
                          className="mt-2 max-h-48 rounded border border-[#2A3347] object-contain"
                        />
                      </a>
                    ) : (
                      <a href={row.artwork_url} className="text-[#3B7BF8] hover:underline" target="_blank" rel="noreferrer">
                        Open file
                      </a>
                    )
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-[#1C2333] bg-[#0F1521] p-6">
            <h2 className="font-sans text-lg font-semibold text-white">Roster</h2>
            {roster.length === 0 ? (
              <p className="mt-3 text-sm text-[#8A94A6]">No roster submitted</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-xs uppercase text-[#8A94A6]">
                    <tr>
                      <th className="px-2 py-2">Player</th>
                      <th className="px-2 py-2">#</th>
                      <th className="px-2 py-2">Size</th>
                      <th className="px-2 py-2">Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roster.map((it) => (
                      <tr key={it.id} className="border-t border-[#1C2333]">
                        <td className="px-2 py-2 text-white">{it.player_name ?? "—"}</td>
                        <td className="px-2 py-2 text-white">{it.player_number ?? "—"}</td>
                        <td className="px-2 py-2 text-white">{it.size ?? "—"}</td>
                        <td className="px-2 py-2 text-white">{it.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-[#1C2333] bg-[#0F1521] p-6">
            <h2 className="font-sans text-lg font-semibold text-white">Account</h2>
            <p className="mt-2 font-display text-xl font-bold text-white">{account.team_name}</p>
            <dl className="mt-4 space-y-2 font-sans text-sm">
              <div>
                <dt className="text-[#8A94A6]">Sport</dt>
                <dd className="text-white">{account.sport ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-[#8A94A6]">Contact</dt>
                <dd className="text-white">
                  {[account.contact_name, account.contact_email].filter(Boolean).join(" · ") || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[#8A94A6]">Phone</dt>
                <dd className="text-white">{account.contact_phone ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-[#8A94A6]">Orders (account)</dt>
                <dd className="text-white">{acctOrderCount ?? 0}</dd>
              </div>
            </dl>
            <Link
              href={`/admin/accounts/${account.id}`}
              className="mt-4 inline-block font-sans text-sm font-semibold text-[#3B7BF8] hover:underline"
            >
              View all orders from this account
            </Link>
          </section>

          <AdminOrderActions
            orderId={row.id}
            accountId={account.id}
            initialStatus={row.status as OrderStatus}
            initialAdminNotes={row.admin_notes ?? ""}
          />
        </div>
      </div>
    </div>
  );
}
