"use client";

import { useMemo, useState } from "react";
import { LogoCompositor } from "@/components/customize/LogoCompositor";
import type { GarmentSvgKind } from "@/lib/customize/design-types";
import { CUSTOMIZE_CANVAS_BUFFER, zoneInBuffer } from "@/lib/customize/canvas-print-zone";
import type { LogoPlacement } from "@/lib/fan-shop/types";
import { buildLogoElement } from "@/lib/fan-shop/logo-element";

type Props = {
  styleNumber: string;
  productTitle: string;
  garmentKind: GarmentSvgKind;
  garmentRasterUrl: string | null;
  garmentColor: string;
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
  garmentColor,
  logoUrl,
  logoPlacement,
  logoMaxWidthInches,
  retailPriceCents,
}: Props) {
  const [natural, setNatural] = useState({ w: 400, h: 400 });

  const elements = useMemo(() => {
    if (!logoUrl) return [];
    const zone = zoneInBuffer({
      kind: garmentKind,
      view: "front",
      bufferSize: CUSTOMIZE_CANVAS_BUFFER,
      imageNaturalWidth: natural.w,
      imageNaturalHeight: natural.h,
    });
    return [
      buildLogoElement({
        logoUrl,
        placement: logoPlacement,
        zone,
        maxWidthInches: logoMaxWidthInches,
      }),
    ];
  }, [garmentKind, logoMaxWidthInches, logoPlacement, logoUrl, natural.h, natural.w]);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-[#2A3347] bg-[#1C2333]">
      <div className="relative aspect-square w-full overflow-hidden bg-[#0F1521]">
        <div className="absolute left-1/2 top-1/2 h-[1200px] w-[1200px] -translate-x-1/2 -translate-y-1/2 scale-[0.26] pointer-events-none">
          <LogoCompositor
            garmentSvgKind={garmentKind}
            view="front"
            garmentColor={garmentColor}
            garmentRasterUrl={garmentRasterUrl}
            showGarmentPrintZone={false}
            showSafeZoneOverlay={false}
            elements={elements}
            selectedElementId={null}
            onElementsChange={() => {}}
            onSelectElement={() => {}}
            onGarmentNaturalSize={(w, h) => setNatural({ w, h })}
          />
        </div>
        {!logoUrl ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0F1521]/80 px-4 text-center">
            <p className="font-sans text-xs font-medium text-[#8A94A6]">
              Upload a logo to preview decoration
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
