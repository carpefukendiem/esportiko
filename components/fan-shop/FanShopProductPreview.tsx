"use client";

import { useEffect, useMemo, useState } from "react";
import { LogoCompositor } from "@/components/customize/LogoCompositor";
import type { GarmentSvgKind } from "@/lib/customize/design-types";
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

function loadImageSize(src: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () =>
      resolve({
        w: img.naturalWidth || 400,
        h: img.naturalHeight || 400,
      });
    img.onerror = () => reject(new Error("image load failed"));
    img.src = src;
  });
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
  const [garmentNatural, setGarmentNatural] = useState({ w: 400, h: 400 });
  const [logoNatural, setLogoNatural] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    if (!logoUrl) {
      setLogoNatural(null);
      return;
    }
    let cancelled = false;
    void loadImageSize(logoUrl)
      .then((size) => {
        if (!cancelled) setLogoNatural(size);
      })
      .catch(() => {
        if (!cancelled) setLogoNatural({ w: 400, h: 400 });
      });
    return () => {
      cancelled = true;
    };
  }, [logoUrl]);

  const elements = useMemo(() => {
    if (!logoUrl || !logoNatural) return [];
    return [
      buildLogoElement({
        logoUrl,
        logoNaturalWidth: logoNatural.w,
        logoNaturalHeight: logoNatural.h,
        placement: logoPlacement,
        garmentKind,
        maxWidthInches: logoMaxWidthInches,
        imageNaturalWidth: garmentNatural.w,
        imageNaturalHeight: garmentNatural.h,
      }),
    ];
  }, [
    garmentKind,
    garmentNatural.h,
    garmentNatural.w,
    logoMaxWidthInches,
    logoNatural,
    logoPlacement,
    logoUrl,
  ]);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-[#2A3347] bg-[#1C2333]">
      <div className="relative aspect-square w-full overflow-hidden bg-[#0F1521]">
        <div className="absolute inset-0 flex items-center justify-center p-2">
          <div className="h-full w-full max-h-full max-w-full">
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
              onGarmentNaturalSize={(w, h) => setGarmentNatural({ w, h })}
            />
          </div>
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
