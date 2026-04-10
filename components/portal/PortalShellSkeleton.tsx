/**
 * Matches portal shell: dark Esportiko chrome while account/session loads.
 */
export function PortalShellSkeleton() {
  return (
    <div className="flex min-h-screen animate-pulse bg-[#0F1521] text-white">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-[#2A3347] md:flex lg:w-64">
        <div className="flex items-center gap-3 border-b border-[#2A3347] p-4">
          <div className="h-10 w-10 shrink-0 rounded-lg border border-[#2A3347] bg-[#1C2333]" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-28 rounded bg-[#2A3347]" />
            <div className="h-3 w-36 rounded bg-[#2A3347]" />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-10 rounded-lg bg-[#1C2333] ring-1 ring-[#2A3347]"
            />
          ))}
        </div>
        <div className="border-t border-[#2A3347] p-2">
          <div className="mb-2 hidden h-9 rounded-lg bg-[#1C2333] md:block" />
          <div className="h-10 rounded-lg bg-[#1C2333]" />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col pb-20 md:pb-0">
        <main className="flex-1 space-y-6 p-4 md:p-8">
          <div className="mx-auto max-w-4xl space-y-4">
            <div className="h-9 w-64 max-w-full rounded-lg bg-[#2A3347]" />
            <div className="h-4 w-96 max-w-full rounded bg-[#2A3347]" />
            <div className="h-32 rounded-xl border border-[#2A3347] bg-[#1C2333]" />
            <div className="h-40 rounded-xl border border-[#2A3347] bg-[#1C2333]" />
          </div>
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-[#2A3347] bg-[#0F1521] px-1 py-2 md:hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="mx-0.5 h-12 flex-1 rounded-lg bg-[#1C2333]" />
        ))}
      </nav>
    </div>
  );
}
