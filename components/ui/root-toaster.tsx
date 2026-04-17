"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Toaster = dynamic(
  () => import("@/components/ui/toaster").then((m) => m.Toaster),
  { ssr: false }
);

/**
 * Single app-wide toast host (import only from app/layout.tsx).
 * Post-hydration mount + dynamic ssr:false ensures Radix ToastViewport’s `<ol>`
 * is never part of server HTML, avoiding hydration mismatches on /signup etc.
 */
export function RootToaster() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <Toaster />;
}
