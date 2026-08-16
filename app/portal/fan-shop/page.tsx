import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getFanShopForOwner, getFanShopSkusForShop } from "@/lib/fan-shop/queries";
import type { FanShopStatus } from "@/lib/fan-shop/types";

export const metadata = {
  title: "Fan Shop",
};

function statusLabel(status: FanShopStatus) {
  return status.replaceAll("_", " ");
}

function fmtPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default async function PortalFanShopPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const shop = await getFanShopForOwner(user.id);
  const skus = shop ? await getFanShopSkusForShop(shop.id) : [];

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
          Fan Shop
        </h1>
        <p className="mt-1 font-sans text-sm text-[#8A94A6]">
          Team storefront for parents and fans. Public checkout is coming soon — this page shows
          your shop setup from Supabase.
        </p>
      </div>

      {!shop ? (
        <section className="rounded-xl border border-[#2A3347] bg-[#1C2333] p-6 md:p-8">
          <h2 className="font-display text-lg font-semibold text-white">No fan shop yet</h2>
          <p className="mt-2 font-sans text-sm text-[#8A94A6]">
            When your team shop is created, you&apos;ll see status, products, and a share link here.
            Contact Esportiko to launch your fan shop.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-lg bg-[#3B7BF8] px-4 py-2.5 font-sans text-sm font-semibold text-white hover:bg-[#2f6ae0]"
          >
            Contact us
          </Link>
        </section>
      ) : (
        <>
          <section className="rounded-xl border border-[#1C2333] bg-[#0F1521] p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-[#8A94A6]">
                  {shop.team_name}
                </p>
                <h2 className="mt-1 font-display text-xl font-bold text-white">{shop.name}</h2>
                {shop.description ? (
                  <p className="mt-2 font-sans text-sm text-[#8A94A6]">{shop.description}</p>
                ) : null}
              </div>
              <span className="rounded-full border border-[#2A3347] bg-[#1C2333] px-3 py-1 font-sans text-xs font-semibold uppercase tracking-wide text-[#8A94A6]">
                {statusLabel(shop.status)}
              </span>
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="font-sans text-xs font-medium text-[#8A94A6]">Store URL slug</dt>
                <dd className="mt-1 font-mono text-sm text-white">/shop/{shop.slug}</dd>
              </div>
              <div>
                <dt className="font-sans text-xs font-medium text-[#8A94A6]">Contact email</dt>
                <dd className="mt-1 font-sans text-sm text-white">{shop.contact_email}</dd>
              </div>
            </dl>

            {shop.status === "active" ? (
              <p className="mt-6 font-sans text-sm text-[#8A94A6]">
                Public storefront preview will live at{" "}
                <span className="font-mono text-white">/shop/{shop.slug}</span> in a future release.
              </p>
            ) : null}
          </section>

          <section className="rounded-xl border border-[#1C2333] bg-[#0F1521] p-6">
            <h3 className="font-display text-lg font-semibold text-white">Products</h3>
            {skus.length === 0 ? (
              <p className="mt-3 font-sans text-sm text-[#8A94A6]">No active SKUs configured yet.</p>
            ) : (
              <ul className="mt-4 divide-y divide-[#1C2333]">
                {skus.map((sku) => (
                  <li
                    key={sku.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <span className="font-mono text-sm text-white">{sku.style_number}</span>
                    <span className="font-sans text-sm font-medium text-[#3B7BF8]">
                      {fmtPrice(sku.retail_price_cents)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
