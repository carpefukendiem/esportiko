"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function MobileCTABar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate/30 bg-navy-mid px-4 py-3 md:hidden">
      <div className="mx-auto flex max-w-content items-center justify-between gap-3">
        <p className="font-sans text-sm text-off-white">Ready to customize?</p>
        <Button asChild variant="primary" className="shrink-0 px-4 py-2 text-sm">
          <Link href="/request-a-quote">Start a Project →</Link>
        </Button>
      </div>
    </div>
  );
}
