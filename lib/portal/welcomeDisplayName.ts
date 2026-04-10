import type { AccountRow } from "@/types/portal";

function normalizePlaceholderToken(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Matches ensureAccount: email local part with dots → spaces. */
function placeholderFromEmail(email: string | undefined): string | null {
  if (!email) return null;
  const local = email.split("@")[0];
  if (!local) return null;
  return normalizePlaceholderToken(local.replace(/\./g, " "));
}

export function teamNameLooksLikePlaceholder(
  teamName: string,
  userEmail: string | undefined
): boolean {
  const fromEmail = placeholderFromEmail(userEmail);
  if (!fromEmail) return false;
  return normalizePlaceholderToken(teamName) === fromEmail;
}

/**
 * Prefer a real identity over a seeded team_name when it equals the email username (with dot→space).
 */
export function welcomeDisplayName(
  account: AccountRow,
  userEmail: string | undefined
): string {
  const team = account.team_name?.trim() || "";
  if (
    team &&
    !teamNameLooksLikePlaceholder(account.team_name ?? "", userEmail)
  ) {
    return team;
  }
  if (account.contact_name?.trim()) return account.contact_name.trim();
  if (account.contact_email?.trim()) return account.contact_email.trim();
  if (userEmail?.trim()) return userEmail.trim();
  return team || "there";
}
