"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { GarmentSelector } from "@/components/portal/GarmentSelector";
import { Button } from "@/components/ui/button";

type QuoteGarmentForm = {
  garment_type: string;
};

function RequestQuoteGarmentPicker() {
  const form = useForm<QuoteGarmentForm>({
    defaultValues: { garment_type: "" },
    mode: "onChange",
  });

  const garment = form.watch("garment_type");
  const canContinue = Boolean(garment);

  const hrefWithGarment = (path: string) =>
    `${path}?garment=${encodeURIComponent(garment)}`;

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-navy-light/90 via-navy to-navy-mid p-6 shadow-[0_20px_50px_-20px_rgba(8,12,24,0.5)] md:p-8">
      <p className="mb-6 max-w-2xl font-sans text-sm font-medium text-[#8A94A6] md:text-body-sm">
        Pick a category so we can route you to the right quote flow with context.
      </p>

      <GarmentSelector control={form.control} name="garment_type" />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        {canContinue ? (
          <Button asChild variant="primary" className="w-full sm:w-auto">
            <Link href={hrefWithGarment("/start-team-order")}>
              Team / uniform quote
            </Link>
          </Button>
        ) : (
          <Button type="button" variant="primary" className="w-full sm:w-auto" disabled>
            Team / uniform quote
          </Button>
        )}
        {canContinue ? (
          <Button asChild variant="secondary" className="w-full sm:w-auto">
            <Link href={hrefWithGarment("/start-business-order")}>
              Business / brand quote
            </Link>
          </Button>
        ) : (
          <Button type="button" variant="secondary" className="w-full sm:w-auto" disabled>
            Business / brand quote
          </Button>
        )}
      </div>
    </div>
  );
}

export default RequestQuoteGarmentPicker;
