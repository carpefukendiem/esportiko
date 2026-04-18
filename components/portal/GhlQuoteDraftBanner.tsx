"use client";

import Link from "next/link";
import { useTransition } from "react";
import { dismissGhlQuoteOnboardingBanner } from "@/lib/actions/portal";
import { Button } from "@/components/ui/button";

type Props = {
  orderId: string;
};

export function GhlQuoteDraftBanner({ orderId }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <div
      className="rounded-xl border border-[#3B7BF8]/40 bg-[#1C2333] px-5 py-4 shadow-[0_12px_40px_-18px_rgba(59,123,248,0.45)]"
      role="region"
      aria-label="Quote draft reminder"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1">
          <p className="font-sans text-sm font-semibold text-white">
            Your quote is saved as a draft — review and submit when ready
          </p>
          <p className="font-sans text-xs font-medium text-[#8A94A6]">
            We pulled your quote details into the portal. Open the draft to
            confirm everything, add a roster if needed, and submit when you are
            ready.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button asChild variant="primary" className="font-sans text-sm">
            <Link href={`/portal/orders/${orderId}/edit`}>View draft</Link>
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="font-sans text-sm"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await dismissGhlQuoteOnboardingBanner();
              })
            }
          >
            {pending ? "Saving…" : "Dismiss"}
          </Button>
        </div>
      </div>
    </div>
  );
}
