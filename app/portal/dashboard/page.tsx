import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureAccount } from "@/lib/portal/ensureAccount";
import { dashboardWelcomeDisplayName } from "@/lib/portal/dashboardWelcomeName";
import { PortalAccountSetupFailed } from "@/components/portal/PortalAccountSetupFailed";
import { OrderStatusBadge } from "@/components/portal/OrderStatusBadge";
import type { OrderRow, OrderStatus, SavedConfigurationRow } from "@/types/portal";

export default async function PortalDashboardPage() {
  const supabase = await createClient();
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

  const [{ data: orders }, { data: configs }] = await Promise.all([
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
  ]);

  const list = (orders ?? []) as OrderRow[];
  const saved = (configs ?? []) as SavedConfigurationRow[];

  const welcomeName = dashboardWelcomeDisplayName(
    account,
    user.email ?? undefined
  );

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-sans text-2xl font-semibold text-white md:text-3xl">
            Welcome back, {welcomeName}
          </h1>
          <p className="mt-1 font-sans text-sm font-medium text-[#8A94A6]">
            Manage orders, rosters, and artwork in one place.
          </p>
        </div>
        <Link
          href="/portal/new-order"
          className="inline-flex items-center justify-center rounded-lg bg-[#3B7BF8] px-6 py-3 font-sans text-sm font-semibold text-white hover:opacity-90"
        >
          Start new order
        </Link>
      </header>

      <section>
        <h2 className="mb-4 font-sans text-lg font-semibold text-white">
          Recent orders
        </h2>
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
            <Link
              href="/portal/new-order"
              className="mt-6 inline-flex rounded-lg border border-[#3B7BF8] px-5 py-2.5 font-sans text-sm font-semibold text-[#3B7BF8] hover:bg-[#1C2333]"
            >
              Start your first order
            </Link>
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
                  <Link
                    href={`/portal/orders/${o.id}`}
                    className="rounded-lg bg-[#3B7BF8] px-4 py-2 font-sans text-sm font-semibold text-white hover:opacity-90"
                  >
                    Reorder
                  </Link>
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
                <p className="font-sans text-sm font-semibold text-white">
                  {c.name}
                </p>
                <p className="mt-1 font-sans text-xs font-medium text-[#8A94A6]">
                  {[c.garment_type, c.decoration_method]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <Link
                  href={`/portal/new-order?config=${c.id}`}
                  className="mt-3 inline-flex rounded-lg border border-[#3B7BF8] px-3 py-2 font-sans text-xs font-semibold text-[#3B7BF8] hover:bg-[#0F1521]"
                >
                  Use this setup
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
