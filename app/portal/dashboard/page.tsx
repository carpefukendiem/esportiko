import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureAccount } from "@/lib/portal/ensureAccount";
import { dashboardWelcomeDisplayName } from "@/lib/portal/dashboardWelcomeName";
import { PortalAccountSetupFailed } from "@/components/portal/PortalAccountSetupFailed";
import { OrderStatusBadge } from "@/components/portal/OrderStatusBadge";
import { GhlQuoteDraftBanner } from "@/components/portal/GhlQuoteDraftBanner";
import { NewOrderButton } from "@/components/portal/NewOrderButton";
import { ReorderButton } from "@/components/portal/ReorderButton";
import { ArtworkUploader } from "@/components/portal/ArtworkUploader";
import type { OrderRow, OrderStatus, SavedConfigurationRow } from "@/types/portal";

export default async function PortalDashboardPage({
  searchParams,
}: {
  searchParams?: { order_error?: string };
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

  const [{ data: orders }, { data: configs }, { data: ghlDraft }, { data: artworkRows }] =
    await Promise.all([
      supabase
        .from("orders")
        .select("*")
        .eq("account_id", account.id)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("saved_configurations")
        .select("*")
        .eq("account_id", account.id)
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("orders")
        .select("id")
        .eq("account_id", account.id)
        .eq("status", "draft")
        .eq("source", "ghl_quote_webhook")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("artwork_assets")
        .select("id, filename, storage_path, created_at")
        .eq("account_id", account.id)
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

  const list = (orders ?? []) as OrderRow[];
  const saved = (configs ?? []) as SavedConfigurationRow[];
  const artwork = artworkRows ?? [];

  const artworkThumbs = await Promise.all(
    artwork.map(async (a) => {
      const name = a.filename ?? a.storage_path.split("/").pop() ?? "";
      if (!/\.(png|jpg|jpeg|webp|svg)$/i.test(name)) {
        return { ...a, signedUrl: null as string | null };
      }
      const { data: signed } = await supabase.storage
        .from("artwork")
        .createSignedUrl(a.storage_path, 3600);
      return { ...a, signedUrl: signed?.signedUrl ?? null };
    })
  );

  const showGhlQuoteBanner =
    account.onboarding_completed === false &&
    Boolean(ghlDraft && typeof ghlDraft.id === "string");

  const welcomeName = dashboardWelcomeDisplayName(
    account,
    user.email ?? undefined
  );

  const needsTeamProfile =
    !String(account.sport ?? "").trim() ||
    !String(account.contact_name ?? "").trim();

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      {searchParams?.order_error ? (
        <div
          className="rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-3 font-sans text-sm text-red-200"
          role="alert"
        >
          Could not create a new order. Check your connection and team profile in Settings, then try
          again.
        </div>
      ) : null}

      {showGhlQuoteBanner && ghlDraft && typeof ghlDraft.id === "string" ? (
        <GhlQuoteDraftBanner orderId={ghlDraft.id} />
      ) : null}

      {needsTeamProfile ? (
        <div
          className="rounded-xl border border-[#3B7BF8]/40 bg-[#1C2333] px-4 py-3 font-sans text-sm text-[#B8D4FF]"
          role="status"
        >
          Complete your{" "}
          <Link href="/portal/settings?onboarding=true" className="font-semibold underline">
            team profile
          </Link>{" "}
          so we can personalize orders — you can still upload logos and start a draft order.
        </div>
      ) : null}

      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-sans text-2xl font-semibold text-white md:text-3xl">
            Welcome back, {welcomeName}
          </h1>
          <p className="mt-1 font-sans text-sm font-medium text-[#8A94A6]">
            Manage orders, rosters, artwork, and your fan shop in one place.
          </p>
        </div>
        <NewOrderButton>Start new order</NewOrderButton>
      </header>

      <section className="rounded-xl border border-[#2A3347] bg-[#1C2333] p-5 md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-sans text-lg font-semibold text-white">Team logos & artwork</h2>
            <p className="mt-1 font-sans text-sm text-[#8A94A6]">
              Upload multiple files at once — used on orders and fan shop previews.
            </p>
          </div>
          <Link
            href="/portal/artwork"
            className="font-sans text-sm font-semibold text-[#3B7BF8] hover:underline"
          >
            View library →
          </Link>
        </div>
        <ArtworkUploader accountId={account.id} compact />
        {artworkThumbs.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-3">
            {artworkThumbs.map((a) => (
              <li
                key={a.id}
                className="h-16 w-16 overflow-hidden rounded-lg border border-[#2A3347] bg-[#0F1521]"
              >
                {a.signedUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.signedUrl} alt="" className="h-full w-full object-contain" />
                ) : (
                  <div className="flex h-full items-center justify-center text-[10px] text-[#8A94A6]">
                    File
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section>
        <h2 className="mb-4 font-sans text-lg font-semibold text-white">Recent orders</h2>
        {list.length === 0 ? (
          <div className="rounded-xl border border-[#2A3347] bg-[#1C2333] px-6 py-14 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl border border-[#2A3347] bg-[#0F1521]">
              <svg
                className="h-8 w-8 text-[#8A94A6]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M9 5H5v4M15 5h4v4M9 19H5v-4M15 19h4v-4" />
                <rect x="9" y="9" width="6" height="6" rx="1" />
              </svg>
            </div>
            <p className="font-sans text-sm font-medium text-[#8A94A6]">
              No orders yet — start your first project with Esportiko.
            </p>
            <div className="mt-6 flex justify-center">
              <NewOrderButton variant="outline">Start your first order</NewOrderButton>
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {list.map((o) => (
              <li
                key={o.id}
                className="flex flex-col gap-3 rounded-xl border border-[#2A3347] bg-[#1C2333] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <OrderStatusBadge status={o.status as OrderStatus} />
                    <span className="font-sans text-sm font-medium text-white">
                      {o.garment_type ?? "Order"}
                    </span>
                  </div>
                  <p className="font-sans text-xs font-medium text-[#8A94A6]">
                    Qty {o.quantity ?? "—"} ·{" "}
                    {new Date(o.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/portal/orders/${o.id}`}
                    className="rounded-lg border border-[#2A3347] px-4 py-2 font-sans text-sm font-semibold text-[#8A94A6] hover:border-[#3B7BF8] hover:text-[#3B7BF8]"
                  >
                    View
                  </Link>
                  {o.status !== "draft" ? <ReorderButton orderId={o.id} /> : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {saved.length > 0 && (
        <section>
          <h2 className="mb-4 font-sans text-lg font-semibold text-white">
            Saved configurations
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {saved.map((c) => (
              <li
                key={c.id}
                className="rounded-xl border border-[#2A3347] bg-[#1C2333] p-4"
              >
                <p className="font-sans text-sm font-semibold text-white">{c.name}</p>
                <p className="mt-1 font-sans text-xs font-medium text-[#8A94A6]">
                  {[c.garment_type, c.decoration_method].filter(Boolean).join(" · ")}
                </p>
                <div className="mt-3">
                  <NewOrderButton configId={c.id} variant="outline" className="px-3 py-2 text-xs">
                    Use this setup
                  </NewOrderButton>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-xl border border-[#2A3347] bg-[#1C2333] p-5">
        <h2 className="font-sans text-lg font-semibold text-white">Fan shop preview</h2>
        <p className="mt-1 font-sans text-sm text-[#8A94A6]">
          See how your logos look on default team gear — parents shop here when your store is live.
        </p>
        <Link
          href="/portal/fan-shop"
          className="mt-4 inline-flex rounded-lg border border-[#3B7BF8] px-4 py-2 font-sans text-sm font-semibold text-[#3B7BF8] hover:bg-[#0F1521]"
        >
          Open fan shop →
        </Link>
      </section>
    </div>
  );
}
