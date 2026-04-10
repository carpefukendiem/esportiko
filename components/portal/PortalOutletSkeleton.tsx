/** Generic main-column skeleton for portal routes without a local loading.tsx. */
export function PortalOutletSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-4 md:p-8">
      <div className="h-9 w-64 animate-pulse rounded-lg bg-[#2A3347]" />
      <div className="h-4 w-full max-w-md animate-pulse rounded bg-[#2A3347]" />
      <div className="space-y-3">
        <div className="h-5 w-40 animate-pulse rounded bg-[#2A3347]" />
        <div className="h-24 animate-pulse rounded-xl border border-[#2A3347] bg-[#1C2333]" />
        <div className="h-24 animate-pulse rounded-xl border border-[#2A3347] bg-[#1C2333]" />
      </div>
    </div>
  );
}
