"use client";

import { useTransition } from "react";
import { reorderAndRedirect } from "@/lib/actions/portal";
import { cn } from "@/lib/utils/cn";

export function ReorderButton({
  orderId,
  className,
}: {
  orderId: string;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => reorderAndRedirect(orderId))}
      className={cn(
        "rounded-lg bg-[#3B7BF8] px-4 py-2 font-sans text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60",
        className
      )}
    >
      {pending ? "…" : "Reorder"}
    </button>
  );
}
