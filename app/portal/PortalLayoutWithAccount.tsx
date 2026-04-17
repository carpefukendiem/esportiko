import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { ensureAccount } from "@/lib/portal/ensureAccount";
import { PortalShell } from "@/components/portal/PortalShell";
import { PortalAccountHeader } from "@/components/portal/PortalAccountHeader";
import { PortalAccountSetupFailed } from "@/components/portal/PortalAccountSetupFailed";

export async function PortalLayoutWithAccount({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const account = await ensureAccount(
    supabase,
    user.id,
    user.email ?? undefined,
    user
  );

  if (!account) {
    return <PortalAccountSetupFailed />;
  }

  const headerList = await headers();
  const pathname = headerList.get("x-es-pathname") ?? "";
  const onSettings =
    pathname === "/portal/settings" ||
    pathname.startsWith("/portal/settings/");

  const needsTeamProfile =
    !String(account.sport ?? "").trim() ||
    !String(account.contact_name ?? "").trim();

  if (needsTeamProfile && !onSettings) {
    redirect("/portal/settings?onboarding=true");
  }

  return (
    <PortalShell
      headerSlot={
        <PortalAccountHeader account={account} email={user.email ?? undefined} />
      }
    >
      {children}
    </PortalShell>
  );
}
