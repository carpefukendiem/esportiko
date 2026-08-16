import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureAccount } from "@/lib/portal/ensureAccount";
import { getFanShopPreviewBundle } from "@/lib/fan-shop/preview-data";
import { FanShopPreviewGrid } from "@/components/fan-shop/FanShopPreviewGrid";
import { ArtworkUploader } from "@/components/portal/ArtworkUploader";

export const metadata = {
  title: "Fan Shop",
};

export default async function PortalFanShopPage() {
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
  if (!account) redirect("/login");

  const preview = await getFanShopPreviewBundle({
    userId: user.id,
    accountId: account.id,
    teamName: account.team_name,
  });

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="font-sans text-2xl font-semibold text-white md:text-3xl">Fan Shop</h1>
        <p className="mt-1 font-sans text-sm text-[#8A94A6]">
          Default team gear with your logo applied — like competitor fan shops. Checkout launches
          soon; upload logos below to refresh previews.
        </p>
      </div>

      <section className="rounded-xl border border-[#2A3347] bg-[#1C2333] p-5 md:p-6">
        <h2 className="font-sans text-lg font-semibold text-white">Upload team logos</h2>
        <p className="mt-1 font-sans text-sm text-[#8A94A6]">
          Add PNG, JPG, or SVG files — previews update automatically across all products.
        </p>
        <div className="mt-4">
          <ArtworkUploader accountId={account.id} />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-wider text-[#8A94A6]">
              {preview.teamName}
            </p>
            <h2 className="font-sans text-xl font-semibold text-white">
              {preview.shopName ?? `${preview.teamName} Fan Shop`}
            </h2>
          </div>
          {preview.logoUrl ? (
            <p className="font-sans text-xs text-[#8A94A6]">
              Public URL (coming soon):{" "}
              <span className="font-mono text-white">/shop/your-team</span>
            </p>
          ) : (
            <Link
              href="/portal/artwork"
              className="font-sans text-sm font-semibold text-[#3B7BF8] hover:underline"
            >
              Upload a logo to preview →
            </Link>
          )}
        </div>

        <FanShopPreviewGrid
          items={preview.items}
          initialLogoUrl={preview.logoUrl}
          logoOptions={preview.logoOptions}
        />
      </section>

      <section className="rounded-xl border border-[#2A3347] bg-[#1C2333] p-5 text-sm text-[#8A94A6]">
        <p>
          Need a custom store URL, pricing, or launch date?{" "}
          <Link href="/contact" className="font-semibold text-[#3B7BF8] hover:underline">
            Contact Esportiko
          </Link>{" "}
          and we&apos;ll activate your live fan shop.
        </p>
      </section>
    </div>
  );
}
