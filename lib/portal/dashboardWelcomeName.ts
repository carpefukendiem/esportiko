import type { AccountRow } from "@/types/portal";

function emailLocalPart(email: string | undefined): string {
  if (!email || !email.includes("@")) return "";
  return email.split("@")[0]!.trim();
}

/**
 * Default `team_name` from signup uses the email local part with dots → spaces
 * (see `ensureAccount`). Treat that as a placeholder so we greet the person
 * by name or email instead.
 */
export function isPlaceholderTeamName(
  teamName: string,
  email: string | undefined
): boolean {
  const local = emailLocalPart(email);
  if (!local || !teamName.trim()) return false;
  const normalizedTeam = teamName.trim().toLowerCase().replace(/\s+/g, " ");
  const localAsSpaces = local
    .toLowerCase()
    .replace(/\./g, " ")
    .replace(/\s+/g, " ");
  const localRaw = local.toLowerCase();
  return normalizedTeam === localAsSpaces || normalizedTeam === localRaw;
}

/** Greeting line for "Welcome back, …" on the dashboard. */
export function dashboardWelcomeDisplayName(
  account: AccountRow,
  email: string | undefined
): string {
  if (!isPlaceholderTeamName(account.team_name, email)) {
    return account.team_name;
  }
  const contact = account.contact_name?.trim();
  if (contact) return contact;
  return email?.trim() || account.team_name;
}
