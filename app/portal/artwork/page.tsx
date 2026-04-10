import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureAccount } from "@/lib/portal/ensureAccount";
import { PortalAccountSetupFailed } from "@/components/portal/PortalAccountSetupFailed";
import { ArtworkManager } from "@/components/portal/ArtworkManager";
import type { ArtworkAssetRow } from "@/types/portal";

export default async function ArtworkPage() {
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

  const { data: rows } = await supabase
    .from("artwork_assets")
    .select("*")
    .eq("account_id", account.id)
    .order("created_at", { ascending: false });

  const assets = (rows ?? []) as ArtworkAssetRow[];

  const withUrls = await Promise.all(
    assets.map(async (a) => {
      const { data: signed } = await supabase.storage
        .from("artwork")
        .createSignedUrl(a.storage_path, 3600);
      return { ...a, signedUrl: signed?.signedUrl ?? null };
    })
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="font-sans text-2xl font-semibold text-white md:text-3xl">
        Artwork library
      </h1>
      <p className="font-sans text-sm font-medium text-[#8A94A6]">
        Uploads are private to your team. Links expire after one hour.
      </p>
      <ArtworkManager accountId={account.id} initialAssets={withUrls} />
    </div>
  );
}
