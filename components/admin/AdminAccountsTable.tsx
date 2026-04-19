import Link from "next/link";

type AccountSummary = {
  id: string;
  team_name: string;
  sport: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  created_at: string;
};

export function AdminAccountsTable({ accounts }: { accounts: AccountSummary[] }) {
  if (accounts.length === 0) {
    return (
      <div className="rounded-xl border border-[#2A3347] bg-[#1C2333] px-6 py-14 text-center">
        <p className="font-sans text-sm text-[#8A94A6]">No accounts found</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#2A3347] bg-[#1C2333]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2A3347]">
              <th className="px-6 py-3 text-left font-sans text-xs font-medium uppercase text-[#8A94A6]">Team</th>
              <th className="px-6 py-3 text-left font-sans text-xs font-medium uppercase text-[#8A94A6]">Sport</th>
              <th className="px-6 py-3 text-left font-sans text-xs font-medium uppercase text-[#8A94A6]">Contact</th>
              <th className="px-6 py-3 text-left font-sans text-xs font-medium uppercase text-[#8A94A6]">Created</th>
              <th className="px-6 py-3 text-right font-sans text-xs font-medium uppercase text-[#8A94A6]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id} className="border-b border-[#2A3347] last:border-0">
                <td className="px-6 py-4 font-sans text-sm font-medium text-white">{account.team_name}</td>
                <td className="px-6 py-4 font-sans text-sm text-[#8A94A6]">{account.sport ?? "—"}</td>
                <td className="px-6 py-4">
                  <div className="font-sans text-sm">
                    {account.contact_email && (
                      <a href={`mailto:${account.contact_email}`} className="text-[#3B7BF8] hover:underline">
                        {account.contact_email}
                      </a>
                    )}
                    {!account.contact_email && <span className="text-[#8A94A6]">—</span>}
                    {account.contact_phone && (
                      <p className="text-[#8A94A6]">{account.contact_phone}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 font-sans text-sm text-[#8A94A6]">
                  {new Date(account.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/accounts/${account.id}`}
                    className="font-sans text-sm font-medium text-[#3B7BF8] hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
