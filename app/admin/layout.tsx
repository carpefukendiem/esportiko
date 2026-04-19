import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminSignOutButton } from "./AdminSignOutButton";

export const metadata: Metadata = {
  title: "Admin | Esportiko",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();

  return (
    <div className="min-h-screen bg-[#0F1521]">
      <header className="border-b border-[#2A3347] bg-[#1C2333]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex flex-wrap items-center gap-8">
            <h1 className="font-sans text-lg font-semibold text-white">Esportiko Admin</h1>
            <AdminNav />
          </div>
          <div className="flex items-center gap-4">
            <span className="truncate font-sans text-sm text-[#8A94A6] max-w-[280px]" title={user.email ?? undefined}>
              {user.email}
            </span>
            <AdminSignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
