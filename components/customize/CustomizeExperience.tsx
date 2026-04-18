
"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  LogoCompositor,
  downloadCanvasPreview,
} from "@/components/customize/LogoCompositor";
import { SANMAR_SEED_PRODUCTS, type SanMarSeedCategory, type SanMarSeedProduct } from "@/lib/data/sanmar-seed";
import { colorNameToHex } from "@/lib/catalog/color-map";
import { getGarmentImageUrls, getGarmentMockupUrl } from "@/lib/catalog/garment-images";
import { buildGarmentPlaceholderDataUrl } from "@/lib/catalog/garment-placeholder";
import {
  FONT_OPTIONS,
  INK_SWATCHES,
  seedCategoryToGarmentKind,
  type DesignElement,
} from "@/lib/customize/design-types";
import { printZoneOnCanvas } from "@/lib/customize/canvas-print-zone";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/lib/supabase/client";
import {
  deleteSavedDesign,
  listSavedDesigns,
  loadSavedDesign,
  saveDesign,
  type SavedDesignRow,
} from "@/lib/actions/saved-designs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, EyeOff, Trash2, GripVertical, ChevronUp, ChevronDown, Copy } from "lucide-react";

const UI_CATEGORIES: { label: string; seed: SanMarSeedCategory; slug: string }[] = [
  { label: "T-Shirts", seed: "T-Shirts", slug: "t-shirts" },
  { label: "Hoodies", seed: "Hoodies", slug: "hoodies-sweatshirts" },
  { label: "Polos", seed: "Polos", slug: "polos" },
  { label: "Jerseys", seed: "Jerseys", slug: "jerseys" },
  { label: "Hats", seed: "Hats", slug: "hats" },
];

const ACCEPT = ".png,.jpg,.jpeg,.svg,.webp";
const MAX_BYTES = 5 * 1024 * 1024;

function styleCardThumbSrc(
  p: SanMarSeedProduct,
  selectedStyle: string | null,
  colorNameForSelection: string
): string {
  const urls = getGarmentImageUrls(p.style_number);
  if (urls.front) return urls.front;
  const kind = seedCategoryToGarmentKind(p.category);
  const active = p.style_number.toUpperCase() === (selectedStyle ?? "").toUpperCase();
  const colorName = active ? colorNameForSelection : p.available_colors[0] ?? "Black";
  const fill = colorNameToHex(colorName || "Black");
  return buildGarmentPlaceholderDataUrl(kind, "front", fill, true);
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("read failed"));
    reader.readAsDataURL(file);
  });
}

function newImageElement(
  src: string,
  naturalW: number,
  naturalH: number,
  zone: { x: number; y: number; w: number; h: number }
): DesignElement {
  const aspect = naturalW > 0 ? naturalH / naturalW : 1;
  const w = Math.max(40, zone.w * 0.42);
  const h = w * aspect;
  const cx = zone.x + zone.w / 2;
  const cy = zone.y + zone.h / 2;
  return {
    id: crypto.randomUUID(),
    type: "image",
    src,
    x: cx - w / 2,
    y: cy - h / 2,
    width: w,
    height: h,
    rotation: 0,
    opacity: 1,
    visible: true,
  };
}

function newTextElement(zone: { x: number; y: number; w: number; h: number }): DesignElement {
  const fontSize = 56;
  const w = Math.min(zone.w * 0.85, 280);
  const h = fontSize * 1.25 + 16;
  const cx = zone.x + zone.w / 2;
  const cy = zone.y + zone.h / 2;
  return {
    id: crypto.randomUUID(),
    type: "text",
    text: "YOUR TEXT",
    fontFamily: "Bebas Neue",
    color: "#ffffff",
    bold: false,
    letterSpacing: 0,
    fontSize,
    x: cx - w / 2,
    y: cy - h / 2,
    width: w,
    height: h,
    rotation: 0,
    opacity: 1,
    visible: true,
  };
}

function slugFromGarmentCategory(cat: string | null | undefined): string | null {
  if (!cat) return null;
  const hit = UI_CATEGORIES.find((c) => c.slug === cat || c.seed === cat);
  return hit?.slug ?? null;
}

export function CustomizeExperience() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const compositorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
  const [outsideZone, setOutsideZone] = useState(false);
  const [canvasW, setCanvasW] = useState(600);
  const [hydrated, setHydrated] = useState(false);

  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [printGuides, setPrintGuides] = useState(true);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const [user, setUser] = useState<{ id: string } | null>(null);
  const [savedDesigns, setSavedDesigns] = useState<SavedDesignRow[]>([]);
  const [savedDesignId, setSavedDesignId] = useState<string | null>(null);

  const [saveOpen, setSaveOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [saveBusy, setSaveBusy] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => {
      const mobile = mq.matches;
      setCanvasW(mobile ? Math.min(380, window.innerWidth - 32) : 600);
    };
    apply();
    mq.addEventListener("change", apply);
    window.addEventListener("resize", apply);
    return () => {
      mq.removeEventListener("change", apply);
      window.removeEventListener("resize", apply);
    };
  }, []);

  const canvasH = canvasW < 440 ? 420 : 700;

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

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ? { id: data.session.user.id } : null);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUser(session?.user ? { id: session.user.id } : null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const refreshSaved = useCallback(async () => {
    const rows = await listSavedDesigns();
    setSavedDesigns(rows);
  }, []);

  useEffect(() => {
    if (!user) {
      setSavedDesigns([]);
      return;
    }
    void refreshSaved();
  }, [user, refreshSaved]);

  const fillHex = colorNameToHex(colorName || "Black");
  const garmentSvgKind = selectedProduct
    ? seedCategoryToGarmentKind(selectedProduct.category)
    : "tshirt";

  const urls = selectedProduct
    ? getGarmentImageUrls(selectedProduct.style_number)
    : { front: null, back: null };
  const mockup =
    selectedProduct && colorName
      ? getGarmentMockupUrl(selectedProduct.category, view, colorName)
      : null;
  const raster = mockup ?? (view === "front" ? urls.front : urls.back);

  const zone = useMemo(
    () => printZoneOnCanvas(garmentSvgKind, view, canvasW, canvasH),
    [canvasH, canvasW, garmentSvgKind, view]
  );

  const selectedElement = useMemo(
    () => elements.find((e) => e.id === selectedElementId) ?? null,
    [elements, selectedElementId]
  );

  const onCanvasReady = useCallback((el: HTMLCanvasElement) => {
    compositorCanvasRef.current = el;
  }, []);

  const onElementsChange = useCallback((next: DesignElement[]) => {
    setElements(next);
  }, []);

  const addFiles = useCallback(
    async (files: FileList | File[] | null) => {
      if (!files) return;
      const list = Array.from(files as FileList);
      if (!list.length) return;
      const additions: DesignElement[] = [];
      for (const file of list) {
        if (file.size > MAX_BYTES) {
          toast({ title: "File too large", description: `${file.name} must be 5MB or smaller.` });
          continue;
        }
        try {
          const url = await readFileAsDataUrl(file);
          const img = new Image();
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error("bad image"));
            img.src = url;
          });
          additions.push(
            newImageElement(url, img.naturalWidth || 400, img.naturalHeight || 400, zone)
          );
        } catch {
          toast({ title: "Upload failed", description: file.name });
        }
      }
      if (!additions.length) return;
      setElements((prev) => {
        const merged = [...prev, ...additions];
        if (merged.length > 20 && prev.length <= 20) {
          queueMicrotask(() =>
            toast({
              title: "Many elements",
              description: "Designs with many elements may render slowly.",
            })
          );
        }
        return merged;
      });
      const last = additions[additions.length - 1];
      if (last) setSelectedElementId(last.id);
    },
    [toast, zone]
  );

  const addText = useCallback(() => {
    const el = newTextElement(zone);
    setElements((prev) => [...prev, el]);
    setSelectedElementId(el.id);
  }, [zone]);

  const deleteElement = useCallback((id: string) => {
    setElements((prev) => prev.filter((e) => e.id !== id));
    setSelectedElementId((cur) => (cur === id ? null : cur));
  }, []);

  const patchSelected = useCallback(
    (patch: Partial<DesignElement>) => {
      if (!selectedElementId) return;
      setElements((prev) => prev.map((e) => (e.id === selectedElementId ? { ...e, ...patch } : e)));
    },
    [selectedElementId]
  );

  const bringForward = useCallback(() => {
    if (!selectedElementId) return;
    setElements((prev) => {
      const i = prev.findIndex((e) => e.id === selectedElementId);
      if (i === -1 || i === prev.length - 1) return prev;
      const next = [...prev];
      const tmp = next[i + 1];
      next[i + 1] = next[i];
      next[i] = tmp;
      return next;
    });
  }, [selectedElementId]);

  const sendBackward = useCallback(() => {
    if (!selectedElementId) return;
    setElements((prev) => {
      const i = prev.findIndex((e) => e.id === selectedElementId);
      if (i <= 0) return prev;
      const next = [...prev];
      const tmp = next[i - 1];
      next[i - 1] = next[i];
      next[i] = tmp;
      return next;
    });
  }, [selectedElementId]);

  const toggleVisible = useCallback((id: string) => {
    setElements((prev) => prev.map((e) => (e.id === id ? { ...e, visible: !e.visible } : e)));
  }, []);

  const onReorderDrop = useCallback((targetId: string) => {
    if (!draggingId || draggingId === targetId) return;
    setElements((prev) => {
      const from = prev.findIndex((e) => e.id === draggingId);
      const to = prev.findIndex((e) => e.id === targetId);
      if (from === -1 || to === -1) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return copy;
    });
    setDraggingId(null);
  }, [draggingId]);

  const garmentTypeParam = categorySlug;

  const quoteHref = selectedProduct
    ? `/request-a-quote?style=${encodeURIComponent(selectedProduct.style_number)}&garment=${encodeURIComponent(garmentTypeParam)}`
    : "/request-a-quote";

  const teamHref = selectedProduct
    ? `/team-orders?style=${encodeURIComponent(selectedProduct.style_number)}`
    : "/team-orders";

  const defaultSaveName = useMemo(() => {
    const d = new Date();
    const ds = d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    const st = selectedProduct?.style_number ?? "style";
    return `Untitled — ${st} — ${ds}`;
  }, [selectedProduct]);

  const openSaveModal = useCallback(() => {
    if (!user) {
      setLoginOpen(true);
      return;
    }
    setSaveName(defaultSaveName);
    setSaveOpen(true);
  }, [defaultSaveName, user]);

  const performSave = useCallback(async () => {
    if (!user) return;
    const canvas = compositorCanvasRef.current;
    if (!canvas) {
      toast({ title: "Canvas not ready", description: "Try again in a moment." });
      return;
    }
    setSaveBusy(true);
    try {
      const thumb = canvas.toDataURL("image/png");
      const res = await saveDesign({
        id: savedDesignId ?? undefined,
        name: saveName.trim() || defaultSaveName,
        garment_category: categorySlug,
        garment_style_number: selectedProduct?.style_number ?? null,
        garment_color: colorName || null,
        view_mode: view,
        elements,
        thumbnailPngDataUrl: thumb,
      });
      if (!res.ok) {
        toast({ title: "Save failed", description: res.error ?? "Unknown error" });
        return;
      }
      if (res.id) setSavedDesignId(res.id);
      toast({ title: "Design saved" });
      setSaveOpen(false);
      await refreshSaved();
    } finally {
      setSaveBusy(false);
    }
  }, [
    categorySlug,
    colorName,
    defaultSaveName,
    elements,
    refreshSaved,
    saveName,
    savedDesignId,
    selectedProduct,
    toast,
    user,
    view,
  ]);

  const loadDesign = useCallback(
    async (id: string) => {
      const row = await loadSavedDesign(id);
      if (!row) {
        toast({ title: "Could not load design" });
        return;
      }
      const slug = slugFromGarmentCategory(row.garment_category);
      if (slug) setCategorySlug(slug);
      if (row.garment_style_number) setSelectedStyle(row.garment_style_number.toUpperCase());
      if (row.garment_color) setColorName(row.garment_color);
      if (row.view_mode === "front" || row.view_mode === "back") setView(row.view_mode);
      setElements(Array.isArray(row.elements) ? row.elements : []);
      setSelectedElementId(null);
      setSavedDesignId(row.id);
      toast({
        title: "Design loaded",
        description: "Make edits and save again to update.",
      });
    },
    [toast]
  );

  const designParamLoaded = useRef<string | null>(null);
  useEffect(() => {
    const id = searchParams.get("design");
    if (!id || designParamLoaded.current === id) return;
    designParamLoaded.current = id;
    void loadDesign(id);
  }, [loadDesign, searchParams]);

  const duplicateSelected = useCallback(() => {
    if (!selectedElementId) return;
    const src = elements.find((e) => e.id === selectedElementId);
    if (!src) return;
    const copyId = crypto.randomUUID();
    const copy: DesignElement = {
      ...src,
      id: copyId,
      x: src.x + 12,
      y: src.y + 12,
    };
    setElements((prev) => [...prev, copy]);
    setSelectedElementId(copyId);
  }, [elements, selectedElementId]);

  const removeSaved = useCallback(
    async (id: string) => {
      if (!confirm("Delete this saved design?")) return;
      const res = await deleteSavedDesign(id);
      if (!res.ok) {
        toast({ title: "Delete failed", description: res.error });
        return;
      }
      if (savedDesignId === id) setSavedDesignId(null);
      toast({ title: "Design deleted" });
      await refreshSaved();
    },
    [refreshSaved, savedDesignId, toast]
  );


  return (
    <div className="min-h-screen bg-[#0F1521] text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <header className="mb-10 text-center md:text-left">
          <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-white md:text-4xl">
            Preview Your Logo
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[#8A94A6] md:mx-0 md:text-base">
            Upload images, add text, and preview placement before you order.
          </p>
        </header>

        {user ? (
          <section className="mb-10 rounded-xl border border-[#2A3347] bg-[#1C2333] p-4 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
                Your Saved Designs
              </h2>
              <Link href="/portal/designs" className="text-xs font-semibold text-[#3B7BF8] hover:underline">
                View all
              </Link>
            </div>
            {savedDesigns.length === 0 ? (
              <p className="mt-3 text-sm text-[#8A94A6]">
                You haven&apos;t saved any designs yet. Start designing and click Save when you&apos;re ready.
              </p>
            ) : (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {savedDesigns.map((d) => (
                  <div
                    key={d.id}
                    className="w-56 shrink-0 rounded-lg border border-[#2A3347] bg-[#0F1521] p-3"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-[#1C2333]">
                      {d.thumbnail_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={d.thumbnail_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-[#8A94A6]">No preview</div>
                      )}
                    </div>
                    <p className="mt-2 truncate text-sm font-semibold text-white">{d.name}</p>
                    <p className="truncate text-xs text-[#8A94A6]">
                      {(d.garment_category ?? "").replaceAll("-", " ")} · {d.garment_style_number ?? "—"}
                    </p>
                    <p className="text-[10px] text-[#8A94A6]">
                      {new Date(d.updated_at).toLocaleDateString()}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => void loadDesign(d.id)}
                        className="flex-1 rounded-md bg-[#3B7BF8] px-2 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                      >
                        Load
                      </button>
                      <button
                        type="button"
                        onClick={() => void removeSaved(d.id)}
                        className="rounded-md border border-[#2A3347] px-2 py-1.5 text-xs font-semibold text-red-300 hover:bg-[#1C2333]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : null}

                <div className="mb-6 space-y-3 lg:hidden">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#8A94A6]">Category</p>
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
          <p className="text-xs font-semibold uppercase tracking-wide text-[#8A94A6]">Styles</p>
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
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={styleCardThumbSrc(p, selectedStyle, colorName)}
                      alt=""
                      width={80}
                      height={80}
                      className="h-20 w-20 shrink-0 rounded-md border border-[#2A3347] bg-[#0F1521] object-contain"
                    />
                    <div className="min-w-0">
                      <span className="block font-mono text-[10px] text-[#8A94A6]">{p.style_number}</span>
                      <span className="mt-0.5 block max-w-[140px] truncate text-xs font-semibold text-white">
                        {p.name}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <aside className="hidden w-full shrink-0 lg:block lg:max-w-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#8A94A6]">Category</p>
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

            <p className="mb-3 mt-8 text-xs font-semibold uppercase tracking-wide text-[#8A94A6]">Styles</p>
            <div className="grid max-h-[520px] gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-1">
              {stylesInCategory.map((p) => {
                const active =
                  p.style_number.toUpperCase() === (selectedStyle ?? "").toUpperCase();
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
                    <div className="flex gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={styleCardThumbSrc(p, selectedStyle, colorName)}
                        alt=""
                        width={80}
                        height={80}
                        className="h-20 w-20 shrink-0 rounded-md border border-[#2A3347] bg-[#0F1521] object-contain"
                      />
                      <div className="min-w-0">
                        <p className="font-mono text-xs text-[#8A94A6]">{p.style_number}</p>
                        <p className="mt-1 font-display text-sm font-semibold text-white">{p.name}</p>
                        <p className="mt-1 text-xs text-[#8A94A6]">{p.brand}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="min-w-0 flex-1 space-y-6">
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#2A3347] bg-[#1C2333] p-3 md:p-4">
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPT}
                multiple
                className="hidden"
                onChange={(e) => {
                  void addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg border border-[#2A3347] bg-[#0F1521] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2A3347]"
              >
                Add Image
              </button>
              <button
                type="button"
                onClick={addText}
                className="rounded-lg border border-[#2A3347] bg-[#0F1521] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2A3347]"
              >
                Add Text
              </button>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setView("front")}
                  className={
                    view === "front"
                      ? "rounded-lg border border-[#3B7BF8] bg-[#3B7BF8]/10 px-4 py-2 text-sm font-semibold text-white"
                      : "rounded-lg border border-[#2A3347] bg-[#0F1521] px-4 py-2 text-sm font-medium text-[#8A94A6] hover:bg-[#2A3347]"
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
                      : "rounded-lg border border-[#2A3347] bg-[#0F1521] px-4 py-2 text-sm font-medium text-[#8A94A6] hover:bg-[#2A3347]"
                  }
                >
                  Back
                </button>
              </div>
              <button
                type="button"
                onClick={openSaveModal}
                className="ml-auto rounded-lg bg-[#3B7BF8] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Save Design
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-6">
                <div className="rounded-xl border border-[#2A3347] bg-[#1C2333] p-4 md:p-6">
                  {hydrated ? (
                    <LogoCompositor
                      onCanvasReady={onCanvasReady}
                      canvasWidth={canvasW}
                      canvasHeight={canvasH}
                      garmentSvgKind={garmentSvgKind}
                      view={view}
                      fillHex={fillHex}
                      garmentRasterUrl={raster}
                      showGarmentPrintZone={printGuides}
                      showSafeZoneOverlay={printGuides}
                      elements={elements}
                      selectedElementId={selectedElementId}
                      onElementsChange={onElementsChange}
                      onSelectElement={setSelectedElementId}
                      onOutsidePrintZoneChange={setOutsideZone}
                    />
                  ) : null}
                </div>

                {selectedProduct ? (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#8A94A6]">Garment color</p>
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
                                ? "h-8 w-8 rounded-full border border-[#2A3347] ring-2 ring-[#3B7BF8] ring-offset-2 ring-offset-[#1C2333]"
                                : "h-8 w-8 rounded-full border border-[#2A3347] ring-offset-2 ring-offset-[#1C2333] transition hover:ring-2 hover:ring-[#3B7BF8]/50"
                            }
                            style={{ backgroundColor: colorNameToHex(c) }}
                          />
                        );
                      })}
                    </div>
                    <p className="text-sm font-medium text-white">{colorName || "Pick a color"}</p>
                  </>
                ) : null}

                {outsideZone && selectedElement ? (
                  <p className="text-sm text-amber-300/90">Selection may be outside the standard print area.</p>
                ) : null}

                <div
                  className="rounded-xl border border-dashed border-[#2A3347] bg-[#1C2333] p-4"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    void addFiles(e.dataTransfer.files);
                  }}
                >
                  <p className="text-sm font-medium text-white">Drop images here</p>
                  <p className="mt-1 text-xs text-[#8A94A6]">PNG with transparency works best · max 5MB each</p>
                </div>

                <div className="rounded-xl border border-[#2A3347] bg-[#1C2333] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-white">Elements</p>
                    <label className="flex items-center gap-2 text-xs text-[#8A94A6]">
                      <input
                        type="checkbox"
                        checked={printGuides}
                        onChange={(e) => setPrintGuides(e.target.checked)}
                        className="accent-[#3B7BF8]"
                      />
                      Print zone guides
                    </label>
                  </div>
                  <div className="mt-3 space-y-2">
                    {elements.length === 0 ? (
                      <p className="text-sm text-[#8A94A6]">No elements yet — add an image or text.</p>
                    ) : (
                      elements.map((el) => {
                        const active = el.id === selectedElementId;
                        return (
                          <div
                            key={el.id}
                            draggable
                            onDragStart={() => setDraggingId(el.id)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => onReorderDrop(el.id)}
                            className={
                              active
                                ? "flex items-center gap-2 rounded-lg border border-[#3B7BF8] bg-[#0F1521] p-2"
                                : "flex items-center gap-2 rounded-lg border border-[#2A3347] bg-[#0F1521] p-2"
                            }
                          >
                            <GripVertical className="h-4 w-4 shrink-0 text-[#8A94A6]" />
                            <button
                              type="button"
                              onClick={() => setSelectedElementId(el.id)}
                              className="min-w-0 flex-1 text-left text-sm text-white"
                            >
                              <span className="font-semibold">{el.type === "text" ? "Text" : "Image"}</span>{" "}
                              <span className="block truncate text-xs text-[#8A94A6]">
                                {el.type === "text" ? el.text : el.src?.slice(0, 28)}
                              </span>
                            </button>
                            <button
                              type="button"
                              className="rounded-md p-1 text-[#8A94A6] hover:text-white"
                              title={el.visible ? "Hide" : "Show"}
                              onClick={() => toggleVisible(el.id)}
                            >
                              {el.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </button>
                            <button
                              type="button"
                              className="rounded-md p-1 text-red-300 hover:text-red-100"
                              title="Delete"
                              onClick={() => deleteElement(el.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      downloadCanvasPreview(
                        compositorCanvasRef.current,
                        selectedProduct?.style_number ?? "preview"
                      );
                    }}
                    className="rounded-lg border border-[#2A3347] bg-[#1C2333] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2A3347]"
                  >
                    Download preview
                  </button>
                </div>

                <div className="rounded-xl border border-[#2A3347] bg-[#1C2333] p-6">
                  <p className="font-display text-lg font-semibold text-white">
                    {selectedProduct ? `Ready to order ${selectedProduct.name}?` : "Ready to start your order?"}
                  </p>
                  {selectedProduct ? (
                    <p className="mt-2 text-sm text-[#8A94A6]">
                      Style #{selectedProduct.style_number} — {selectedProduct.brand}
                    </p>
                  ) : null}
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={quoteHref}
                      className="inline-flex items-center justify-center rounded-lg bg-[#3B7BF8] px-5 py-3 text-center text-sm font-semibold text-white hover:opacity-90"
                    >
                      Request a Quote
                    </Link>
                    <Link
                      href={teamHref}
                      className="inline-flex items-center justify-center rounded-lg border border-[#2A3347] bg-[#1C2333] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[#2A3347]"
                    >
                      Start a Team Order
                    </Link>
                  </div>
                  <p className="mt-4 text-xs text-[#8A94A6]">
                    Share your logo and style number when you reach out — we&apos;ll take it from there.
                  </p>
                </div>
              </div>

              <aside className="space-y-4 rounded-xl border border-[#2A3347] bg-[#1C2333] p-4 lg:sticky lg:top-6 lg:self-start">
                {!selectedElement ? (
                  <p className="text-sm text-[#8A94A6]">Select an element on the canvas to edit its properties.</p>
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-white">
                        {selectedElement.type === "text" ? "Text" : "Image"}
                      </p>
                      <span className="rounded-full bg-[#0F1521] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#8A94A6]">
                        {selectedElement.type}
                      </span>
                    </div>

                    {selectedElement.type === "text" ? (
                      <div className="space-y-3">
                        <label className="block text-xs text-[#8A94A6]">
                          Text
                          <input
                            className="mt-1 w-full rounded-md border border-[#2A3347] bg-[#0F1521] px-3 py-2 text-sm text-white"
                            value={selectedElement.text ?? ""}
                            onChange={(e) => patchSelected({ text: e.target.value })}
                          />
                        </label>
                        <label className="block text-xs text-[#8A94A6]">
                          Font
                          <select
                            className="mt-1 w-full rounded-md border border-[#2A3347] bg-[#0F1521] px-3 py-2 text-sm text-white"
                            value={selectedElement.fontFamily ?? "Bebas Neue"}
                            onChange={(e) => patchSelected({ fontFamily: e.target.value })}
                          >
                            {FONT_OPTIONS.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <div>
                          <div className="flex justify-between text-xs text-[#8A94A6]">
                            <span>Font size</span>
                            <span>{selectedElement.fontSize ?? 48}px</span>
                          </div>
                          <input
                            type="range"
                            min={20}
                            max={120}
                            value={selectedElement.fontSize ?? 48}
                            onChange={(e) => patchSelected({ fontSize: Number(e.target.value) })}
                            className="mt-2 w-full accent-[#3B7BF8]"
                          />
                        </div>
                        <div>
                          <p className="text-xs text-[#8A94A6]">Ink color</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {INK_SWATCHES.map((sw) => (
                              <button
                                key={sw.name}
                                type="button"
                                title={sw.name}
                                onClick={() => patchSelected({ color: sw.hex })}
                                className={
                                  (selectedElement.color ?? "#fff").toLowerCase() === sw.hex.toLowerCase()
                                    ? "h-7 w-7 rounded-full ring-2 ring-[#3B7BF8] ring-offset-2 ring-offset-[#1C2333]"
                                    : "h-7 w-7 rounded-full ring-1 ring-[#2A3347] hover:ring-[#3B7BF8]/50"
                                }
                                style={{ backgroundColor: sw.hex }}
                              />
                            ))}
                          </div>
                        </div>
                        <label className="flex items-center gap-2 text-sm text-white">
                          <input
                            type="checkbox"
                            checked={Boolean(selectedElement.bold)}
                            onChange={(e) => patchSelected({ bold: e.target.checked })}
                            className="accent-[#3B7BF8]"
                          />
                          Bold
                        </label>
                        <div>
                          <div className="flex justify-between text-xs text-[#8A94A6]">
                            <span>Letter spacing</span>
                            <span>{selectedElement.letterSpacing ?? 0}px</span>
                          </div>
                          <input
                            type="range"
                            min={-4}
                            max={16}
                            step={0.5}
                            value={selectedElement.letterSpacing ?? 0}
                            onChange={(e) => patchSelected({ letterSpacing: Number(e.target.value) })}
                            className="mt-2 w-full accent-[#3B7BF8]"
                          />
                        </div>
                      </div>
                    ) : null}

                    <label className="flex items-center gap-2 text-sm text-white">
                      <input
                        type="checkbox"
                        checked={Boolean(selectedElement.locked)}
                        onChange={(e) => patchSelected({ locked: e.target.checked })}
                        className="accent-[#3B7BF8]"
                      />
                      Lock position
                    </label>

                    <div>
                      <div className="flex justify-between text-xs text-[#8A94A6]">
                        <span>Opacity</span>
                        <span>{Math.round((selectedElement.opacity ?? 1) * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={100}
                        value={Math.round((selectedElement.opacity ?? 1) * 100)}
                        onChange={(e) => patchSelected({ opacity: Number(e.target.value) / 100 })}
                        className="mt-2 w-full accent-[#3B7BF8]"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-[#8A94A6]">
                        <span>Rotation</span>
                        <span>{selectedElement.rotation ?? 0}°</span>
                      </div>
                      <input
                        type="range"
                        min={-180}
                        max={180}
                        value={selectedElement.rotation ?? 0}
                        onChange={(e) => patchSelected({ rotation: Number(e.target.value) })}
                        className="mt-2 w-full accent-[#3B7BF8]"
                      />
                    </div>

                    {selectedElement.type === "image" ? (
                      <div>
                        <div className="flex justify-between text-xs text-[#8A94A6]">
                          <span>Size</span>
                          <span>{Math.round(selectedElement.width)}px wide</span>
                        </div>
                        <input
                          type="range"
                          min={40}
                          max={Math.max(120, Math.round(canvasW * 0.95))}
                          value={Math.round(selectedElement.width)}
                          onChange={(e) => {
                            const w = Number(e.target.value);
                            const aspect =
                              selectedElement.height > 0
                                ? selectedElement.height / selectedElement.width
                                : 1;
                            patchSelected({ width: w, height: w * aspect });
                          }}
                          className="mt-2 w-full accent-[#3B7BF8]"
                        />
                      </div>
                    ) : null}

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={bringForward}
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-[#2A3347] px-2 py-2 text-xs font-semibold text-white hover:bg-[#2A3347]"
                      >
                        <ChevronUp className="h-4 w-4" /> Forward
                      </button>
                      <button
                        type="button"
                        onClick={sendBackward}
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-[#2A3347] px-2 py-2 text-xs font-semibold text-white hover:bg-[#2A3347]"
                      >
                        <ChevronDown className="h-4 w-4" /> Backward
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={duplicateSelected}
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-[#2A3347] px-2 py-2 text-xs font-semibold text-white hover:bg-[#2A3347]"
                      >
                        <Copy className="h-4 w-4" /> Duplicate
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteElement(selectedElement.id)}
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-red-900/40 px-2 py-2 text-xs font-semibold text-red-200 hover:bg-red-950/30"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </>
                )}
              </aside>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="border-[#2A3347] bg-[#1C2333] text-white">
          <DialogHeader>
            <DialogTitle>Sign in to save your design</DialogTitle>
            <DialogDescription className="text-[#8A94A6]">
              Create an account or sign in to store previews and reload them later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg bg-[#3B7BF8] px-4 py-2 text-sm font-semibold text-white"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg border border-[#2A3347] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2A3347]"
            >
              Sign up
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent className="border-[#2A3347] bg-[#1C2333] text-white">
          <DialogHeader>
            <DialogTitle>Save design</DialogTitle>
            <DialogDescription className="text-[#8A94A6]">
              Name your design so you can find it later in your portal.
            </DialogDescription>
          </DialogHeader>
          <label className="block text-sm text-[#8A94A6]">
            Design name
            <input
              className="mt-2 w-full rounded-md border border-[#2A3347] bg-[#0F1521] px-3 py-2 text-sm text-white"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
            />
          </label>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setSaveOpen(false)}
              className="rounded-lg border border-[#2A3347] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2A3347]"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saveBusy}
              onClick={() => void performSave()}
              className="rounded-lg bg-[#3B7BF8] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saveBusy ? "Saving…" : "Save"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
