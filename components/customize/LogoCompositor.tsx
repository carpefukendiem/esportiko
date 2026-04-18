"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { buildGarmentPlaceholderDataUrl } from "@/lib/catalog/garment-placeholder";
import type { DesignElement } from "@/lib/customize/design-types";
import type { GarmentSvgKind } from "@/lib/customize/design-types";
import { printZoneOnCanvas } from "@/lib/customize/canvas-print-zone";

const HANDLE = 10;
type Corner = "nw" | "ne" | "sw" | "se";

type DragState =
  | { type: "move"; id: string; startMx: number; startMy: number; origX: number; origY: number }
  | { type: "resize"; id: string; corner: Corner; anchorX: number; anchorY: number };

export type LogoCompositorProps = {
  canvasWidth: number;
  canvasHeight: number;
  garmentSvgKind: GarmentSvgKind;
  view: "front" | "back";
  fillHex: string;
  garmentRasterUrl: string | null;
  /** When true, dashed print zone is baked into the SVG garment. */
  showGarmentPrintZone: boolean;
  /** Overlay the canonical print rectangle on the canvas (dashed). */
  showSafeZoneOverlay: boolean;
  elements: DesignElement[];
  selectedElementId: string | null;
  onElementsChange: (next: DesignElement[]) => void;
  onSelectElement: (id: string | null) => void;
  onOutsidePrintZoneChange?: (outside: boolean) => void;
  onCanvasReady?: (el: HTMLCanvasElement) => void;
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image load failed"));
    img.src = src;
  });
}

function rectFullyInside(
  x: number,
  y: number,
  w: number,
  h: number,
  z: { x: number; y: number; w: number; h: number }
) {
  return x >= z.x && y >= z.y && x + w <= z.x + z.w && y + h <= z.y + z.h;
}

function hitRotatedRect(
  px: number,
  py: number,
  x: number,
  y: number,
  w: number,
  h: number,
  rotationDeg: number
): boolean {
  if (rotationDeg === 0) {
    return px >= x && px <= x + w && py >= y && py <= y + h;
  }
  const cx = x + w / 2;
  const cy = y + h / 2;
  const rad = (-rotationDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = px - cx;
  const dy = py - cy;
  const lx = dx * cos - dy * sin;
  const ly = dx * sin + dy * cos;
  return Math.abs(lx) <= w / 2 && Math.abs(ly) <= h / 2;
}

function measureTextBox(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontPx: number,
  family: string,
  bold: boolean,
  letterSpacing: number
): { w: number; h: number } {
  const weight = bold ? "700" : "400";
  ctx.font = `${weight} ${fontPx}px "${family}", system-ui, sans-serif`;
  ctx.letterSpacing = `${letterSpacing}px`;
  const w = Math.max(1, ctx.measureText(text || " ").width + 8);
  const h = Math.max(1, fontPx * 1.25 + 8);
  ctx.letterSpacing = "0px";
  return { w, h };
}

export function LogoCompositor({
  canvasWidth,
  canvasHeight,
  garmentSvgKind,
  view,
  fillHex,
  garmentRasterUrl,
  showGarmentPrintZone,
  showSafeZoneOverlay,
  elements,
  selectedElementId,
  onElementsChange,
  onSelectElement,
  onOutsidePrintZoneChange,
  onCanvasReady,
}: LogoCompositorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const baseImgRef = useRef<HTMLImageElement | null>(null);
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const rafRef = useRef<number | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const outsideRef = useRef(false);
  const elementsRef = useRef(elements);
  elementsRef.current = elements;

  const zone = useMemo(
    () => printZoneOnCanvas(garmentSvgKind, view, canvasWidth, canvasHeight),
    [canvasHeight, canvasWidth, garmentSvgKind, view]
  );

  const garmentKey = useMemo(
    () =>
      `${canvasWidth}x${canvasHeight}|${garmentSvgKind}|${view}|${garmentRasterUrl ?? ""}|${fillHex}|${showGarmentPrintZone ? 1 : 0}`,
    [canvasHeight, canvasWidth, fillHex, garmentRasterUrl, garmentSvgKind, showGarmentPrintZone, view]
  );

  useEffect(() => {
    const el = canvasRef.current;
    if (el) onCanvasReady?.(el);
  }, [onCanvasReady, canvasWidth, canvasHeight]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (garmentRasterUrl) {
          const img = await loadImage(garmentRasterUrl);
          if (!cancelled) baseImgRef.current = img;
        } else {
          throw new Error("placeholder");
        }
      } catch {
        const url = buildGarmentPlaceholderDataUrl(
          garmentSvgKind,
          view,
          fillHex,
          showGarmentPrintZone
        );
        try {
          const img = await loadImage(url);
          if (!cancelled) baseImgRef.current = img;
        } catch {
          if (!cancelled) baseImgRef.current = null;
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fillHex, garmentRasterUrl, garmentSvgKind, showGarmentPrintZone, view]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await document.fonts.ready;
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const ensureImage = useCallback(async (src: string) => {
    const cache = imageCacheRef.current;
    const hit = cache.get(src);
    if (hit && hit.complete) return hit;
    const img = await loadImage(src);
    cache.set(src, img);
    return img;
  }, []);

  const draw = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    const base = baseImgRef.current;
    if (base && base.complete && base.naturalWidth) {
      ctx.drawImage(base, 0, 0, canvasWidth, canvasHeight);
    }

    const els = elementsRef.current.filter((e) => e.visible);
    for (const el of els) {
      if (el.type === "image" && el.src) {
        const img = imageCacheRef.current.get(el.src);
        if (!img || !img.complete) continue;
        ctx.save();
        ctx.globalAlpha = el.opacity;
        const cx = el.x + el.width / 2;
        const cy = el.y + el.height / 2;
        ctx.translate(cx, cy);
        ctx.rotate((el.rotation * Math.PI) / 180);
        ctx.drawImage(img, -el.width / 2, -el.height / 2, el.width, el.height);
        ctx.restore();
      } else if (el.type === "text") {
        const text = el.text ?? "YOUR TEXT";
        const fontSize = el.fontSize ?? 48;
        const family = el.fontFamily ?? "Bebas Neue";
        const bold = Boolean(el.bold);
        const letter = el.letterSpacing ?? 0;
        const color = el.color ?? "#ffffff";
        ctx.save();
        ctx.globalAlpha = el.opacity;
        const cx = el.x + el.width / 2;
        const cy = el.y + el.height / 2;
        ctx.translate(cx, cy);
        ctx.rotate((el.rotation * Math.PI) / 180);
        const weight = bold ? "700" : "400";
        ctx.font = `${weight} ${fontSize}px "${family}", system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.letterSpacing = `${letter}px`;
        ctx.fillStyle = color;
        ctx.fillText(text, 0, 0);
        ctx.letterSpacing = "0px";
        ctx.restore();
      }
    }

    if (showSafeZoneOverlay) {
      ctx.save();
      ctx.strokeStyle = "rgba(148,163,184,0.75)";
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 1;
      ctx.strokeRect(zone.x + 0.5, zone.y + 0.5, zone.w - 1, zone.h - 1);
      ctx.restore();
    }

    const sel = els.find((e) => e.id === selectedElementId);
    if (sel) {
      ctx.save();
      ctx.strokeStyle = "#3B7BF8";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      const cx = sel.x + sel.width / 2;
      const cy = sel.y + sel.height / 2;
      ctx.translate(cx, cy);
      ctx.rotate((sel.rotation * Math.PI) / 180);
      ctx.strokeRect(-sel.width / 2, -sel.height / 2, sel.width, sel.height);
      ctx.setLineDash([]);
      ctx.fillStyle = "#3B7BF8";
      const hw = sel.width / 2;
      const hh = sel.height / 2;
      const corners: [number, number][] = [
        [-hw, -hh],
        [hw, -hh],
        [-hw, hh],
        [hw, hh],
      ];
      for (const [rx, ry] of corners) {
        ctx.fillRect(rx - HANDLE / 2, ry - HANDLE / 2, HANDLE, HANDLE);
      }
      ctx.restore();
    }

    const outside =
      Boolean(sel) &&
      !rectFullyInside(sel!.x, sel!.y, sel!.width, sel!.height, zone);
    if (onOutsidePrintZoneChange) {
      if (outsideRef.current !== outside) {
        outsideRef.current = outside;
        onOutsidePrintZoneChange(outside);
      }
    }
  }, [
    canvasHeight,
    canvasWidth,
    onOutsidePrintZoneChange,
    selectedElementId,
    showSafeZoneOverlay,
    zone,
  ]);

  const scheduleDraw = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      draw();
      rafRef.current = null;
    });
  }, [draw]);

  useEffect(() => {
    scheduleDraw();
  }, [draw, scheduleDraw, elements, selectedElementId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const el of elements) {
        if (el.type !== "image" || !el.src) continue;
        try {
          const img = await ensureImage(el.src);
          if (!cancelled && img) scheduleDraw();
        } catch {
          /* skip broken uploads */
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [elements, ensureImage, scheduleDraw]);

  useEffect(() => {
    scheduleDraw();
  }, [garmentKey, scheduleDraw]);

  function clientToCanvas(clientX: number, clientY: number) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { mx: 0, my: 0 };
    return {
      mx: ((clientX - rect.left) / rect.width) * canvasWidth,
      my: ((clientY - rect.top) / rect.height) * canvasHeight,
    };
  }

  function hitCorner(mx: number, my: number, el: DesignElement): Corner | null {
    const cx = el.x + el.width / 2;
    const cy = el.y + el.height / 2;
    const rad = (el.rotation * Math.PI) / 180;
    const cos = Math.cos(-rad);
    const sin = Math.sin(-rad);
    const dx = mx - cx;
    const dy = my - cy;
    const lx = dx * cos - dy * sin;
    const ly = dx * sin + dy * cos;
    const hw = el.width / 2;
    const hh = el.height / 2;
    const pts: [Corner, number, number][] = [
      ["nw", -hw, -hh],
      ["ne", hw, -hh],
      ["sw", -hw, hh],
      ["se", hw, hh],
    ];
    for (const [name, rx, ry] of pts) {
      if (Math.abs(lx - rx) <= HANDLE && Math.abs(ly - ry) <= HANDLE) return name;
    }
    return null;
  }

  function anchorForCorner(corner: Corner, x: number, y: number, w: number, h: number) {
    switch (corner) {
      case "se":
        return { ax: x, ay: y };
      case "nw":
        return { ax: x + w, ay: y + h };
      case "ne":
        return { ax: x, ay: y + h };
      case "sw":
        return { ax: x + w, ay: y };
      default:
        return { ax: x, ay: y };
    }
  }

  function patchElement(id: string, patch: Partial<DesignElement>) {
    onElementsChange(elementsRef.current.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const { mx, my } = clientToCanvas(e.clientX, e.clientY);
    const ordered = [...elementsRef.current].filter((x) => x.visible).reverse();
    for (const el of ordered) {
      if (el.locked) continue;
      const inside = hitRotatedRect(mx, my, el.x, el.y, el.width, el.height, el.rotation);
      if (!inside) continue;
      onSelectElement(el.id);
      const corner = hitCorner(mx, my, el);
      if (corner) {
        const { ax, ay } = anchorForCorner(corner, el.x, el.y, el.width, el.height);
        dragRef.current = { type: "resize", id: el.id, corner, anchorX: ax, anchorY: ay };
      } else {
        dragRef.current = {
          type: "move",
          id: el.id,
          startMx: mx,
          startMy: my,
          origX: el.x,
          origY: el.y,
        };
      }
      (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
      scheduleDraw();
      return;
    }
    onSelectElement(null);
    scheduleDraw();
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const d = dragRef.current;
    if (!d) return;
    const { mx, my } = clientToCanvas(e.clientX, e.clientY);
    const el = elementsRef.current.find((x) => x.id === d.id);
    if (!el || el.locked) return;

    if (d.type === "move") {
      const dx = mx - d.startMx;
      const dy = my - d.startMy;
      patchElement(el.id, { x: d.origX + dx, y: d.origY + dy });
    } else {
      const { anchorX, anchorY, corner } = d;
      if (el.type === "image") {
        const aspect = el.height > 0 ? el.height / el.width : 1;
        let w = 20;
        let nx = anchorX;
        let ny = anchorY;
        if (corner === "se") {
          w = Math.max(20, mx - anchorX);
          const h = w * aspect;
          nx = anchorX;
          ny = anchorY;
          patchElement(el.id, { x: nx, y: ny, width: w, height: h });
        } else if (corner === "nw") {
          w = Math.max(20, anchorX - mx);
          const h = w * aspect;
          nx = anchorX - w;
          ny = anchorY - h;
          patchElement(el.id, { x: nx, y: ny, width: w, height: h });
        } else if (corner === "ne") {
          w = Math.max(20, mx - anchorX);
          const h = w * aspect;
          nx = anchorX;
          ny = anchorY - h;
          patchElement(el.id, { x: nx, y: ny, width: w, height: h });
        } else {
          w = Math.max(20, anchorX - mx);
          const h = w * aspect;
          nx = anchorX - w;
          ny = anchorY;
          patchElement(el.id, { x: nx, y: ny, width: w, height: h });
        }
      } else {
        const c = canvasRef.current?.getContext("2d");
        if (!c) return;
        let w = 20;
        if (corner === "se") {
          w = Math.max(20, mx - anchorX);
        } else if (corner === "nw") {
          w = Math.max(20, anchorX - mx);
        } else if (corner === "ne") {
          w = Math.max(20, mx - anchorX);
        } else {
          w = Math.max(20, anchorX - mx);
        }
        const text = el.text ?? "YOUR TEXT";
        const family = el.fontFamily ?? "Bebas Neue";
        const bold = Boolean(el.bold);
        const letter = el.letterSpacing ?? 0;
        const baseFs = el.fontSize ?? 48;
        const scale = w / Math.max(1, el.width);
        const fontSize = Math.max(20, Math.min(120, baseFs * scale));
        const { w: tw, h: th } = measureTextBox(c, text, fontSize, family, bold, letter);
        const ocx = el.x + el.width / 2;
        const ocy = el.y + el.height / 2;
        patchElement(el.id, {
          fontSize,
          x: ocx - tw / 2,
          y: ocy - th / 2,
          width: tw,
          height: th,
        });
      }
    }
    scheduleDraw();
  }

  function onPointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    dragRef.current = null;
    try {
      (e.target as HTMLCanvasElement).releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
    scheduleDraw();
  }

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      className="max-w-full touch-none rounded-lg border border-[#2A3347] bg-[#1C2333]"
      style={{ width: "100%", height: "auto" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    />
  );
}

export function downloadCanvasPreview(canvas: HTMLCanvasElement | null, styleNumber: string) {
  if (!canvas) return;
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = `preview-${styleNumber || "garment"}.png`;
  a.click();
}
