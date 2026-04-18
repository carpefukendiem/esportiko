"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildGarmentPlaceholderDataUrl } from "@/lib/catalog/garment-placeholder";

export type GarmentKind = "torso" | "cap";

type PrintZone = { x: number; y: number; w: number; h: number };

function printZoneFor(
  kind: GarmentKind,
  view: "front" | "back",
  cw: number,
  ch: number
): PrintZone {
  const f =
    kind === "cap"
      ? view === "front"
        ? { x: 0.28, y: 0.3, w: 0.44, h: 0.32 }
        : { x: 0.26, y: 0.24, w: 0.48, h: 0.3 }
      : view === "front"
        ? { x: 0.22, y: 0.26, w: 0.56, h: 0.28 }
        : { x: 0.24, y: 0.2, w: 0.52, h: 0.26 };
  return {
    x: f.x * cw,
    y: f.y * ch,
    w: f.w * cw,
    h: f.h * ch,
  };
}

function rectFullyInside(
  x: number,
  y: number,
  w: number,
  h: number,
  z: PrintZone
) {
  return (
    x >= z.x &&
    y >= z.y &&
    x + w <= z.x + z.w &&
    y + h <= z.y + z.h
  );
}

type Corner = "nw" | "ne" | "sw" | "se";
const HANDLE = 10;

export type LogoCompositorProps = {
  canvasWidth: number;
  canvasHeight: number;
  garmentKind: GarmentKind;
  view: "front" | "back";
  fillHex: string;
  garmentRasterUrl: string | null;
  logoSrc: string | null;
  logoNaturalWidth: number;
  logoNaturalHeight: number;
  hasLogo: boolean;
  sizePct: number;
  opacityPct: number;
  onOutsidePrintZoneChange: (outside: boolean) => void;
  onRegisterReset?: (fn: () => void) => void;
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

type DragState =
  | { type: "move"; offX: number; offY: number }
  | { type: "resize"; corner: Corner; anchorX: number; anchorY: number };

export function LogoCompositor({
  canvasWidth,
  canvasHeight,
  garmentKind,
  view,
  fillHex,
  garmentRasterUrl,
  logoSrc,
  logoNaturalWidth,
  logoNaturalHeight,
  hasLogo,
  sizePct,
  opacityPct,
  onOutsidePrintZoneChange,
  onRegisterReset,
  onCanvasReady,
}: LogoCompositorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (el) onCanvasReady?.(el);
  }, [onCanvasReady, canvasWidth, canvasHeight]);
  const baseImgRef = useRef<HTMLImageElement | null>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const outsideRef = useRef(false);
  const dragRef = useRef<DragState | null>(null);
  const logoGeomRef = useRef({ x: 0, y: 0, w: 100, h: 100 });

  const [logoX, setLogoX] = useState(0);
  const [logoY, setLogoY] = useState(0);
  const [logoW, setLogoW] = useState(100);
  const [logoH, setLogoH] = useState(100);
  const [selected, setSelected] = useState(false);

  const zone = useMemo(
    () => printZoneFor(garmentKind, view, canvasWidth, canvasHeight),
    [canvasHeight, canvasWidth, garmentKind, view]
  );
  const aspect =
    logoNaturalWidth > 0 ? logoNaturalHeight / logoNaturalWidth : 1;

  const garmentKey = useMemo(
    () =>
      `${canvasWidth}x${canvasHeight}|${garmentKind}|${view}|${garmentRasterUrl ?? ""}|${fillHex}`,
    [canvasHeight, canvasWidth, fillHex, garmentKind, garmentRasterUrl, view]
  );

  logoGeomRef.current = { x: logoX, y: logoY, w: logoW, h: logoH };

  const placeCenteredInZone = useCallback(
    (pct: number) => {
      const w = Math.max(20, (pct / 100) * canvasWidth);
      const h = w * aspect;
      const cx = zone.x + zone.w / 2;
      const cy = zone.y + zone.h / 2;
      setLogoW(w);
      setLogoH(h);
      setLogoX(cx - w / 2);
      setLogoY(cy - h / 2);
    },
    [aspect, canvasWidth, zone.x, zone.y, zone.w, zone.h]
  );

  useEffect(() => {
    onRegisterReset?.(() => {
      placeCenteredInZone(sizePct);
      setSelected(true);
    });
  }, [onRegisterReset, placeCenteredInZone, sizePct]);

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
          garmentKind,
          view,
          fillHex,
          !hasLogo
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
  }, [fillHex, garmentKind, garmentRasterUrl, hasLogo, view]);

  useEffect(() => {
    let cancelled = false;
    if (!logoSrc || !hasLogo) {
      logoImgRef.current = null;
      return;
    }
    (async () => {
      try {
        const img = await loadImage(logoSrc);
        if (!cancelled) logoImgRef.current = img;
      } catch {
        if (!cancelled) logoImgRef.current = null;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hasLogo, logoSrc]);

  const sizePctRef = useRef(sizePct);
  sizePctRef.current = sizePct;

  useEffect(() => {
    placeCenteredInZone(sizePctRef.current);
    setSelected(Boolean(hasLogo));
  }, [garmentKey, hasLogo, logoSrc, placeCenteredInZone]);

  useEffect(() => {
    if (dragRef.current) return;
    const { x, y, w, h } = logoGeomRef.current;
    const cx = x + w / 2;
    const cy = y + h / 2;
    const nw = Math.max(20, (sizePct / 100) * canvasWidth);
    const nh = nw * aspect;
    setLogoW(nw);
    setLogoH(nh);
    setLogoX(cx - nw / 2);
    setLogoY(cy - nh / 2);
  }, [aspect, canvasWidth, sizePct]);

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
    const logo = logoImgRef.current;
    if (logo && logo.complete && hasLogo) {
      ctx.save();
      ctx.globalAlpha = opacityPct / 100;
      ctx.drawImage(logo, logoX, logoY, logoW, logoH);
      ctx.restore();
      if (selected) {
        ctx.strokeStyle = "#3B7BF8";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(logoX, logoY, logoW, logoH);
        ctx.setLineDash([]);
        const corners: [number, number][] = [
          [logoX, logoY],
          [logoX + logoW, logoY],
          [logoX, logoY + logoH],
          [logoX + logoW, logoY + logoH],
        ];
        ctx.fillStyle = "#3B7BF8";
        for (const [cx, cy] of corners) {
          ctx.fillRect(cx - HANDLE / 2, cy - HANDLE / 2, HANDLE, HANDLE);
        }
      }
    }
    const outside =
      hasLogo &&
      !rectFullyInside(logoX, logoY, logoW, logoH, zone);
    if (outsideRef.current !== outside) {
      outsideRef.current = outside;
      onOutsidePrintZoneChange(outside);
    }
  }, [
    canvasHeight,
    canvasWidth,
    hasLogo,
    logoH,
    logoW,
    logoX,
    logoY,
    onOutsidePrintZoneChange,
    opacityPct,
    selected,
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
  }, [draw, scheduleDraw]);

  function clientToCanvas(clientX: number, clientY: number) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { mx: 0, my: 0 };
    return {
      mx: ((clientX - rect.left) / rect.width) * canvasWidth,
      my: ((clientY - rect.top) / rect.height) * canvasHeight,
    };
  }

  function hitCorner(mx: number, my: number): Corner | null {
    const pts: [Corner, number, number][] = [
      ["nw", logoX, logoY],
      ["ne", logoX + logoW, logoY],
      ["sw", logoX, logoY + logoH],
      ["se", logoX + logoW, logoY + logoH],
    ];
    for (const [name, cx, cy] of pts) {
      if (Math.abs(mx - cx) <= HANDLE && Math.abs(my - cy) <= HANDLE) {
        return name;
      }
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

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const { mx, my } = clientToCanvas(e.clientX, e.clientY);
    if (hasLogo && logoImgRef.current) {
      const corner = selected ? hitCorner(mx, my) : null;
      if (corner) {
        const { ax, ay } = anchorForCorner(corner, logoX, logoY, logoW, logoH);
        dragRef.current = { type: "resize", corner, anchorX: ax, anchorY: ay };
        (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
        return;
      }
      if (mx >= logoX && mx <= logoX + logoW && my >= logoY && my <= logoY + logoH) {
        dragRef.current = { type: "move", offX: mx - logoX, offY: my - logoY };
        setSelected(true);
        (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
        return;
      }
    }
    setSelected(false);
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const d = dragRef.current;
    if (!d) return;
    const { mx, my } = clientToCanvas(e.clientX, e.clientY);
    if (d.type === "move") {
      setLogoX(mx - d.offX);
      setLogoY(my - d.offY);
    } else {
      const { anchorX, anchorY, corner } = d;
      let w = 20;
      let nx = anchorX;
      let ny = anchorY;
      if (corner === "se") {
        w = Math.max(20, mx - anchorX);
        const h = w * aspect;
        nx = anchorX;
        ny = anchorY;
        setLogoW(w);
        setLogoH(h);
        setLogoX(nx);
        setLogoY(ny);
      } else if (corner === "nw") {
        w = Math.max(20, anchorX - mx);
        const h = w * aspect;
        nx = anchorX - w;
        ny = anchorY - h;
        setLogoW(w);
        setLogoH(h);
        setLogoX(nx);
        setLogoY(ny);
      } else if (corner === "ne") {
        w = Math.max(20, mx - anchorX);
        const h = w * aspect;
        nx = anchorX;
        ny = anchorY - h;
        setLogoW(w);
        setLogoH(h);
        setLogoX(nx);
        setLogoY(ny);
      } else {
        w = Math.max(20, anchorX - mx);
        const h = w * aspect;
        nx = anchorX - w;
        ny = anchorY;
        setLogoW(w);
        setLogoH(h);
        setLogoX(nx);
        setLogoY(ny);
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

  function onDoubleClick(e: React.PointerEvent<HTMLCanvasElement>) {
    const { mx, my } = clientToCanvas(e.clientX, e.clientY);
    if (!hasLogo) return;
    if (mx >= logoX && mx <= logoX + logoW && my >= logoY && my <= logoY + logoH) {
      setSelected(true);
      scheduleDraw();
    }
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
      onDoubleClick={onDoubleClick}
    />
  );
}

export function downloadCanvasPreview(
  canvas: HTMLCanvasElement | null,
  styleNumber: string
) {
  if (!canvas) return;
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = `preview-${styleNumber || "garment"}.png`;
  a.click();
}
