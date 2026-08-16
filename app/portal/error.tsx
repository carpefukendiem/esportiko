"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function PortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[portal]", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 py-16 text-center">
      <h1 className="font-sans text-xl font-semibold text-white">Something went wrong</h1>
      <p className="font-sans text-sm text-[#8A94A6]">
        {error.message || "We could not load this portal page."}
      </p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-[#3B7BF8] px-4 py-2 font-sans text-sm font-semibold text-white"
        >
          Try again
        </button>
        <Link
          href="/portal/dashboard"
          className="rounded-lg border border-[#2A3347] px-4 py-2 font-sans text-sm font-semibold text-[#8A94A6]"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
