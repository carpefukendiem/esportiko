import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ensureAccount } from "@/lib/portal/ensureAccount";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "@/components/portal/OnboardingWizard";

export const metadata: Metadata = {
  title: "Set up your team",
};

export default async function PortalOnboardingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const account = await ensureAccount(
    supabase,
    user.id,
    user.email ?? undefined
  );
  if (!account) redirect("/login");

  if (account.onboarding_completed === true) {
    redirect("/portal/dashboard");
  }

  return <OnboardingWizard account={account} />;
}
