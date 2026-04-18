export type GarmentPlaceholderKind = "torso" | "cap";

function encodeSvg(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function torsoFront(fill: string, showPrintZone: boolean): string {
  const zone = showPrintZone
    ? `<rect x="48" y="72" width="104" height="58" rx="6" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="5 5" opacity="0.65"/>`
    : "";
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260" width="200" height="260">
  <path fill="${fill}" stroke="#2A3347" stroke-width="1.5"
    d="M52 38 C72 22 128 22 148 38 L188 78 L178 92 L158 84 L158 238 C158 246 150 252 140 252 L60 252 C50 252 42 246 42 238 L42 84 L22 92 L12 78 Z"/>
  <path fill="none" stroke="#2A3347" stroke-width="1.2" opacity="0.35" d="M70 84 L130 84"/>
  ${zone}
</svg>`;
}

function torsoBack(fill: string, showPrintZone: boolean): string {
  const zone = showPrintZone
    ? `<rect x="52" y="58" width="96" height="52" rx="6" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="5 5" opacity="0.65"/>`
    : "";
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260" width="200" height="260">
  <path fill="${fill}" stroke="#2A3347" stroke-width="1.5"
    d="M52 38 C72 22 128 22 148 38 L188 78 L178 92 L158 84 L158 238 C158 246 150 252 140 252 L60 252 C50 252 42 246 42 238 L42 84 L22 92 L12 78 Z"/>
  ${zone}
</svg>`;
}

function capFront(fill: string, showPrintZone: boolean): string {
  const zone = showPrintZone
    ? `<ellipse cx="100" cy="88" rx="42" ry="28" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="5 5" opacity="0.65"/>`
    : "";
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <path fill="${fill}" stroke="#2A3347" stroke-width="1.5"
    d="M28 118 Q28 52 100 44 Q172 52 172 118 L172 124 Q100 108 28 124 Z"/>
  <path fill="${fill}" stroke="#2A3347" stroke-width="1.2" d="M28 118 Q100 132 172 118 L178 128 Q100 150 22 128 Z"/>
  ${zone}
</svg>`;
}

function capBack(fill: string, showPrintZone: boolean): string {
  const zone = showPrintZone
    ? `<rect x="58" y="62" width="84" height="44" rx="8" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="5 5" opacity="0.65"/>`
    : "";
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <path fill="${fill}" stroke="#2A3347" stroke-width="1.5"
    d="M32 112 Q32 56 100 48 Q168 56 168 112 L168 126 Q100 140 32 126 Z"/>
  <rect x="78" y="118" width="44" height="36" rx="6" fill="${fill}" stroke="#2A3347" stroke-width="1.2"/>
  ${zone}
</svg>`;
}

export function buildGarmentPlaceholderDataUrl(
  kind: GarmentPlaceholderKind,
  view: "front" | "back",
  fillHex: string,
  showPrintZone: boolean
): string {
  const fill = fillHex;
  let svg: string;
  if (kind === "cap") {
    svg = view === "front" ? capFront(fill, showPrintZone) : capBack(fill, showPrintZone);
  } else {
    svg = view === "front" ? torsoFront(fill, showPrintZone) : torsoBack(fill, showPrintZone);
  }
  return encodeSvg(svg);
}
