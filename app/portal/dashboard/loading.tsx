/** Dashboard-specific skeleton — matches welcome + orders list placeholders. */
export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 p-4 md:p-0">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="h-9 w-72 max-w-full animate-pulse rounded-lg bg-[#2A3347]" />
          <div className="h-4 w-80 max-w-full animate-pulse rounded bg-[#2A3347]" />
        </div>
        <div className="h-11 w-40 shrink-0 animate-pulse rounded-lg bg-[#2A3347]" />
      </header>

      <section className="space-y-4">
        <div className="h-6 w-36 animate-pulse rounded bg-[#2A3347]" />
        <ul className="space-y-3">
          {[1, 2, 3].map((i) => (
            <li
              key={i}
              className="flex flex-col gap-3 rounded-xl border border-[#2A3347] bg-[#1C2333] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 w-20 animate-pulse rounded-full bg-[#2A3347]" />
                  <div className="h-5 w-32 animate-pulse rounded bg-[#2A3347]" />
                </div>
                <div className="h-3 w-48 animate-pulse rounded bg-[#2A3347]" />
              </div>
              <div className="flex shrink-0 gap-2">
                <div className="h-9 w-16 animate-pulse rounded-lg bg-[#2A3347]" />
                <div className="h-9 w-20 animate-pulse rounded-lg bg-[#2A3347]" />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
