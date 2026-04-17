import { cn } from "@/lib/utils/cn";

/** Full-portal loading shell — matches Esportiko portal dark layout (sidebar + main + mobile bar). */
export function PortalShellSkeleton() {
  return (
    <div className="flex min-h-screen bg-[#0F1521] text-white">
      <aside
        className={cn(
          "hidden shrink-0 flex-col border-r border-[#2A3347] md:flex",
          "w-56 lg:w-64"
        )}
      >
        <div className="flex items-center gap-3 border-b border-[#2A3347] p-4">
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-[#2A3347]" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-28 animate-pulse rounded bg-[#2A3347]" />
            <div className="h-3 w-36 animate-pulse rounded bg-[#2A3347]" />
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5"
            >
              <div className="h-5 w-5 shrink-0 animate-pulse rounded bg-[#2A3347]" />
              <div className="h-4 flex-1 animate-pulse rounded bg-[#2A3347]" />
            </div>
          ))}
        </nav>
        <div className="border-t border-[#2A3347] p-2 space-y-2">
          <div className="hidden h-9 w-full animate-pulse rounded-lg bg-[#2A3347] md:block" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-[#2A3347]" />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col pb-20 md:pb-0">
        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="h-9 w-64 animate-pulse rounded-lg bg-[#2A3347]" />
            <div className="h-4 w-full max-w-md animate-pulse rounded bg-[#2A3347]" />
            <div className="space-y-3">
              <div className="h-5 w-40 animate-pulse rounded bg-[#2A3347]" />
              <div className="h-24 animate-pulse rounded-xl border border-[#2A3347] bg-[#1C2333]" />
              <div className="h-24 animate-pulse rounded-xl border border-[#2A3347] bg-[#1C2333]" />
            </div>
          </div>
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-[#2A3347] bg-[#0F1521] px-1 py-2 md:hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-1 flex-col items-center gap-1 py-1"
          >
            <div className="h-5 w-5 animate-pulse rounded bg-[#2A3347]" />
            <div className="h-2 w-8 animate-pulse rounded bg-[#2A3347]" />
          </div>
        ))}
      </nav>
    </div>
  );
}
