"use client";

import { Suspense } from "react";
import { CustomizeExperience } from "@/components/customize/CustomizeExperience";

function CustomizeFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F1521] px-4 text-sm text-[#8A94A6]">
      Loading preview…
    </div>
  );
}

export default function CustomizePage() {
  return (
    <Suspense fallback={<CustomizeFallback />}>
      <CustomizeExperience />
    </Suspense>
  );
}
