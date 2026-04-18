import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { AdminSignOutButton } from "./AdminSignOutButton";

export const metadata: Metadata = {
  title: "Admin | Esportiko",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-[#0A0F1A] text-white">
      <header className="sticky top-0 z-30 border-b border-[#1C2333] bg-[#0A0F1A]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 md:px-8">
          <Link href="/admin" className="font-display text-lg font-bold tracking-tight text-white">
            Esportiko <span className="text-[#8A94A6]">Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden truncate font-sans text-sm text-[#8A94A6] sm:inline max-w-[240px] md:max-w-md">
              {user.email}
            </span>
            <AdminSignOutButton />
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-[1600px] px-4 py-8 md:px-8">{children}</div>
    </div>
  );
}
