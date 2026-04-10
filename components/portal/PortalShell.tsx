"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AccountRow } from "@/types/portal";
import { cn } from "@/lib/utils/cn";

const nav = [
  { href: "/portal/dashboard", label: "Dashboard", icon: IconHome },
  { href: "/portal/orders", label: "My Orders", icon: IconOrders },
  { href: "/portal/new-order", label: "New Order", icon: IconPlus },
  { href: "/portal/roster", label: "Roster", icon: IconUsers },
  { href: "/portal/artwork", label: "Artwork", icon: IconImage },
  { href: "/portal/settings", label: "Account Settings", icon: IconGear },
] as const;

export function PortalShell({
  account,
  email,
  children,
}: {
  account: AccountRow;
  email: string | undefined;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const initial = (account.team_name?.[0] ?? email?.[0] ?? "?").toUpperCase();

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-[#0F1521] text-white">
      <aside
        className={cn(
          "hidden shrink-0 flex-col border-r border-[#2A3347] md:flex",
          collapsed ? "w-20" : "w-56 lg:w-64"
        )}
      >
        <div className="flex items-center gap-3 border-b border-[#2A3347] p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#2A3347] bg-[#1C2333] font-sans text-sm font-semibold text-[#3B7BF8]">
            {initial}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate font-sans text-sm font-semibold text-white">
                {account.team_name}
              </p>
              <p className="truncate font-sans text-xs font-medium text-[#8A94A6]">
                {email}
              </p>
            </div>
          )}
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-2">
          {nav.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/portal/dashboard"
                ? pathname === href
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-sm font-medium transition-colors",
                  active
                    ? "bg-[#2A3347] text-[#3B7BF8]"
                    : "text-[#8A94A6] hover:bg-[#1C2333] hover:text-white"
                )}
                title={collapsed ? label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#2A3347] p-2">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="mb-2 hidden w-full rounded-lg border border-[#2A3347] px-3 py-2 font-sans text-xs font-medium text-[#8A94A6] hover:bg-[#1C2333] md:block"
          >
            {collapsed ? "Expand" : "Collapse"}
          </button>
          <button
            type="button"
            onClick={() => void signOut()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-sm font-medium text-red-400 hover:bg-[#1C2333]"
          >
            <IconOut className="h-5 w-5 shrink-0" />
            {!collapsed && "Sign out"}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col pb-20 md:pb-0">
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-[#2A3347] bg-[#0F1521] px-1 py-2 md:hidden">
        {nav.slice(0, 5).map(({ href, label, icon: Icon }) => {
          const active =
            href === "/portal/dashboard"
              ? pathname === href
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-lg py-1 font-sans text-[10px] font-medium",
                active ? "text-[#3B7BF8]" : "text-[#8A94A6]"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="truncate">{label.split(" ")[0]}</span>
            </Link>
          );
        })}
        <Link
          href="/portal/settings"
          className={cn(
            "flex flex-1 flex-col items-center gap-1 rounded-lg py-1 font-sans text-[10px] font-medium",
            pathname.startsWith("/portal/settings")
              ? "text-[#3B7BF8]"
              : "text-[#8A94A6]"
          )}
        >
          <IconGear className="h-5 w-5" />
          <span>More</span>
        </Link>
      </nav>
    </div>
  );
}

function IconHome({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
    </svg>
  );
}
function IconOrders({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 5H5v4M15 5h4v4M9 19H5v-4M15 19h4v-4" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
    </svg>
  );
}
function IconPlus({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function IconUsers({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function IconImage({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8" cy="10" r="1.5" />
      <path d="m21 15-5-5L5 19" />
    </svg>
  );
}
function IconGear({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9c.26.6.84 1 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z" />
    </svg>
  );
}
function IconOut({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}
