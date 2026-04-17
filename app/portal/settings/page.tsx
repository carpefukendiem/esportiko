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

  const needsTeamProfile =
    !String(account.sport ?? "").trim() ||
    !String(account.contact_name ?? "").trim();

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="font-sans text-2xl font-semibold text-white md:text-3xl">
          {needsTeamProfile ? "Set up your team" : "Account settings"}
        </h1>
        {needsTeamProfile && (
          <p className="mt-2 font-sans text-sm font-medium text-[#8A94A6]">
            Add your team and contact details so we can personalize orders and
            reach you when it matters.
          </p>
        )}
      </div>

      {needsTeamProfile && (
        <div
          className="rounded-xl border border-[#3B7BF8]/40 bg-[#1C2333] px-4 py-3 font-sans text-sm font-medium text-[#B8D4FF]"
          role="status"
        >
          Welcome — fill in your team details to get started
        </div>
      )}

      <SettingsForm account={account} onboarding={needsTeamProfile} />
    </div>
  );
}
