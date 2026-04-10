import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureAccount } from "@/lib/portal/ensureAccount";
import { PortalShell } from "@/components/portal/PortalShell";
import { PortalAccountSetupFailed } from "@/components/portal/PortalAccountSetupFailed";

export const metadata: Metadata = {
  title: {
    template: "%s | Team portal | Esportiko",
    default: "Team portal",
  },
  robots: { index: false, follow: false },
};

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = headers().get("x-es-pathname") ?? "";
  const onOnboardingRoute =
    pathname === "/portal/onboarding" ||
    pathname.startsWith("/portal/onboarding/");

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
    user.email ?? undefined
  );

  if (!account) {
    return <PortalAccountSetupFailed />;
  }

  const onboardingDone = account.onboarding_completed === true;

  if (onOnboardingRoute && onboardingDone) {
    redirect("/portal/dashboard");
  }

  if (!onOnboardingRoute && !onboardingDone) {
    redirect("/portal/onboarding");
  }

  if (onOnboardingRoute) {
    return <>{children}</>;
  }

  return (
    <PortalShell account={account} email={user.email ?? undefined}>
      {children}
    </PortalShell>
  );
}
