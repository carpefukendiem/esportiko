"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureAccount } from "@/lib/portal/ensureAccount";
import { onboardingWizardSchema } from "@/lib/schemas/onboardingWizardSchema";

export async function completeOnboarding(
  payload: unknown
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = onboardingWizardSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." };
  }

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
    return { ok: false, error: "Could not load your account." };
  }

  if (account.onboarding_completed === true) {
    return { ok: false, error: "You've already finished setup." };
  }

  const v = parsed.data;
  const { error } = await supabase
    .from("accounts")
    .update({
      team_name: v.team_name.trim(),
      contact_name: v.contact_name.trim(),
      sport: v.sport,
      league_or_school: v.league_or_school?.trim() || null,
      contact_phone: v.contact_phone?.trim() || null,
      heard_about_us: v.heard_about_us,
      likely_order_types: v.likely_order_types,
      onboarding_notes: v.onboarding_notes?.trim() || null,
      onboarding_completed: true,
    })
    .eq("id", account.id);

  if (error) {
    console.error("completeOnboarding", error);
    return { ok: false, error: "Could not save. Please try again." };
  }

  revalidatePath("/portal", "layout");
  revalidatePath("/portal/dashboard");
  revalidatePath("/portal/onboarding");
  return { ok: true };
}
