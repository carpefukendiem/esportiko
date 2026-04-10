import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { AccountRow } from "@/types/portal";

function defaultTeamName(email: string | undefined, authUser: User | null): string {
  const meta = authUser?.user_metadata as Record<string, unknown> | undefined;
  const fromSignup =
    typeof meta?.team_name === "string" ? meta.team_name.trim() : "";
  if (fromSignup) return fromSignup;
  const fullName =
    typeof meta?.full_name === "string"
      ? meta.full_name.trim()
      : typeof meta?.name === "string"
        ? meta.name.trim()
        : typeof meta?.display_name === "string"
          ? meta.display_name.trim()
          : "";
  if (fullName) return fullName;
  return email?.split("@")[0]?.replace(/\./g, " ") ?? "My team";
}

async function fetchOwnAccount(
  supabase: SupabaseClient,
  userId: string
): Promise<AccountRow | null> {
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("ensureAccount select", error);
    return null;
  }
  return (data as AccountRow) ?? null;
}

function isUniqueUserIdViolation(error: { code?: string; message?: string }): boolean {
  return (
    error.code === "23505" ||
    (typeof error.message === "string" &&
      error.message.toLowerCase().includes("duplicate") &&
      error.message.toLowerCase().includes("user_id"))
  );
}

/**
 * Ensures the authenticated user has an `accounts` row (first portal visit).
 * Retries select after insert errors to handle concurrent first requests.
 */
export async function ensureAccount(
  supabase: SupabaseClient,
  userId: string,
  email: string | undefined,
  authUser: User | null = null
): Promise<AccountRow | null> {
  const existing = await fetchOwnAccount(supabase, userId);
  if (existing) {
    return existing;
  }

  const teamName = defaultTeamName(email, authUser);

  const { data: created, error: insErr } = await supabase
    .from("accounts")
    .insert({
      user_id: userId,
      team_name: teamName,
      contact_email: email ?? null,
    })
    .select("*")
    .single();

  if (!insErr && created) {
    return created as AccountRow;
  }

  if (insErr) {
    console.error("ensureAccount insert", insErr);
    if (isUniqueUserIdViolation(insErr)) {
      const afterRace = await fetchOwnAccount(supabase, userId);
      if (afterRace) return afterRace;
    }
  }

  const retry = await fetchOwnAccount(supabase, userId);
  return retry;
}
