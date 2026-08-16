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

function normalizeImageUrl(url: string): string {
  const raw = url.trim();
  if (!raw.includes("url=")) return raw.toLowerCase();
  try {
    const parsed = new URL(raw, "http://localhost");
    const inner = parsed.searchParams.get("url");
    if (inner) return decodeURIComponent(inner).toLowerCase();
  } catch {
    /* ignore */
  }
  return raw.toLowerCase();
}

/** Infer SanMar photo type from CDN filename — drives placement presets. */
export function detectProductImageLayout(url: string | null | undefined): ProductImageLayout {
  if (!url) return "unknown";
  const u = normalizeImageUrl(url);
  if (u.includes("hat_detail") || u.includes("_hat_")) return "hat_detail";
  if (
    u.includes("flatfront") ||
    u.includes("_flat_front") ||
    u.includes("_flat.") ||
    u.includes("flat_front")
  ) {
    return "flat_front";
  }
  if (u.includes("model_front") || u.includes("_front.jpg") || u.includes("_front.")) {
    return "model_front";
  }
  return "unknown";
}

/**
 * Hat_detail shots (1200×1800) show the cap in the upper ~35% with empty space below.
 * Coordinates are tuned against actual SanMar art — front panel center ≈ 19% from top.
 */
const HAT_STYLE_OVERRIDES: Record<string, LogoOverlayRect> = {
  "112": { leftPercent: 46, topPercent: 19, widthPercent: 10.5 },
  "355": { leftPercent: 46, topPercent: 19, widthPercent: 10.5 },
  "356": { leftPercent: 46, topPercent: 19, widthPercent: 10.5 },
  "1567": { leftPercent: 46, topPercent: 19, widthPercent: 10 },
  "1717": { leftPercent: 46, topPercent: 19, widthPercent: 10 },
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
  if (styleKey && HAT_STYLE_OVERRIDES[styleKey]) {
    return HAT_STYLE_OVERRIDES[styleKey];
  }

  if (kind === "cap" || imageLayout === "hat_detail") {
    return capOverlay(placement, maxWidthInches);
  }

  if (imageLayout === "flat_front") {
    return flatFrontOverlay(kind, placement, maxWidthInches);
  }

  return modelFrontOverlay(kind, placement, maxWidthInches);
}

function capOverlay(placement: LogoPlacement, maxWidthInches: number): LogoOverlayRect {
  const widthPercent = clamp(9, 13, 10.5 * (maxWidthInches / 2.25));
  if (placement === "left_chest") {
    return { leftPercent: 43, topPercent: 18, widthPercent: widthPercent * 0.92 };
  }
  if (placement === "right_chest") {
    return { leftPercent: 49, topPercent: 18, widthPercent: widthPercent * 0.92 };
  }
  return { leftPercent: 46, topPercent: 19, widthPercent };
}

function modelFrontOverlay(
  kind: GarmentSvgKind,
  placement: LogoPlacement,
  maxWidthInches: number
): LogoOverlayRect {
  if (kind === "polo") {
    const widthPercent = clamp(9, 13, 11 * (maxWidthInches / 3.5));
    if (placement === "left_chest") {
      return { leftPercent: 38, topPercent: 38, widthPercent };
    }
    if (placement === "right_chest") {
      return { leftPercent: 62, topPercent: 38, widthPercent };
    }
    return { leftPercent: 50, topPercent: 39, widthPercent };
  }

  if (kind === "hoodie") {
    const widthPercent = clamp(12, 18, 15 * (maxWidthInches / 4));
    if (placement === "left_chest") {
      return { leftPercent: 39, topPercent: 40, widthPercent: widthPercent * 0.88 };
    }
    if (placement === "right_chest") {
      return { leftPercent: 61, topPercent: 40, widthPercent: widthPercent * 0.88 };
    }
    return { leftPercent: 50, topPercent: 41, widthPercent };
  }

  const widthPercent = clamp(11, 18, 14 * (maxWidthInches / 4));
  if (placement === "left_chest") {
    return { leftPercent: 39, topPercent: 40, widthPercent: widthPercent * 0.85 };
  }
  if (placement === "right_chest") {
    return { leftPercent: 61, topPercent: 40, widthPercent: widthPercent * 0.85 };
  }
  return { leftPercent: 50, topPercent: 41, widthPercent };
}

function flatFrontOverlay(
  kind: GarmentSvgKind,
  placement: LogoPlacement,
  maxWidthInches: number
): LogoOverlayRect {
  if (kind === "cap") return capOverlay(placement, maxWidthInches);
  if (kind === "polo") {
    const widthPercent = clamp(10, 15, 12 * (maxWidthInches / 3.5));
    if (placement === "left_chest") {
      return { leftPercent: 36, topPercent: 28, widthPercent };
    }
    if (placement === "right_chest") {
      return { leftPercent: 64, topPercent: 28, widthPercent };
    }
    return { leftPercent: 50, topPercent: 29, widthPercent };
  }
  if (kind === "hoodie") {
    const widthPercent = clamp(13, 20, 16 * (maxWidthInches / 4));
    if (placement === "left_chest") {
      return { leftPercent: 38, topPercent: 32, widthPercent: widthPercent * 0.9 };
    }
    if (placement === "right_chest") {
      return { leftPercent: 62, topPercent: 32, widthPercent: widthPercent * 0.9 };
    }
    return { leftPercent: 50, topPercent: 33, widthPercent };
  }
  const widthPercent = clamp(13, 22, 17 * (maxWidthInches / 4));
  if (placement === "left_chest") {
    return { leftPercent: 38, topPercent: 28, widthPercent: widthPercent * 0.85 };
  }
  if (placement === "right_chest") {
    return { leftPercent: 62, topPercent: 28, widthPercent: widthPercent * 0.85 };
  }
  return { leftPercent: 50, topPercent: 29, widthPercent };
}

function clamp(min: number, max: number, value: number): number {
  return Math.min(max, Math.max(min, value));
}
