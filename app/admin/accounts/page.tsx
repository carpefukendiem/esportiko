import { requireAdmin } from "@/lib/auth/admin";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { AdminAccountsTable } from "@/components/admin/AdminAccountsTable";

export const dynamic = "force-dynamic";

export default async function AdminAccountsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  await requireAdmin();
  const raw = searchParams.search;
  const search = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : undefined;

  const admin = getSupabaseAdmin();

  let query = admin
    .from("accounts")
    .select("id, team_name, sport, contact_email, contact_phone, created_at")
    .order("created_at", { ascending: false });

  if (search?.trim()) {
    const q = `%${search.trim()}%`;
    query = query.or(`team_name.ilike.${q},contact_email.ilike.${q}`);
  }

  const { data: accounts, error } = await query;

  if (error) {
    console.error("AdminAccountsPage", error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-2xl font-semibold text-white">Accounts</h1>
        <p className="mt-1 font-sans text-sm text-[#8A94A6]">All team portal accounts</p>
      </div>

      <form method="get" className="max-w-md">
        <input
          type="search"
          name="search"
          placeholder="Search by team name or email..."
          defaultValue={search ?? ""}
          className="w-full rounded-lg border border-[#2A3347] bg-[#1C2333] px-4 py-2 font-sans text-sm text-white placeholder:text-[#8A94A6] focus:border-[#3B7BF8] focus:outline-none focus:ring-1 focus:ring-[#3B7BF8]"
        />
      </form>

      <AdminAccountsTable accounts={accounts ?? []} />
    </div>
  );
}
