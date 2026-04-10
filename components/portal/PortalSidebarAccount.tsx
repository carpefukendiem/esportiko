import { redirect } from "next/navigation";
import { loadPortalAccount } from "@/lib/portal/loadPortalAccount";
import { PortalAccountHeader } from "@/components/portal/PortalAccountHeader";

export async function PortalSidebarAccount({
  userId,
  userEmail,
}: {
  userId: string;
  userEmail: string | undefined;
}) {
  const account = await loadPortalAccount(userId, userEmail);
  if (!account) {
    redirect("/login");
  }
  return <PortalAccountHeader account={account} email={userEmail} />;
}
