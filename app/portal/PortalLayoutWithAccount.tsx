import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth/admin-email";
import { ensureAccount } from "@/lib/portal/ensureAccount";
import { PortalShell } from "@/components/portal/PortalShell";
import { PortalAccountHeader } from "@/components/portal/PortalAccountHeader";
import { PortalAccountSetupFailed } from "@/components/portal/PortalAccountSetupFailed";
import { PortalTeamProfileGate } from "@/components/portal/PortalTeamProfileGate";

export async function PortalLayoutWithAccount({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const account = await ensureAccount(
    supabase,
    user.id,
    user.email ?? undefined,
    user
  );

  if (!account) {
    return <PortalAccountSetupFailed />;
  }

  const needsTeamProfile =
    !String(account.sport ?? "").trim() ||
    !String(account.contact_name ?? "").trim();

  const isAdmin = Boolean(user.email && isAdminEmail(user.email));

  return (
    <PortalShell
      headerSlot={
        <PortalAccountHeader account={account} email={user.email ?? undefined} />
      }
    >
      <PortalTeamProfileGate needsTeamProfile={needsTeamProfile} isAdmin={isAdmin}>
        {children}
      </PortalTeamProfileGate>
    </PortalShell>
  );
}
