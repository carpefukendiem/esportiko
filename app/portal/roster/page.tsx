import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureAccount } from "@/lib/portal/ensureAccount";
import { PortalAccountSetupFailed } from "@/components/portal/PortalAccountSetupFailed";
import { RosterManager } from "@/components/portal/RosterManager";
import type { DefaultRosterJson } from "@/types/portal";

export default async function RosterPage() {
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

  const roster = (Array.isArray(account.default_roster)
    ? account.default_roster
    : []) as DefaultRosterJson;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-sans text-2xl font-semibold text-white md:text-3xl">
        Saved roster
      </h1>
      <p className="font-sans text-sm font-medium text-[#8A94A6]">
        Maintain a default roster to pre-fill new orders when enabled.
      </p>
      <RosterManager account={account} initialRoster={roster} />
    </div>
  );
}
