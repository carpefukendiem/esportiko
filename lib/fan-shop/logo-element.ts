import type { DesignElement } from "@/lib/customize/design-types";
import type { CanvasPrintZone } from "@/lib/customize/canvas-print-zone";
import type { LogoPlacement } from "./types";

/** Place a team logo inside the print zone for read-only fan shop previews. */
export function buildLogoElement(params: {
  logoUrl: string;
  placement: LogoPlacement;
  zone: CanvasPrintZone;
  maxWidthInches: number;
}): DesignElement {
  const { logoUrl, placement, zone, maxWidthInches } = params;

  // Scale logo width relative to zone (~4" baseline maps to ~55% of zone width).
  const widthFrac = Math.min(0.85, Math.max(0.35, (maxWidthInches / 4) * 0.55));
  const w = zone.w * widthFrac;
  const h = w;

  let cx = zone.x + zone.w / 2;
  let cy = zone.y + zone.h / 2;

  switch (placement) {
    case "left_chest":
      cx = zone.x + zone.w * 0.32;
      cy = zone.y + zone.h * 0.38;
      break;
    case "right_chest":
      cx = zone.x + zone.w * 0.68;
      cy = zone.y + zone.h * 0.38;
      break;
    case "front_center":
    case "chest_center":
    case "back_center":
    default:
      break;
  }

  return {
    id: "fan-shop-logo",
    type: "image",
    view: "front",
    src: logoUrl,
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
