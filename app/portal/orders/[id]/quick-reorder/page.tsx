import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { QuickReorderRosterManager } from "@/components/portal/QuickReorderRosterManager";
import { submitQuickReorder } from "@/lib/actions/portal";
import { createClient } from "@/lib/supabase/server";
import { ensureAccount } from "@/lib/portal/ensureAccount";
import type { AccountRow, OrderItemRow, OrderRow } from "@/types/portal";

function formatGarment(garmentType: string | null | undefined): string {
  if (!garmentType?.trim()) return "—";
  return garmentType.includes(",") ? garmentType.replace(/,\s*/g, ", ") : garmentType;
}

async function artworkPreviewUrl(
  supabase: ReturnType<typeof createClient>,
  artworkUrl: string | null | undefined
): Promise<string | null> {
  if (!artworkUrl) return null;
  if (artworkUrl.startsWith("accounts/")) {
    const { data: signed } = await supabase.storage
      .from("artwork")
      .createSignedUrl(artworkUrl, 3600);
    return signed?.signedUrl ?? null;
  }
  if (artworkUrl.match(/\.(png|jpg|jpeg|webp)$/i)) return artworkUrl;
  return null;
}

export default async function QuickReorderPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const draftId = params.id;
  const fromParam =
    typeof searchParams.from === "string"
      ? searchParams.from
      : Array.isArray(searchParams.from)
        ? searchParams.from[0]
        : undefined;
  const errorParam =
    typeof searchParams.error === "string"
      ? searchParams.error
      : Array.isArray(searchParams.error)
        ? searchParams.error[0]
        : undefined;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const account = await ensureAccount(supabase, user.id, user.email ?? undefined);
  if (!account) redirect("/login");

  const { data: draftOrder } = await supabase
    .from("orders")
    .select("*")
    .eq("id", draftId)
    .single();

  if (!draftOrder || (draftOrder as OrderRow).account_id !== account.id) {
    notFound();
  }

  const draft = draftOrder as OrderRow;
  if (draft.status !== "draft") {
    redirect("/portal/orders");
  }

  let originalOrder: OrderRow | null = null;
  if (fromParam) {
    const { data: fromRow } = await supabase
      .from("orders")
      .select("*")
      .eq("id", fromParam)
      .single();
    if (fromRow && (fromRow as OrderRow).account_id === account.id) {
      originalOrder = fromRow as OrderRow;
    }
  }

  const summaryOrder = originalOrder ?? draft;

  const { data: draftItemsData } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", draftId);

  const draftItems = (draftItemsData ?? []) as OrderItemRow[];

  let originalItems: OrderItemRow[] = [];
  if (originalOrder) {
    const { data: origItems } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", originalOrder.id);
    originalItems = (origItems ?? []) as OrderItemRow[];
  }

  const acct = account as AccountRow;
  const defaultRoster =
    Array.isArray(acct.default_roster) && acct.default_roster.length > 0
      ? acct.default_roster
      : null;

  const artworkDisplay = await artworkPreviewUrl(supabase, summaryOrder.artwork_url);
  const showArtworkDeferred = summaryOrder.artwork_deferred === true && !artworkDisplay;

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-16">
      <nav className="font-sans text-sm font-medium text-[#8A94A6]" aria-label="Breadcrumb">
        <Link href="/portal/orders" className="text-[#3B7BF8] hover:underline">
          Orders
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <Link href={`/portal/orders/${draftId}`} className="text-[#3B7BF8] hover:underline">
          Order
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span className="text-white">Quick reorder</span>
      </nav>

      {errorParam === "empty-roster" && (
        <div
          className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 font-sans text-sm text-red-400"
          role="alert"
        >
          Add at least one player with a name before submitting.
        </div>
      )}

      <header>
        <h1 className="font-sans text-2xl font-semibold text-white">Quick reorder</h1>
        <p className="mt-1 font-sans text-sm text-[#8A94A6]">
          Review and adjust your previous order
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-[#2A3347] bg-[#1C2333] p-6">
          <h2 className="font-sans text-lg font-semibold text-white">
            {originalOrder ? "Previous order" : "Order summary"}
          </h2>
          <dl className="mt-4 space-y-3">
            <div>
              <dt className="font-sans text-xs font-medium uppercase text-[#8A94A6]">Garment</dt>
              <dd className="mt-1 font-sans text-sm text-white">
                {formatGarment(summaryOrder.garment_type)}
              </dd>
            </div>
            <div>
              <dt className="font-sans text-xs font-medium uppercase text-[#8A94A6]">Decoration</dt>
              <dd className="mt-1 font-sans text-sm text-white">
                {summaryOrder.decoration_method ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="font-sans text-xs font-medium uppercase text-[#8A94A6]">Quantity</dt>
              <dd className="mt-1 font-sans text-sm text-white">
                {draft.quantity ?? summaryOrder.quantity ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="font-sans text-xs font-medium uppercase text-[#8A94A6]">Season</dt>
              <dd className="mt-1 font-sans text-sm text-white">{summaryOrder.season ?? "—"}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-[#2A3347] bg-[#1C2333] p-6">
          <h2 className="font-sans text-lg font-semibold text-white">Artwork</h2>
          {artworkDisplay ? (
            <div className="mt-4 overflow-hidden rounded-lg border border-[#2A3347] bg-[#0F1521]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={artworkDisplay}
                alt="Artwork preview"
                className="max-h-80 w-full object-contain"
              />
            </div>
          ) : showArtworkDeferred ? (
            <p className="mt-4 font-sans text-sm text-[#8A94A6]">
              Artwork will be sent separately for this order.
            </p>
          ) : (
            <p className="mt-4 font-sans text-sm text-[#8A94A6]">No artwork on file.</p>
          )}
          <p className="mt-4 font-sans text-sm text-[#8A94A6]">
            Need different garment or artwork?{" "}
            <Link
              href={`/portal/orders/${draftId}/edit`}
              className="font-semibold text-[#3B7BF8] hover:underline"
            >
              Edit full order details
            </Link>
          </p>
        </div>
      </section>

      <QuickReorderRosterManager
        orderId={draftId}
        draftItems={draftItems}
        originalItems={originalItems}
        accountDefaultRoster={defaultRoster}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <form action={submitQuickReorder.bind(null, draftId, fromParam ?? null)}>
          <button
            type="submit"
            className="rounded-lg bg-[#3B7BF8] px-6 py-3 font-sans text-sm font-semibold text-white transition-opacity duration-150 hover:opacity-90"
          >
            Submit reorder
          </button>
        </form>
        <Link
          href={`/portal/orders/${draftId}/edit`}
          className="inline-flex items-center justify-center rounded-lg border border-[#3B7BF8] px-6 py-3 font-sans text-sm font-semibold text-[#3B7BF8] transition-opacity duration-150 hover:bg-[#1C2333]"
        >
          Edit full order details
        </Link>
      </div>
    </div>
  );
}
