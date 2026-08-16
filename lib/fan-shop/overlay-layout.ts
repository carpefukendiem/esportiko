import type { GarmentSvgKind } from "@/lib/customize/design-types";
import type { LogoPlacement } from "./types";

export type LogoOverlayRect = {
  leftPercent: number;
  topPercent: number;
  /** Logo width as % of the displayed garment image width */
  widthPercent: number;
};

export type ProductImageLayout =
  | "model_front"
  | "hat_detail"
  | "flat_front"
  | "unknown";

/** Infer SanMar photo type from CDN filename — drives placement presets. */
export function detectProductImageLayout(url: string | null | undefined): ProductImageLayout {
  if (!url) return "unknown";
  const u = url.toLowerCase();
  if (u.includes("hat_detail") || u.includes("_hat_")) return "hat_detail";
  if (u.includes("flatfront") || u.includes("_flat_front") || u.includes("_flat.")) {
    return "flat_front";
  }
  if (u.includes("model_front") || u.includes("_front.jpg")) return "model_front";
  return "unknown";
}

/** Per-style fine tuning (mostly structured caps). */
const STYLE_OVERRIDES: Record<string, LogoOverlayRect> = {
  "112": { leftPercent: 50, topPercent: 28, widthPercent: 7.5 },
  "355": { leftPercent: 50, topPercent: 29, widthPercent: 7.5 },
  "356": { leftPercent: 50, topPercent: 29, widthPercent: 7.5 },
  "1567": { leftPercent: 50, topPercent: 28, widthPercent: 7 },
  "1717": { leftPercent: 50, topPercent: 28, widthPercent: 7 },
};

/**
 * Percentage-based logo placement on SanMar product photos.
 * Coordinates are relative to the garment <img> box (not the card).
 */
export function logoOverlayRect(params: {
  kind: GarmentSvgKind;
  placement: LogoPlacement;
  maxWidthInches: number;
  imageLayout: ProductImageLayout;
  styleNumber?: string;
}): LogoOverlayRect {
  const { kind, placement, maxWidthInches, imageLayout, styleNumber } = params;
  const styleKey = styleNumber?.trim().toUpperCase() ?? "";
  if (styleKey && STYLE_OVERRIDES[styleKey]) {
    return STYLE_OVERRIDES[styleKey];
  }

  if (kind === "cap" || imageLayout === "hat_detail") {
    return capOverlay(placement, maxWidthInches);
  }

  if (imageLayout === "model_front") {
    return modelFrontOverlay(kind, placement, maxWidthInches);
  }

  if (imageLayout === "flat_front") {
    return flatFrontOverlay(kind, placement, maxWidthInches);
  }

  return modelFrontOverlay(kind, placement, maxWidthInches);
}

function capOverlay(placement: LogoPlacement, maxWidthInches: number): LogoOverlayRect {
  const widthPercent = clamp(6.5, 9.5, 7.5 * (maxWidthInches / 2.25));
  if (placement === "left_chest") {
    return { leftPercent: 46, topPercent: 27, widthPercent: widthPercent * 0.9 };
  }
  if (placement === "right_chest") {
    return { leftPercent: 54, topPercent: 27, widthPercent: widthPercent * 0.9 };
  }
  return { leftPercent: 50, topPercent: 28, widthPercent };
}

function modelFrontOverlay(
  kind: GarmentSvgKind,
  placement: LogoPlacement,
  maxWidthInches: number
): LogoOverlayRect {
  if (kind === "polo") {
    const widthPercent = clamp(10, 14, 12 * (maxWidthInches / 3.5));
    if (placement === "left_chest") {
      return { leftPercent: 39, topPercent: 41, widthPercent };
    }
    if (placement === "right_chest") {
      return { leftPercent: 61, topPercent: 41, widthPercent };
    }
    return { leftPercent: 50, topPercent: 42, widthPercent };
  }

  if (kind === "hoodie") {
    const widthPercent = clamp(14, 20, 17 * (maxWidthInches / 4));
    if (placement === "left_chest") {
      return { leftPercent: 40, topPercent: 43, widthPercent: widthPercent * 0.88 };
    }
    if (placement === "right_chest") {
      return { leftPercent: 60, topPercent: 43, widthPercent: widthPercent * 0.88 };
    }
    return { leftPercent: 50, topPercent: 44, widthPercent };
  }

  const widthPercent = clamp(13, 22, 17 * (maxWidthInches / 4));
  if (placement === "left_chest") {
    return { leftPercent: 40, topPercent: 44, widthPercent: widthPercent * 0.85 };
  }
  if (placement === "right_chest") {
    return { leftPercent: 60, topPercent: 44, widthPercent: widthPercent * 0.85 };
  }
  return { leftPercent: 50, topPercent: 45, widthPercent };
}

function flatFrontOverlay(
  kind: GarmentSvgKind,
  placement: LogoPlacement,
  maxWidthInches: number
): LogoOverlayRect {
  if (kind === "cap") return capOverlay(placement, maxWidthInches);
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
