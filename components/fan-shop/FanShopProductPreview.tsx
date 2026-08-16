"use client";

import { useRef, useState } from "react";
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
  /** Raw SanMar URL (before proxy) for layout detection */
  imageSourceUrl: string | null;
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
  imageSourceUrl,
  logoUrl,
  logoPlacement,
  logoMaxWidthInches,
  retailPriceCents,
}: Props) {
  const garmentRef = useRef<HTMLImageElement>(null);
  const [imgFailed, setImgFailed] = useState(false);

  const imageLayout = detectProductImageLayout(imageSourceUrl ?? garmentRasterUrl);
  const overlay = logoOverlayRect({
    kind: garmentKind,
    placement: logoPlacement,
    maxWidthInches: logoMaxWidthInches,
    imageLayout,
    styleNumber,
  });

  const isHat = garmentKind === "cap" || imageLayout === "hat_detail";

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-[#2A3347] bg-[#1C2333]">
      <div className="relative aspect-square w-full bg-[#0F1521]">
        <div className="absolute inset-0 flex items-start justify-center p-3 pt-4">
          {garmentRasterUrl && !imgFailed ? (
            <div
              className={
                isHat
                  ? "relative inline-block max-h-full max-w-[72%] leading-none"
                  : "relative inline-block max-h-full max-w-full leading-none"
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={garmentRef}
                src={garmentRasterUrl}
                alt=""
                onError={() => setImgFailed(true)}
                className={
                  isHat
                    ? "block h-auto w-full object-contain object-top"
                    : "block max-h-[min(100%,260px)] w-auto max-w-full object-contain"
                }
              />
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt=""
                  className="pointer-events-none absolute object-contain"
                  style={{
                    left: `${overlay.leftPercent}%`,
                    top: `${overlay.topPercent}%`,
                    width: `${overlay.widthPercent}%`,
                    height: "auto",
                    maxWidth: "none",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              ) : null}
            </div>
          ) : (
            <div className="flex h-full items-center px-4 text-center text-xs text-[#8A94A6]">
              {imgFailed ? "Product photo unavailable" : "No preview"}
            </div>
          )}
        </div>
        {!logoUrl && garmentRasterUrl && !imgFailed ? (
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
