import type { DesignElement } from "@/lib/customize/design-types";
import type { GarmentSvgKind } from "@/lib/customize/design-types";
import { letterboxedImageRect } from "@/lib/customize/canvas-print-zone";
import type { LogoPlacement } from "./types";

const BUFFER = 1200;

type Anchor = { cx: number; cy: number };

/** Normalized anchor (0–1) on the letterboxed garment bitmap — tuned per garment photo. */
function placementAnchor(
  placement: LogoPlacement,
  kind: GarmentSvgKind
): Anchor {
  if (kind === "cap") {
    switch (placement) {
      case "left_chest":
        return { cx: 0.42, cy: 0.56 };
      case "right_chest":
        return { cx: 0.58, cy: 0.56 };
      case "front_center":
      case "chest_center":
      case "back_center":
      default:
        return { cx: 0.5, cy: 0.58 };
    }
  }

  if (kind === "polo") {
    switch (placement) {
      case "left_chest":
        return { cx: 0.38, cy: 0.34 };
      case "right_chest":
        return { cx: 0.62, cy: 0.34 };
      default:
        return { cx: 0.5, cy: 0.36 };
    }
  }

  if (kind === "hoodie") {
    switch (placement) {
      case "left_chest":
        return { cx: 0.38, cy: 0.4 };
      case "right_chest":
        return { cx: 0.62, cy: 0.4 };
      default:
        return { cx: 0.5, cy: 0.4 };
    }
  }

  switch (placement) {
    case "left_chest":
      return { cx: 0.38, cy: 0.36 };
    case "right_chest":
      return { cx: 0.62, cy: 0.36 };
    case "front_center":
    case "chest_center":
    case "back_center":
    default:
      return { cx: 0.5, cy: 0.36 };
  }
}

/** Logo width as a fraction of the fitted garment width. */
function logoWidthFraction(kind: GarmentSvgKind, maxWidthInches: number): number {
  const defaults: Record<GarmentSvgKind, { baseInches: number; baseFrac: number }> = {
    cap: { baseInches: 2.25, baseFrac: 0.11 },
    polo: { baseInches: 3.5, baseFrac: 0.15 },
    hoodie: { baseInches: 4, baseFrac: 0.19 },
    tshirt: { baseInches: 4, baseFrac: 0.2 },
    jersey: { baseInches: 4, baseFrac: 0.2 },
  };
  const { baseInches, baseFrac } = defaults[kind];
  return Math.min(0.28, Math.max(0.08, baseFrac * (maxWidthInches / baseInches)));
}

/**
 * Build a locked logo element positioned on the SanMar product photo
 * (letterboxed into the compositor buffer), preserving logo aspect ratio.
 */
export function buildLogoElement(params: {
  logoUrl: string;
  logoNaturalWidth: number;
  logoNaturalHeight: number;
  placement: LogoPlacement;
  garmentKind: GarmentSvgKind;
  maxWidthInches: number;
  imageNaturalWidth: number;
  imageNaturalHeight: number;
  bufferSize?: number;
}): DesignElement {
  const bufferSize = params.bufferSize ?? BUFFER;
  const { ox, oy, drawW, drawH } = letterboxedImageRect(
    bufferSize,
    params.imageNaturalWidth,
    params.imageNaturalHeight
  );

  const anchor = placementAnchor(params.placement, params.garmentKind);
  const w = drawW * logoWidthFraction(params.garmentKind, params.maxWidthInches);
  const aspect =
    params.logoNaturalWidth > 0
      ? params.logoNaturalHeight / params.logoNaturalWidth
      : 1;
  const h = w * aspect;

  const cx = ox + drawW * anchor.cx;
  const cy = oy + drawH * anchor.cy;

  return {
    id: "fan-shop-logo",
    type: "image",
    view: "front",
    src: params.logoUrl,
    x: cx - w / 2,
    y: cy - h / 2,
    width: w,
    height: h,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: true,
  };
}
