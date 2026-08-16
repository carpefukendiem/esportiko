"use client";

import { useState } from "react";
import { FanShopProductPreview } from "./FanShopProductPreview";
import type { FanShopPreviewItem } from "@/lib/fan-shop/preview-data";

type Props = {
  items: FanShopPreviewItem[];
  initialLogoUrl: string | null;
  logoOptions: { id: string; label: string; url: string }[];
};

export function FanShopPreviewGrid({ items, initialLogoUrl, logoOptions }: Props) {
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);

  if (items.length === 0) {
    return (
      <p className="font-sans text-sm text-[#8A94A6]">
        Product catalog is loading — check back shortly.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {logoOptions.length > 1 ? (
        <label className="flex flex-col gap-2 font-sans text-sm text-[#8A94A6]">
          Preview logo
          <select
            value={logoOptions.find((o) => o.url === logoUrl)?.id ?? logoOptions[0]?.id ?? ""}
            onChange={(e) => {
              const opt = logoOptions.find((o) => o.id === e.target.value);
              if (opt) setLogoUrl(opt.url);
            }}
            className="rounded-lg border border-[#2A3347] bg-[#0F1521] px-3 py-2 text-sm text-white"
          >
            {logoOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <FanShopProductPreview
            key={item.styleNumber}
            {...item}
            logoUrl={logoUrl}
          />
        ))}
      </div>
    </div>
  );
}
