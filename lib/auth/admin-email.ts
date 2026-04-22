/**
 * Server / Edge allowlist for `/admin` and onboarding bypass.
 * Merges `ADMIN_EMAILS` and `NEXT_PUBLIC_ADMIN_EMAILS` so a deploy that only
 * sets the public list (or only the private one) still matches login/callback
 * behavior and does not send real admins through portal team setup.
 */
export function parseAdminEmails(): string[] {
  // Bracket access so Next is less likely to bake in empty values at build time.
  const raw = process.env["ADMIN_EMAILS"] ?? "";
  const pub = process.env["NEXT_PUBLIC_ADMIN_EMAILS"] ?? "";
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of [...raw.split(","), ...pub.split(",")]) {
    const norm = part.trim().toLowerCase();
    if (!norm || seen.has(norm)) continue;
    seen.add(norm);
    out.push(norm);
  }
  return out;
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const norm = email.trim().toLowerCase();
  return parseAdminEmails().includes(norm);
}
