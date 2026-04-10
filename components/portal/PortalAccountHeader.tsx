"use client";

import { usePortalShellCollapsed } from "@/components/portal/PortalShellContext";
import type { AccountRow } from "@/types/portal";

export function PortalAccountHeader({
  account,
  email,
}: {
  account: AccountRow;
  email: string | undefined;
}) {
  const collapsed = usePortalShellCollapsed();
  const initial = (account.team_name?.[0] ?? email?.[0] ?? "?").toUpperCase();

  return (
    <>
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
    </>
  );
}
