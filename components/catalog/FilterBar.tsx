"use client";

import { cn } from "@/lib/utils/cn";

export type CatalogFilterValue = "All" | "New" | "Active";

const OPTIONS: CatalogFilterValue[] = ["All", "New", "Active"];

export function FilterBar({
  active,
  onChange,
}: {
  active: CatalogFilterValue;
  onChange: (value: CatalogFilterValue) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {OPTIONS.map((opt) => {
        const isOn = active === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "rounded-full px-4 py-1.5 font-sans text-body-sm font-semibold transition-colors",
              isOn
                ? "bg-blue-accent text-white"
                : "border border-slate/20 bg-navy-light text-gray-soft hover:border-blue-accent/40"
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
