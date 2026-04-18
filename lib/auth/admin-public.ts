/** Client-safe allowlist (must stay in sync with `ADMIN_EMAILS` on the server). */
export function parsePublicAdminEmails(): string[] {
  const raw = process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isPublicAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const norm = email.trim().toLowerCase();
  return parsePublicAdminEmails().includes(norm);
}
