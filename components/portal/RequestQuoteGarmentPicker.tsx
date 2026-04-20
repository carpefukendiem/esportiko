"use client";

import { useState, type MouseEvent } from "react";
import Link from "next/link";
import { GarmentSelector } from "@/components/portal/GarmentSelector";
import { cn } from "@/lib/utils/cn";

function garmentsQuery(garments: string[]): string {
  return `garments=${encodeURIComponent(garments.join(","))}`;
}

export function RequestQuoteGarmentPicker() {
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const canProceed = selected.length > 0;
  const teamHref = canProceed ? `/start-team-order?${garmentsQuery(selected)}` : "#";
  const businessHref = canProceed
    ? `/start-business-order?${garmentsQuery(selected)}`
    : "#";

  const onBlockedClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!canProceed) {
      e.preventDefault();
      setError("Select at least one garment type to continue");
    }
  };

  return (
    <div className="mb-12 rounded-2xl border border-white/10 bg-navy-light/80 p-6 shadow-[0_20px_50px_-20px_rgba(8,12,24,0.5)] md:p-8">
      <h2 id="garment-picker-heading" className="font-display text-xl font-bold text-white md:text-2xl">
        What are you looking to order?
      </h2>
      <p className="mt-2 text-body text-off-white/80">
        Select everything that applies — many projects include more than one garment type.
      </p>
      <p className="mt-1 text-sm text-[#8A94A6]">
        Ordering jerseys and hoodies together? Select both.
      </p>
      <div className="mt-6">
        <GarmentSelector
          labelledBy="garment-picker-heading"
          value={selected}
          onChange={(next) => {
            setSelected(next);
            if (next.length > 0) setError(null);
          }}
          error={error ?? undefined}
        />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href={teamHref}
          scroll={canProceed}
          onClick={onBlockedClick}
          className={cn(
            "flex w-full items-center justify-center rounded-lg border border-[#3B7BF8] py-3 text-center font-sans text-sm font-semibold text-[#3B7BF8] transition-colors hover:bg-[#3B7BF8] hover:text-white",
            !canProceed && "cursor-not-allowed opacity-50 hover:bg-transparent hover:text-[#3B7BF8]"
          )}
          aria-disabled={!canProceed}
        >
          Start team quote
        </Link>
        <Link
          href={businessHref}
          scroll={canProceed}
          onClick={onBlockedClick}
          className={cn(
            "flex w-full items-center justify-center rounded-lg border border-[#3B7BF8] py-3 text-center font-sans text-sm font-semibold text-[#3B7BF8] transition-colors hover:bg-[#3B7BF8] hover:text-white",
            !canProceed && "cursor-not-allowed opacity-50 hover:bg-transparent hover:text-[#3B7BF8]"
          )}
          aria-disabled={!canProceed}
        >
          Business / brand quote
        </Link>
      </div>
    </div>
  );
}
