import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureAccount } from "@/lib/portal/ensureAccount";
import { PortalAccountSetupFailed } from "@/components/portal/PortalAccountSetupFailed";
import { SettingsForm } from "@/components/portal/SettingsForm";

export default async function PortalSettingsPage() {
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

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="font-sans text-2xl font-semibold text-white md:text-3xl">
        Account settings
      </h1>
      <SettingsForm account={account} />
    </div>
  );
}
