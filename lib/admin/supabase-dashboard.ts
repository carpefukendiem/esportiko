/** Best-effort Supabase Cloud dashboard URL from the project API URL. */
export function supabaseDashboardProjectUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    const host = new URL(url).hostname;
    const ref = host.split(".")[0];
    if (!ref) return null;
    return `https://supabase.com/dashboard/project/${ref}`;
  } catch {
    return null;
  }
}
