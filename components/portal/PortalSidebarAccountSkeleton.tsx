/** Pulse placeholders for the sidebar team header while account loads. */
export function PortalSidebarAccountSkeleton() {
  return (
    <div className="flex w-full items-center gap-3">
      <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-[#2A3347]" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-4 w-28 animate-pulse rounded bg-[#2A3347]" />
        <div className="h-3 w-40 animate-pulse rounded bg-[#2A3347]" />
      </div>
    </div>
  );
}
