import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ensureAccount } from "@/lib/portal/ensureAccount";
import { OrderForm } from "@/components/portal/OrderForm";
import type { ArtworkAssetRow, OrderItemRow, OrderRow } from "@/types/portal";

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: orderId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const account = await ensureAccount(
    supabase,
    user.id,
    user.email ?? undefined
  );
  if (!account) redirect("/login");

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (!order || (order as OrderRow).account_id !== account.id) {
    notFound();
  }

  const o = order as OrderRow;
  if (o.status !== "draft") {
    redirect(`/portal/orders/${orderId}`);
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);

  const { data: artworkRows } = await supabase
    .from("artwork_assets")
    .select("*")
    .eq("account_id", account.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center gap-3 font-sans text-sm font-medium text-[#8A94A6]">
        <Link href="/portal/orders" className="text-[#3B7BF8] hover:underline">
          Orders
        </Link>
        <span aria-hidden>/</span>
        <Link
          href={`/portal/orders/${orderId}`}
          className="text-[#3B7BF8] hover:underline"
        >
          Order
        </Link>
        <span aria-hidden>/</span>
        <span className="text-white">Edit</span>
      </div>
      <h1 className="font-sans text-2xl font-semibold text-white md:text-3xl">
        New team order
      </h1>
      <OrderForm
        orderId={orderId}
        account={account}
        order={o}
        items={(items ?? []) as OrderItemRow[]}
        artworkAssets={(artworkRows ?? []) as ArtworkAssetRow[]}
      />
    </div>
  );
}
