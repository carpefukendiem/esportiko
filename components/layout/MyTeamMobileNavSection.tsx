"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useTeamPortalAuth } from "@/components/layout/TeamPortalAuthContext";
import { MyTeamMenuContent } from "@/components/layout/MyTeamMenuContent";

export function MyTeamMobileNavSection({ onClose }: { onClose: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const { user, teamName } = useTeamPortalAuth();
  const initial = (teamName?.[0] ?? user?.email?.[0] ?? "?").toUpperCase();

  return (
    <li className="list-none">
      <button
        type="button"
        className={cn(
          "flex w-full items-center justify-between rounded-md px-3 py-3 text-left font-sans text-lg font-medium text-off-white transition-colors hover:bg-navy-light",
          expanded && "text-blue-light"
        )}
        aria-expanded={expanded}
        onClick={() => setExpanded((e) => !e)}
      >
        <span className="flex items-center gap-2">
          My Team
          {user ? (
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-accent text-xs font-bold text-white"
              aria-hidden
            >
              {initial}
            </span>
          ) : null}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 transition-transform duration-150",
            expanded && "rotate-180"
          )}
          aria-hidden
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-[max-height] duration-200 ease-out",
          expanded ? "max-h-[1600px]" : "max-h-0"
        )}
      >
        <div
          className={cn(
            "border-t border-slate py-4 pl-1 transition-opacity duration-150 ease-out",
            expanded ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          <div className="rounded-xl border border-[#2A3347] bg-[#1C2333] p-5 shadow-xl">
            <MyTeamMenuContent
              compact
              onNavigate={() => {
                onClose();
                setExpanded(false);
              }}
            />
          </div>
        </div>
      </div>
    </li>
  );
}
