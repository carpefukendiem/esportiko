import type { GarmentSvgKind } from "@/lib/customize/design-types";

/** SVG-space print rectangles (matches dashed zones in `garment-placeholder.ts`). */
const ZONES: Record<
  GarmentSvgKind,
  Record<"front" | "back", { x: number; y: number; w: number; h: number; vbH: number }>
> = {
  tshirt: {
    front: { x: 78, y: 118, w: 144, h: 118, vbH: 400 },
    back: { x: 84, y: 102, w: 132, h: 120, vbH: 400 },
  },
  hoodie: {
    front: { x: 74, y: 150, w: 152, h: 120, vbH: 400 },
    back: { x: 84, y: 118, w: 132, h: 124, vbH: 400 },
  },
  polo: {
    front: { x: 82, y: 128, w: 136, h: 96, vbH: 400 },
    back: { x: 84, y: 118, w: 132, h: 110, vbH: 400 },
  },
  jersey: {
    front: { x: 76, y: 124, w: 148, h: 120, vbH: 400 },
    back: { x: 70, y: 108, w: 160, h: 150, vbH: 400 },
  },
  cap: {
    front: { x: 86, y: 118, w: 128, h: 86, vbH: 200 },
    back: { x: 92, y: 96, w: 116, h: 70, vbH: 200 },
  },
};

const VB_W = 300;

/** Internal drawing buffer edge length (square) for /customize compositor preview. */
export const CUSTOMIZE_CANVAS_BUFFER = 1200;

export type CanvasPrintZone = { x: number; y: number; w: number; h: number };

/**
 * Letterboxes the garment bitmap into a square buffer (same geometry as composite drawImage).
 */
export function letterboxedImageRect(
  bufferSize: number,
  imageNaturalWidth: number,
  imageNaturalHeight: number
): { ox: number; oy: number; drawW: number; drawH: number } {
  const nw = Math.max(1, imageNaturalWidth || 1);
  const nh = Math.max(1, imageNaturalHeight || 1);
  const scale = Math.min(bufferSize / nw, bufferSize / nh);
  const drawW = nw * scale;
  const drawH = nh * scale;
  const ox = (bufferSize - drawW) / 2;
  const oy = (bufferSize - drawH) / 2;
  return { ox, oy, drawW, drawH };
}

/**
 * Print zone in buffer pixel coords, scaled to match the fitted (letterboxed) garment image.
 */
export function zoneInBuffer(params: {
  kind: GarmentSvgKind;
  view: "front" | "back";
  bufferSize: number;
  imageNaturalWidth: number;
  imageNaturalHeight: number;
}): CanvasPrintZone {
  const { ox, oy, drawW, drawH } = letterboxedImageRect(
    params.bufferSize,
    params.imageNaturalWidth,
    params.imageNaturalHeight
  );
  const z = ZONES[params.kind][params.view];
  const sx = drawW / VB_W;
  const sy = drawH / z.vbH;
  return {
    x: ox + z.x * sx,
    y: oy + z.y * sy,
    w: z.w * sx,
    h: z.h * sy,
  };
}

export function printZoneOnCanvas(
  kind: GarmentSvgKind,
  view: "front" | "back",
  canvasW: number,
  canvasH: number
): CanvasPrintZone {
  const z = ZONES[kind][view];
  const sx = canvasW / VB_W;
  const sy = canvasH / z.vbH;
  return {
    x: z.x * sx,
    y: z.y * sy,
    w: z.w * sx,
    h: z.h * sy,
  };
}
