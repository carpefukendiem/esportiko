"use client";

import { useCallback, useState } from "react";
import {
  detectProductImageLayout,
  logoOverlayRect,
} from "@/lib/fan-shop/overlay-layout";
import type { GarmentSvgKind } from "@/lib/customize/design-types";
import type { LogoPlacement } from "@/lib/fan-shop/types";

type Props = {
  styleNumber: string;
  productTitle: string;
  garmentKind: GarmentSvgKind;
  garmentRasterUrl: string | null;
  logoUrl: string | null;
  logoPlacement: LogoPlacement;
  logoMaxWidthInches: number;
  retailPriceCents: number;
};

function fmtPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function FanShopProductPreview({
  styleNumber,
  productTitle,
  garmentKind,
  garmentRasterUrl,
  logoUrl,
  logoPlacement,
  logoMaxWidthInches,
  retailPriceCents,
}: Props) {
  const [garmentSize, setGarmentSize] = useState({ w: 0, h: 0 });
  const [logoAspect, setLogoAspect] = useState(1);

  const onGarmentLoad = useCallback((el: HTMLImageElement) => {
    setGarmentSize({ w: el.clientWidth, h: el.clientHeight });
  }, []);

  const onLogoLoad = useCallback((el: HTMLImageElement) => {
    const w = el.naturalWidth || 1;
    const h = el.naturalHeight || 1;
    setLogoAspect(h / w);
  }, []);

  const imageLayout = detectProductImageLayout(garmentRasterUrl);
  const overlay = logoOverlayRect({
    kind: garmentKind,
    placement: logoPlacement,
    maxWidthInches: logoMaxWidthInches,
    imageLayout,
    styleNumber,
  });

  const logoWidthPx =
    garmentSize.w > 0 ? (garmentSize.w * overlay.widthPercent) / 100 : undefined;
  const logoHeightPx =
    logoWidthPx != null ? logoWidthPx * logoAspect : undefined;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-[#2A3347] bg-[#1C2333]">
      <div className="relative aspect-square w-full bg-[#0F1521]">
        <div className="absolute inset-0 flex items-center justify-center p-3">
          {garmentRasterUrl ? (
            <div className="relative inline-block max-h-full max-w-full leading-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={garmentRasterUrl}
                alt=""
                className="block max-h-[min(100%,280px)] max-w-full object-contain"
                onLoad={(e) => onGarmentLoad(e.currentTarget)}
              />
              {logoUrl && garmentSize.w > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt=""
                  className="pointer-events-none absolute object-contain"
                  onLoad={(e) => onLogoLoad(e.currentTarget)}
                  style={{
                    left: `${overlay.leftPercent}%`,
                    top: `${overlay.topPercent}%`,
                    width: logoWidthPx,
                    height: logoHeightPx,
                    maxWidth: "none",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              ) : null}
            </div>
          ) : (
            <div className="text-xs text-[#8A94A6]">No preview</div>
          )}
        </div>
        {!logoUrl && garmentRasterUrl ? (
          <div className="absolute inset-x-0 bottom-3 flex justify-center px-3">
            <p className="rounded-lg bg-[#0F1521]/90 px-3 py-1.5 text-center font-sans text-[10px] font-medium text-[#8A94A6]">
              Upload a logo to preview
            </p>
          </div>
        ) : null}
      </div>
      <div className="space-y-1 p-4">
        <p className="font-sans text-sm font-semibold text-white">{productTitle}</p>
        <p className="font-mono text-xs text-[#8A94A6]">{styleNumber}</p>
        <p className="font-sans text-sm font-semibold text-[#3B7BF8]">
          {fmtPrice(retailPriceCents)}
        </p>
      </div>
    </article>
  );
}
