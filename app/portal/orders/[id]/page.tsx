import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { ensureAccount } from "@/lib/portal/ensureAccount";
import { PortalAccountSetupFailed } from "@/components/portal/PortalAccountSetupFailed";
import { reorderAndRedirect } from "@/lib/actions/portal";
import { OrderStatusBadge } from "@/components/portal/OrderStatusBadge";
import {
  DownloadRosterButton,
  OrderSubmittedToast,
} from "@/components/portal/OrderDetailClient";
import type { OrderItemRow, OrderRow, OrderStatus } from "@/types/portal";

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const account = await ensureAccount(
    supabase,
    user.id,
    user.email ?? undefined,
    user
  );
  if (!account) return <PortalAccountSetupFailed />;

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!order || (order as OrderRow).account_id !== account.id) {
    notFound();
  }

  const o = order as OrderRow;
  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", params.id);

  const roster = (items ?? []) as OrderItemRow[];

  let artworkPreview: string | null = null;
  if (o.artwork_url && o.artwork_url.startsWith("accounts/")) {
    const { data: signed } = await supabase.storage
      .from("artwork")
      .createSignedUrl(o.artwork_url, 3600);
    artworkPreview = signed?.signedUrl ?? null;
  } else if (o.artwork_url?.match(/\.(png|jpg|jpeg|webp)$/i)) {
    artworkPreview = o.artwork_url;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Suspense fallback={null}>
        <OrderSubmittedToast />
      </Suspense>

      <nav className="font-sans text-sm font-medium text-[#8A94A6]">
        <Link href="/portal/orders" className="text-[#3B7BF8] hover:underline">
          My orders
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span className="text-white">Order {o.id.slice(0, 8)}…</span>
      </nav>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <OrderStatusBadge status={o.status as OrderStatus} />
            <span className="font-mono text-xs text-[#8A94A6]">{o.id}</span>
          </div>
          <h1 className="mt-2 font-sans text-2xl font-semibold text-white md:text-3xl">
            {o.garment_type ?? "Order"} · Qty {o.quantity ?? "—"}
          </h1>
          <p className="mt-1 font-sans text-sm font-medium text-[#8A94A6]">
            Updated {new Date(o.updated_at).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DownloadRosterButton items={roster} />
          {o.status !== "draft" && (
            <form action={reorderAndRedirect.bind(null, o.id)}>
              <button
                type="submit"
                className="rounded-lg bg-[#3B7BF8] px-4 py-2 font-sans text-sm font-semibold text-white hover:opacity-90"
              >
                Reorder
              </button>
            </form>
          )}
          {o.status === "draft" && (
            <Link
              href={`/portal/orders/${o.id}/edit`}
              className="inline-flex items-center rounded-lg border border-[#3B7BF8] px-4 py-2 font-sans text-sm font-semibold text-[#3B7BF8] hover:bg-[#1C2333]"
            >
              Continue editing
            </Link>
          )}
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <dl className="space-y-3 rounded-xl border border-[#2A3347] bg-[#1C2333] p-6 font-sans text-sm font-medium">
          <div>
            <dt className="text-[#8A94A6]">Decoration</dt>
            <dd className="text-white">{o.decoration_method ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[#8A94A6]">Deadline</dt>
            <dd className="text-white">
              {o.deadline ? new Date(o.deadline).toLocaleDateString() : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-[#8A94A6]">Season</dt>
            <dd className="text-white">{o.season ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[#8A94A6]">Notes</dt>
            <dd className="whitespace-pre-wrap text-white">{o.notes ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[#8A94A6]">Artwork</dt>
            <dd className="text-white">
              {o.artwork_deferred
                ? "To be sent separately"
                : o.artwork_url ?? "—"}
            </dd>
          </div>
        </dl>

        <div className="rounded-xl border border-[#2A3347] bg-[#1C2333] p-6">
          <h2 className="font-sans text-sm font-semibold text-white">Preview</h2>
          {artworkPreview && /\.(png|jpg|jpeg|webp)$/i.test(artworkPreview) ? (
            <div className="mt-4 overflow-hidden rounded-lg border border-[#2A3347] bg-[#0F1521]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={artworkPreview}
                alt="Artwork"
                className="max-h-80 w-full object-contain"
              />
            </div>
          ) : (
            <p className="mt-4 font-sans text-sm font-medium text-[#8A94A6]">
              No image preview (vector/PDF or file on file).
            </p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-[#2A3347] bg-[#1C2333] p-6">
        <h2 className="font-sans text-lg font-semibold text-white">Roster</h2>
        {roster.length === 0 ? (
          <p className="mt-2 font-sans text-sm font-medium text-[#8A94A6]">
            No line items on this order.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left font-sans text-sm">
              <thead className="text-xs font-medium uppercase text-[#8A94A6]">
                <tr>
                  <th className="pb-2 pr-4">Player</th>
                  <th className="pb-2 pr-4">#</th>
                  <th className="pb-2 pr-4">Size</th>
                  <th className="pb-2">Qty</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((r) => (
                  <tr key={r.id} className="border-t border-[#2A3347]">
                    <td className="py-2 pr-4 font-medium text-white">
                      {r.player_name ?? "—"}
                    </td>
                    <td className="py-2 pr-4 text-[#8A94A6]">
                      {r.player_number ?? "—"}
                    </td>
                    <td className="py-2 pr-4 text-[#8A94A6]">{r.size ?? "—"}</td>
                    <td className="py-2 text-[#8A94A6]">{r.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
