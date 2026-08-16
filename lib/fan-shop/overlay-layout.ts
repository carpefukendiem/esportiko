import type { GarmentSvgKind } from "@/lib/customize/design-types";
import type { LogoPlacement } from "./types";

export type LogoOverlayRect = {
  leftPercent: number;
  topPercent: number;
  widthPercent: number;
};

/**
 * Percentage-based logo placement on SanMar flat product photos.
 * Tuned per garment type — avoids canvas skew and matches fan-shop mockup expectations.
 */
export function logoOverlayRect(
  kind: GarmentSvgKind,
  placement: LogoPlacement,
  maxWidthInches: number
): LogoOverlayRect {
  if (kind === "cap") {
    const widthPercent = clamp(9, 16, 10.5 * (maxWidthInches / 2.25));
    if (placement === "left_chest") {
      return { leftPercent: 44, topPercent: 44, widthPercent: widthPercent * 0.85 };
    }
    if (placement === "right_chest") {
      return { leftPercent: 56, topPercent: 44, widthPercent: widthPercent * 0.85 };
    }
    // Front panel center on structured cap photos (112, 355, etc.)
    return { leftPercent: 50, topPercent: 43, widthPercent };
  }

  if (kind === "polo") {
    const widthPercent = clamp(11, 18, 13.5 * (maxWidthInches / 3.5));
    if (placement === "left_chest") {
      return { leftPercent: 36, topPercent: 31, widthPercent };
    }
    if (placement === "right_chest") {
      return { leftPercent: 64, topPercent: 31, widthPercent };
    }
    return { leftPercent: 50, topPercent: 32, widthPercent };
  }

  if (kind === "hoodie") {
    const widthPercent = clamp(14, 24, 18 * (maxWidthInches / 4));
    if (placement === "left_chest") {
      return { leftPercent: 38, topPercent: 34, widthPercent: widthPercent * 0.9 };
    }
    if (placement === "right_chest") {
      return { leftPercent: 62, topPercent: 34, widthPercent: widthPercent * 0.9 };
    }
    return { leftPercent: 50, topPercent: 35, widthPercent };
  }

  // T-shirts, jerseys, default
  const widthPercent = clamp(14, 26, 20 * (maxWidthInches / 4));
  if (placement === "left_chest") {
    return { leftPercent: 38, topPercent: 30, widthPercent: widthPercent * 0.85 };
  }
  if (placement === "right_chest") {
    return { leftPercent: 62, topPercent: 30, widthPercent: widthPercent * 0.85 };
  }
  return { leftPercent: 50, topPercent: 31, widthPercent };
}

function clamp(min: number, max: number, value: number): number {
  return Math.min(max, Math.max(min, value));
}
