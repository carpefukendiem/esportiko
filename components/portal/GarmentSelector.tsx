"use client";

import { Check, Shirt } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export const PORTAL_GARMENT_OPTIONS = [
  "Jerseys",
  "Hoodies",
  "T-Shirts",
  "Polos",
  "Hats",
  "Other",
] as const;

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
  /** Optional validation message shown below the grid */
  error?: string;
  /** Accessible label id for the group */
  labelledBy?: string;
};

export function GarmentSelector({ value, onChange, error, labelledBy }: Props) {
  const toggle = (label: string) => {
    const set = new Set(value);
    if (set.has(label)) set.delete(label);
    else set.add(label);
    onChange(Array.from(set));
  };

  return (
    <div>
      <div
        role="group"
        aria-labelledby={labelledBy}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3"
      >
        {PORTAL_GARMENT_OPTIONS.map((label) => {
          const selected = value.includes(label);
          return (
            <button
              key={label}
              type="button"
              onClick={() => toggle(label)}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-colors",
                "bg-[#1C2333] border-[#2A3347] hover:border-[#3B7BF8]/60",
                selected && "border-[#3B7BF8] ring-1 ring-[#3B7BF8]/40"
              )}
            >
              {selected ? (
                <span
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#3B7BF8]"
                  aria-hidden
                >
                  <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                </span>
              ) : null}
              <Shirt className="mb-2 h-8 w-8 text-[#8A94A6]" aria-hidden />
              <span className="font-sans text-sm font-semibold text-white">{label}</span>
            </button>
          );
        })}
      </div>
      {error ? (
        <p className="mt-2 font-sans text-sm font-medium text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
