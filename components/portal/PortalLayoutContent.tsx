import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureAccount } from "@/lib/portal/ensureAccount";
import { PortalShell } from "@/components/portal/PortalShell";
import { PortalAccountSetupFailed } from "@/components/portal/PortalAccountSetupFailed";

export async function PortalLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const account = await ensureAccount(
    supabase,
    user.id,
    user.email ?? undefined,
    user
  );

  if (!account) {
    return <PortalAccountSetupFailed />;
  }

  return (
    <PortalShell account={account} email={user.email ?? undefined}>
      {children}
    </PortalShell>
  );
}
