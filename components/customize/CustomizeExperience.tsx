"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  LogoCompositor,
  downloadCanvasPreview,
  type GarmentKind,
} from "@/components/customize/LogoCompositor";
import { SANMAR_SEED_PRODUCTS, type SanMarSeedCategory } from "@/lib/data/sanmar-seed";
import { colorNameToHex } from "@/lib/catalog/color-map";
import { getGarmentImageUrls } from "@/lib/catalog/garment-images";

const UI_CATEGORIES: { label: string; seed: SanMarSeedCategory; slug: string }[] = [
  { label: "T-Shirts", seed: "T-Shirts", slug: "t-shirts" },
  { label: "Hoodies", seed: "Hoodies", slug: "hoodies-sweatshirts" },
  { label: "Polos", seed: "Polos", slug: "polos" },
  { label: "Jerseys", seed: "Jerseys", slug: "jerseys" },
  { label: "Hats", seed: "Hats", slug: "hats" },
];

const ACCEPT = ".png,.jpg,.jpeg,.svg,.webp";
const MAX_BYTES = 5 * 1024 * 1024;

export function CustomizeExperience() {
  const searchParams = useSearchParams();
  const compositorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const resetRef = useRef<(() => void) | null>(null);

  const [categorySlug, setCategorySlug] = useState<string>(UI_CATEGORIES[0].slug);
  const seedCategory = useMemo(
    () => UI_CATEGORIES.find((c) => c.slug === categorySlug)?.seed ?? "T-Shirts",
    [categorySlug]
  );

  const stylesInCategory = useMemo(
    () => SANMAR_SEED_PRODUCTS.filter((p) => p.category === seedCategory),
    [seedCategory]
  );

  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const selectedProduct = useMemo(
    () =>
      stylesInCategory.find(
        (p) => p.style_number.toUpperCase() === (selectedStyle ?? "").toUpperCase()
      ) ?? null,
    [selectedStyle, stylesInCategory]
  );

  const [view, setView] = useState<"front" | "back">("front");
  const [colorName, setColorName] = useState<string>("");
  const [sizePct, setSizePct] = useState(32);
  const [opacityPct, setOpacityPct] = useState(100);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoW, setLogoW] = useState(400);
  const [logoH, setLogoH] = useState(400);
  const [outsideZone, setOutsideZone] = useState(false);
  const [canvasW, setCanvasW] = useState(500);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => {
      const mobile = mq.matches;
      setCanvasW(mobile ? Math.min(360, window.innerWidth - 32) : 500);
    };
    apply();
    mq.addEventListener("change", apply);
    window.addEventListener("resize", apply);
    return () => {
      mq.removeEventListener("change", apply);
      window.removeEventListener("resize", apply);
    };
  }, []);

  const canvasH = canvasW < 420 ? 340 : 600;

  useEffect(() => {
    const style = searchParams.get("style");
    const cat = searchParams.get("category");
    if (cat && UI_CATEGORIES.some((c) => c.slug === cat)) {
      setCategorySlug(cat);
    }
    if (style) {
      setSelectedStyle(style.trim().toUpperCase());
    }
  }, [searchParams]);

  useEffect(() => {
    if (!selectedProduct) return;
    const first = selectedProduct.available_colors[0] ?? "Black";
    setColorName(first);
  }, [selectedProduct]);

  const fillHex = colorNameToHex(colorName || "Black");
  const garmentKind: GarmentKind =
    selectedProduct?.category === "Hats" ? "cap" : "torso";
  const urls = selectedProduct
    ? getGarmentImageUrls(selectedProduct.style_number)
    : { front: null, back: null };
  const raster = view === "front" ? urls.front : urls.back;

  const onFile = useCallback((file: File | null) => {
    if (!file) return;
    if (file.size > MAX_BYTES) {
      alert("Logo must be 5MB or smaller.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result ?? "");
      const img = new Image();
      img.onload = () => {
        setLogoW(img.naturalWidth || 400);
        setLogoH(img.naturalHeight || 400);
        setLogoUrl(url);
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  }, []);

  const onCanvasReady = useCallback((el: HTMLCanvasElement) => {
    compositorCanvasRef.current = el;
  }, []);

  const garmentTypeParam = categorySlug;

  const quoteHref = selectedProduct
    ? `/request-a-quote?style=${encodeURIComponent(selectedProduct.style_number)}&garment=${encodeURIComponent(garmentTypeParam)}`
    : "/request-a-quote";

  const teamHref = selectedProduct
    ? `/team-orders?style=${encodeURIComponent(selectedProduct.style_number)}`
    : "/team-orders";

  return (
    <div className="min-h-screen bg-[#0F1521] text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <header className="mb-10 text-center md:text-left">
          <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-white md:text-4xl">
            Preview Your Logo
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[#8A94A6] md:mx-0 md:text-base">
            Upload your logo and see how it looks on any garment before you order.
          </p>
        </header>

        <div className="mb-6 space-y-3 lg:hidden">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#8A94A6]">
            Category
          </p>
          <div className="-mx-1 flex gap-2 overflow-x-auto pb-2">
            {UI_CATEGORIES.map((c) => {
              const active = c.slug === categorySlug;
              return (
                <button
                  key={`m-${c.slug}`}
                  type="button"
                  onClick={() => {
                    setCategorySlug(c.slug);
                    setSelectedStyle(null);
                  }}
                  className={
                    active
                      ? "shrink-0 rounded-full border border-[#3B7BF8] bg-[#3B7BF8]/10 px-4 py-2 text-sm font-semibold text-white"
                      : "shrink-0 rounded-full border border-[#2A3347] bg-[#1C2333] px-4 py-2 text-sm font-medium text-[#8A94A6] transition-colors hover:bg-[#2A3347] hover:text-white"
                  }
                >
                  {c.label}
                </button>
              );
            })}
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#8A94A6]">
            Styles
          </p>
          <div className="-mx-1 flex gap-2 overflow-x-auto pb-1">
            {stylesInCategory.map((p) => {
              const active =
                p.style_number.toUpperCase() === (selectedStyle ?? "").toUpperCase();
              return (
                <button
                  key={`mh-${p.style_number}`}
                  type="button"
                  onClick={() => setSelectedStyle(p.style_number.toUpperCase())}
                  className={
                    active
                      ? "shrink-0 rounded-lg border border-[#3B7BF8] bg-[#3B7BF8]/10 px-3 py-2 text-left"
                      : "shrink-0 rounded-lg border border-[#2A3347] bg-[#1C2333] px-3 py-2 text-left text-[#8A94A6]"
                  }
                >
                  <span className="block font-mono text-[10px] text-[#8A94A6]">
                    {p.style_number}
                  </span>
                  <span className="mt-0.5 block max-w-[140px] truncate text-xs font-semibold text-white">
                    {p.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <aside className="hidden w-full shrink-0 lg:block lg:max-w-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#8A94A6]">
              Category
            </p>
            <div className="-mx-1 flex gap-2 overflow-x-auto pb-2 md:mx-0 md:flex-wrap">
              {UI_CATEGORIES.map((c) => {
                const active = c.slug === categorySlug;
                return (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => {
                      setCategorySlug(c.slug);
                      setSelectedStyle(null);
                    }}
                    className={
                      active
                        ? "shrink-0 rounded-full border border-[#3B7BF8] bg-[#3B7BF8]/10 px-4 py-2 text-sm font-semibold text-white"
                        : "shrink-0 rounded-full border border-[#2A3347] bg-[#1C2333] px-4 py-2 text-sm font-medium text-[#8A94A6] transition-colors hover:border-[#2A3347] hover:bg-[#2A3347] hover:text-white"
                    }
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>

            <p className="mb-3 mt-8 text-xs font-semibold uppercase tracking-wide text-[#8A94A6]">
              Styles
            </p>
            <div className="grid max-h-[520px] gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-1">
              {stylesInCategory.map((p) => {
                const active =
                  p.style_number.toUpperCase() ===
                  (selectedStyle ?? "").toUpperCase();
                return (
                  <button
                    key={p.style_number}
                    type="button"
                    onClick={() => setSelectedStyle(p.style_number.toUpperCase())}
                    className={
                      active
                        ? "rounded-xl border border-[#3B7BF8] bg-[#3B7BF8]/10 p-4 text-left transition-colors"
                        : "rounded-xl border border-[#2A3347] bg-[#1C2333] p-4 text-left transition-colors hover:border-[#2A3347] hover:bg-[#2A3347]"
                    }
                  >
                    <p className="font-mono text-xs text-[#8A94A6]">
                      {p.style_number}
                    </p>
                    <p className="mt-1 font-display text-sm font-semibold text-white">
                      {p.name}
                    </p>
                    <p className="mt-1 text-xs text-[#8A94A6]">{p.brand}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.available_colors.slice(0, 6).map((col) => (
                        <span
                          key={col}
                          className="h-4 w-4 rounded-full border border-[#2A3347]"
                          style={{ backgroundColor: colorNameToHex(col) }}
                          title={col}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="min-w-0 flex-1 space-y-6">
            <div className="rounded-xl border border-[#2A3347] bg-[#1C2333] p-4 md:p-6">
              {hydrated && (
                <LogoCompositor
                  onCanvasReady={onCanvasReady}
                  canvasWidth={canvasW}
                  canvasHeight={canvasH}
                  garmentKind={garmentKind}
                  view={view}
                  fillHex={fillHex}
                  garmentRasterUrl={raster}
                  logoSrc={logoUrl}
                  logoNaturalWidth={logoW}
                  logoNaturalHeight={logoH}
                  hasLogo={Boolean(logoUrl)}
                  sizePct={sizePct}
                  opacityPct={opacityPct}
                  onOutsidePrintZoneChange={setOutsideZone}
                  onRegisterReset={(fn) => {
                    resetRef.current = fn;
                  }}
                />
              )}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setView("front")}
                  className={
                    view === "front"
                      ? "rounded-lg border border-[#3B7BF8] bg-[#3B7BF8]/10 px-4 py-2 text-sm font-semibold text-white"
                      : "rounded-lg border border-[#2A3347] bg-[#1C2333] px-4 py-2 text-sm font-medium text-[#8A94A6] transition-colors hover:bg-[#2A3347] hover:text-white"
                  }
                >
                  Front
                </button>
                <button
                  type="button"
                  onClick={() => setView("back")}
                  className={
                    view === "back"
                      ? "rounded-lg border border-[#3B7BF8] bg-[#3B7BF8]/10 px-4 py-2 text-sm font-semibold text-white"
                      : "rounded-lg border border-[#2A3347] bg-[#1C2333] px-4 py-2 text-sm font-medium text-[#8A94A6] transition-colors hover:bg-[#2A3347] hover:text-white"
                  }
                >
                  Back
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div
              className="block rounded-xl border border-[#2A3347] bg-[#1C2333] p-4"
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) onFile(f);
              }}
            >
                <span className="text-sm font-medium text-white">Logo upload</span>
                <p className="mt-1 text-xs text-[#8A94A6]">
                  PNG with transparent background works best · max 5MB
                </p>
                <input
                  type="file"
                  accept={ACCEPT}
                  className="mt-3 block w-full text-sm text-[#8A94A6] file:mr-3 file:rounded-lg file:border-0 file:bg-[#3B7BF8] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                  onChange={(e) => onFile(e.target.files?.[0] ?? null)}
                />
              </div>
              <div className="space-y-4 rounded-xl border border-[#2A3347] bg-[#1C2333] p-4">
                <div>
                  <div className="flex justify-between text-sm text-[#8A94A6]">
                    <span>Size</span>
                    <span>{sizePct}% of garment width</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={60}
                    value={sizePct}
                    onChange={(e) => setSizePct(Number(e.target.value))}
                    className="mt-2 w-full accent-[#3B7BF8]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm text-[#8A94A6]">
                    <span>Opacity</span>
                    <span>{opacityPct}%</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={100}
                    value={opacityPct}
                    onChange={(e) => setOpacityPct(Number(e.target.value))}
                    className="mt-2 w-full accent-[#3B7BF8]"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => resetRef.current?.()}
                    className="rounded-lg border border-[#2A3347] bg-[#1C2333] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2A3347]"
                  >
                    Reset position
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      downloadCanvasPreview(
                        compositorCanvasRef.current,
                        selectedProduct?.style_number ?? "preview"
                      );
                    }}
                    className="rounded-lg border border-[#2A3347] bg-[#1C2333] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2A3347]"
                  >
                    Download preview
                  </button>
                </div>
              </div>
            </div>

            {outsideZone && logoUrl ? (
              <p className="text-sm text-amber-300/90">
                Logo may be outside the standard print area
              </p>
            ) : null}

            {selectedProduct ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8A94A6]">
                  Garment color
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.available_colors.map((c) => {
                    const active = c === colorName;
                    return (
                      <button
                        key={c}
                        type="button"
                        title={c}
                        onClick={() => setColorName(c)}
                        className={
                          active
                            ? "h-9 w-9 rounded-full border border-[#2A3347] ring-2 ring-[#3B7BF8] ring-offset-2 ring-offset-[#0F1521]"
                            : "h-9 w-9 rounded-full border border-[#2A3347] transition hover:ring-2 hover:ring-[#3B7BF8]/40 hover:ring-offset-2 hover:ring-offset-[#0F1521]"
                        }
                        style={{ backgroundColor: colorNameToHex(c) }}
                      />
                    );
                  })}
                </div>
              </>
            ) : null}

            <div className="rounded-xl border border-[#2A3347] bg-[#1C2333] p-6">
              <p className="font-display text-lg font-semibold text-white">
                {selectedProduct
                  ? `Ready to order ${selectedProduct.name}?`
                  : "Ready to start your order?"}
              </p>
              {selectedProduct ? (
                <p className="mt-2 text-sm text-[#8A94A6]">
                  Style #{selectedProduct.style_number} — {selectedProduct.brand}
                </p>
              ) : null}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={quoteHref}
                  className="inline-flex items-center justify-center rounded-lg bg-[#3B7BF8] px-5 py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Request a Quote
                </Link>
                <Link
                  href={teamHref}
                  className="inline-flex items-center justify-center rounded-lg border border-[#2A3347] bg-[#1C2333] px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#2A3347]"
                >
                  Start a Team Order
                </Link>
              </div>
              <p className="mt-4 text-xs text-[#8A94A6]">
                Share your logo and style number when you reach out — we&apos;ll take it from there.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
