import type { GarmentSvgKind } from "@/lib/customize/design-types";

const STROKE = "#2A3347";
const SHADE = "rgba(15,21,33,0.18)";

function encodeSvg(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const dataUrlCache = new Map<string, string>();

export function getCachedGarmentDataUrl(
  key: string,
  factory: () => string
): string {
  const hit = dataUrlCache.get(key);
  if (hit) return hit;
  const v = factory();
  dataUrlCache.set(key, v);
  return v;
}

function printZone(
  x: number,
  y: number,
  w: number,
  h: number,
  show: boolean
): string {
  if (!show) return "";
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="none" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="7 6" opacity="0.55"/>`;
}

function tshirtFront(fill: string, showPrint: boolean): string {
  const zone = printZone(78, 118, 144, 118, showPrint);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
  <defs>
    <linearGradient id="sh" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${SHADE}"/>
      <stop offset="100%" stop-color="transparent"/>
    </linearGradient>
  </defs>
  <path fill="${fill}" stroke="${STROKE}" stroke-width="2"
    d="M78 86 C92 58 118 48 150 48 C182 48 208 58 222 86 L268 112 L252 138 L218 124 L218 332 C218 352 200 366 178 366 L122 366 C100 366 82 352 82 332 L82 124 L48 138 L32 112 Z"/>
  <path fill="url(#sh)" d="M78 86 C92 58 118 48 150 48 C182 48 208 58 222 86 L268 112 L252 138 L218 124 L218 332 C218 352 200 366 178 366 L122 366 C100 366 82 352 82 332 L82 124 L48 138 L32 112 Z" opacity="0.35"/>
  <path fill="none" stroke="${STROKE}" stroke-width="1.4" opacity="0.45"
    d="M118 86 C128 74 140 68 150 68 C160 68 172 74 182 86"/>
  ${zone}
</svg>`;
}

function tshirtBack(fill: string, showPrint: boolean): string {
  const zone = printZone(84, 102, 132, 120, showPrint);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
  <path fill="${fill}" stroke="${STROKE}" stroke-width="2"
    d="M78 86 C92 58 118 48 150 48 C182 48 208 58 222 86 L268 112 L252 138 L218 124 L218 332 C218 352 200 366 178 366 L122 366 C100 366 82 352 82 332 L82 124 L48 138 L32 112 Z"/>
  <path fill="rgba(15,21,33,0.12)" d="M118 120 L182 120 L176 300 L124 300 Z" opacity="0.35"/>
  ${zone}
</svg>`;
}

function hoodieFront(fill: string, showPrint: boolean): string {
  const zone = printZone(74, 150, 152, 120, showPrint);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
  <path fill="${fill}" stroke="${STROKE}" stroke-width="2"
    d="M70 118 C86 70 118 52 150 52 C182 52 214 70 230 118 L276 146 L258 176 L222 158 L222 334 C222 354 204 368 182 368 L118 368 C96 368 78 354 78 334 L78 158 L42 176 L24 146 Z"/>
  <path fill="none" stroke="${STROKE}" stroke-width="1.6" opacity="0.55"
    d="M118 92 C128 64 140 56 150 56 C160 56 172 64 182 92"/>
  <path fill="rgba(15,21,33,0.12)" stroke="${STROKE}" stroke-width="1.2"
    d="M112 210 L188 210 L182 286 L118 286 Z" opacity="0.55"/>
  <path stroke="${STROKE}" stroke-width="1.2" fill="none" opacity="0.55"
    d="M132 132 L168 132 M150 132 L150 168"/>
  ${zone}
</svg>`;
}

function hoodieBack(fill: string, showPrint: boolean): string {
  const zone = printZone(84, 118, 132, 124, showPrint);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
  <path fill="${fill}" stroke="${STROKE}" stroke-width="2"
    d="M70 118 C86 70 118 52 150 52 C182 52 214 70 230 118 L276 146 L258 176 L222 158 L222 334 C222 354 204 368 182 368 L118 368 C96 368 78 354 78 334 L78 158 L42 176 L24 146 Z"/>
  <path fill="rgba(15,21,33,0.12)" d="M118 96 C128 78 140 72 150 72 C160 72 172 78 182 96 L188 118 L112 118 Z" opacity="0.35"/>
  ${zone}
</svg>`;
}

function poloFront(fill: string, showPrint: boolean): string {
  const zone = printZone(82, 128, 136, 96, showPrint);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
  <path fill="${fill}" stroke="${STROKE}" stroke-width="2"
    d="M82 96 C96 66 122 56 150 56 C178 56 204 66 218 96 L262 124 L246 150 L214 134 L214 330 C214 350 198 364 176 364 L124 364 C102 364 86 350 86 330 L86 134 L54 150 L38 124 Z"/>
  <path fill="none" stroke="${STROKE}" stroke-width="1.4" d="M138 96 L162 96 L158 150 L142 150 Z"/>
  <circle cx="146" cy="112" r="2" fill="${STROKE}" opacity="0.55"/>
  <circle cx="154" cy="112" r="2" fill="${STROKE}" opacity="0.55"/>
  <circle cx="150" cy="120" r="2" fill="${STROKE}" opacity="0.55"/>
  ${zone}
</svg>`;
}

function poloBack(fill: string, showPrint: boolean): string {
  const zone = printZone(84, 118, 132, 110, showPrint);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
  <path fill="${fill}" stroke="${STROKE}" stroke-width="2"
    d="M82 96 C96 66 122 56 150 56 C178 56 204 66 218 96 L262 124 L246 150 L214 134 L214 330 C214 350 198 364 176 364 L124 364 C102 364 86 350 86 330 L86 134 L54 150 L38 124 Z"/>
  <path fill="none" stroke="${STROKE}" stroke-width="1.6" opacity="0.55"
    d="M118 96 C128 84 140 80 150 80 C160 80 172 84 182 96"/>
  ${zone}
</svg>`;
}

function jerseyFront(fill: string, showPrint: boolean): string {
  const zone = printZone(76, 124, 148, 120, showPrint);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
  <path fill="${fill}" stroke="${STROKE}" stroke-width="2"
    d="M76 104 C90 72 118 60 150 60 C182 60 210 72 224 104 L270 132 L252 162 L218 146 L218 334 C218 354 200 368 178 368 L122 368 C100 368 82 354 82 334 L82 146 L48 162 L30 132 Z"/>
  <path fill="none" stroke="${STROKE}" stroke-width="1.4" opacity="0.55"
    d="M132 86 L168 86 L162 118 L138 118 Z"/>
  ${zone}
</svg>`;
}

function jerseyBack(fill: string, showPrint: boolean): string {
  const zone = printZone(70, 108, 160, 150, showPrint);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
  <path fill="${fill}" stroke="${STROKE}" stroke-width="2"
    d="M76 104 C90 72 118 60 150 60 C182 60 210 72 224 104 L270 132 L252 162 L218 146 L218 334 C218 354 200 368 178 368 L122 368 C100 368 82 354 82 334 L82 146 L48 162 L30 132 Z"/>
  <rect x="118" y="128" width="64" height="18" rx="4" fill="rgba(15,21,33,0.12)" stroke="${STROKE}" stroke-width="1" opacity="0.55"/>
  <rect x="132" y="168" width="36" height="52" rx="6" fill="rgba(15,21,33,0.12)" stroke="${STROKE}" stroke-width="1" opacity="0.55"/>
  ${zone}
</svg>`;
}

/** Baseball cap — front + side-style profile for back */
function capFront(fill: string, showPrint: boolean): string {
  const zone = printZone(86, 118, 128, 86, showPrint);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" width="300" height="200">
  <path fill="${fill}" stroke="${STROKE}" stroke-width="2"
    d="M54 132 C54 78 96 44 150 44 C204 44 246 78 246 132 L246 140 C204 120 96 120 54 140 Z"/>
  <path fill="${fill}" stroke="${STROKE}" stroke-width="1.8"
    d="M54 132 C96 112 204 112 246 132 L262 138 C210 118 90 118 38 138 Z"/>
  <path fill="rgba(15,21,33,0.12)" d="M96 96 C118 78 182 78 204 96 L210 112 L90 112 Z" opacity="0.35"/>
  <path stroke="${STROKE}" stroke-width="1.2" fill="none" opacity="0.45"
    d="M118 132 C128 124 172 124 182 132"/>
  ${zone}
</svg>`;
}

function capBack(fill: string, showPrint: boolean): string {
  const zone = printZone(92, 96, 116, 70, showPrint);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" width="300" height="200">
  <path fill="${fill}" stroke="${STROKE}" stroke-width="2"
    d="M60 120 C60 74 100 46 150 46 C200 46 240 74 240 120 L240 132 C200 118 100 118 60 132 Z"/>
  <rect x="132" y="124" width="36" height="28" rx="6" fill="${fill}" stroke="${STROKE}" stroke-width="1.2"/>
  <path fill="none" stroke="${STROKE}" stroke-width="1.2" opacity="0.55"
    d="M132 124 C140 118 160 118 168 124"/>
  ${zone}
</svg>`;
}

function buildSvg(kind: GarmentSvgKind, view: "front" | "back", fill: string, showPrint: boolean): string {
  switch (kind) {
    case "hoodie":
      return view === "front" ? hoodieFront(fill, showPrint) : hoodieBack(fill, showPrint);
    case "polo":
      return view === "front" ? poloFront(fill, showPrint) : poloBack(fill, showPrint);
    case "jersey":
      return view === "front" ? jerseyFront(fill, showPrint) : jerseyBack(fill, showPrint);
    case "cap":
      return view === "front" ? capFront(fill, showPrint) : capBack(fill, showPrint);
    default:
      return view === "front" ? tshirtFront(fill, showPrint) : tshirtBack(fill, showPrint);
  }
}

export function buildGarmentPlaceholderDataUrl(
  kind: GarmentSvgKind | "torso" | "cap",
  view: "front" | "back",
  fillHex: string,
  showPrintZone: boolean
): string {
  const mapped: GarmentSvgKind =
    kind === "torso" ? "tshirt" : kind === "cap" ? "cap" : kind;
  const key = `${mapped}|${view}|${fillHex}|${showPrintZone ? 1 : 0}`;
  return getCachedGarmentDataUrl(key, () =>
    encodeSvg(buildSvg(mapped, view, fillHex, showPrintZone))
  );
}
