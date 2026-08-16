"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createDraftOrder } from "@/lib/actions/portal";
import { cn } from "@/lib/utils/cn";

export function NewOrderButton({
  configId,
  className,
  children,
  variant = "primary",
}: {
  configId?: string | null;
  className?: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onClick = () => {
    setError(null);
    startTransition(async () => {
      try {
        const id = await createDraftOrder(configId ?? null);
        router.push(`/portal/orders/${id}/edit`);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not create order");
      }
    });
  };

  return (
    <div className="flex flex-col items-stretch gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={onClick}
        className={cn(
          "inline-flex items-center justify-center rounded-lg px-6 py-3 font-sans text-sm font-semibold transition-opacity disabled:opacity-60",
          variant === "primary"
            ? "bg-[#3B7BF8] text-white hover:opacity-90"
            : "border border-[#3B7BF8] text-[#3B7BF8] hover:bg-[#1C2333]",
          className
        )}
      >
        {pending ? "Creating order…" : children}
      </button>
      {error ? (
        <p className="font-sans text-xs font-medium text-red-400" role="alert">
          {error}. Complete team setup in Settings if this keeps failing.
        </p>
      ) : null}
    </div>
  );
}
