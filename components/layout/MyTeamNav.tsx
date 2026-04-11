"use client";

import { useEffect, useRef, useState, type FocusEvent } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useTeamPortalAuth } from "@/components/layout/TeamPortalAuthContext";
import { MyTeamMenuContent } from "@/components/layout/MyTeamMenuContent";

export function MyTeamNav() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user, teamName } = useTeamPortalAuth();

  const initial = (teamName?.[0] ?? user?.email?.[0] ?? "?").toUpperCase();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [open]);

  const onBlurCapture = (e: FocusEvent<HTMLDivElement>) => {
    if (!open) return;
    const next = e.relatedTarget as Node | null;
    if (!next || !containerRef.current?.contains(next)) {
      setOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlurCapture={onBlurCapture}
    >
      <button
        type="button"
        className={cn(
          "flex items-center gap-2 rounded-md px-1 py-2 font-sans text-body font-medium text-off-white transition-colors hover:text-blue-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-accent focus-visible:ring-offset-2 focus-visible:ring-offset-navy",
          open && "text-blue-light"
        )}
        aria-expanded={open}
        aria-controls="my-team-menu-panel"
        aria-haspopup="true"
        id="my-team-menu-trigger"
        onClick={() => setOpen((o) => !o)}
      >
        <span>My Team</span>
        {user ? (
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-accent text-xs font-bold text-white"
            aria-hidden
          >
            {initial}
          </span>
        ) : null}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 opacity-70 transition-transform duration-150",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      <div
        className={cn(
          "absolute right-0 top-full z-50 pt-2 transition-opacity duration-150 ease-out",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
        id="my-team-menu-panel"
        role="region"
        aria-labelledby="my-team-menu-trigger"
        aria-hidden={!open}
      >
        <div className="w-[min(calc(100vw-2rem),640px)] rounded-xl border border-[#2A3347] bg-[#1C2333] p-6 shadow-xl">
          <MyTeamMenuContent onNavigate={() => setOpen(false)} />
        </div>
      </div>
    </div>
  );
}
