"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  LogoCompositor,
  downloadCanvasPreview,
} from "@/components/customize/LogoCompositor";
import type { CustomizeProduct } from "@/lib/customize/types";
import { buildGarmentPlaceholderDataUrl } from "@/lib/catalog/garment-placeholder";
import {
  FONT_OPTIONS,
  INK_SWATCHES,
  type DesignElement,
  type GarmentSvgKind,
} from "@/lib/customize/design-types";
import { CUSTOMIZE_CANVAS_BUFFER, zoneInBuffer } from "@/lib/customize/canvas-print-zone";
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
import {
  Eye,
  EyeOff,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Copy,
  Check,
} from "lucide-react";

type UiCategory = "T-Shirts" | "Hoodies" | "Polos" | "Jerseys" | "Hats" | "Other";

const PLACEHOLDER_TINT = "#3a4357";
const SWATCH_FALLBACK_BG = "#3a4357";

function uiCategoryFromSanMar(sanmarCategory: string): UiCategory {
  const s = sanmarCategory.toLowerCase();
  if (s.includes("hat") || s.includes("cap") || s.includes("headwear")) return "Hats";
  if (s.includes("hood") || s.includes("sweat") || s.includes("fleece")) return "Hoodies";
  if (s.includes("polo")) return "Polos";
  if (s.includes("jersey")) return "Jerseys";
  if (s.includes("tee") || s.includes("t-shirt") || s.includes("knit")) return "T-Shirts";
  return "Other";
}

function uiCategoryToGarmentKind(cat: UiCategory): GarmentSvgKind {
  switch (cat) {
    case "Hoodies":
      return "hoodie";
    case "Polos":
      return "polo";
    case "Jerseys":
      return "jersey";
    case "Hats":
      return "cap";
    default:
      return "tshirt";
  }
}

function rasterForView(
  view: "front" | "back",
  product: CustomizeProduct | null,
  catalogColorKey: string
): string | null {
  if (!product) return null;
  const row = product.colors.find((c) => c.catalog_color === catalogColorKey) ?? product.colors[0];
  if (view === "front") {
    return row?.color_product_url ?? product.front_flat_url ?? product.back_flat_url ?? null;
  }
  return row?.color_product_back_url ?? null;
}

function styleCardThumbSrc(
  p: CustomizeProduct,
  selectedStyle: string | null,
  selectedColorKey: string
): string {
  const uiCat = uiCategoryFromSanMar(p.sanmar_category);
  const kind = uiCategoryToGarmentKind(uiCat);
  const active = p.style_number.toUpperCase() === (selectedStyle ?? "").toUpperCase();
  const row = active
    ? p.colors.find((c) => c.catalog_color === selectedColorKey) ?? p.colors[0]
    : p.colors[0];
  const url =
    row?.color_product_url ??
    row?.swatch_image_url ??
    p.front_flat_url ??
    p.back_flat_url ??
    null;
  if (url) return url;
  return buildGarmentPlaceholderDataUrl(kind, "front", PLACEHOLDER_TINT, true);
}

function colorsForVariantStrip(product: CustomizeProduct | null) {
  if (!product) return [];
  return product.colors.filter((c) => c.color_product_url || c.swatch_image_url);
}

const UI_CATEGORIES: { label: string; seed: UiCategory; slug: string }[] = [
  { label: "T-Shirts", seed: "T-Shirts", slug: "t-shirts" },
  { label: "Hoodies", seed: "Hoodies", slug: "hoodies-sweatshirts" },
  { label: "Polos", seed: "Polos", slug: "polos" },
  { label: "Jerseys", seed: "Jerseys", slug: "jerseys" },
  { label: "Hats", seed: "Hats", slug: "hats" },
  { label: "Other", seed: "Other", slug: "other" },
];

const ACCEPT = ".png,.jpg,.jpeg,.svg,.webp";
const MAX_BYTES = 5 * 1024 * 1024;

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
  zone: { x: number; y: number; w: number; h: number },
  garmentView: "front" | "back"
): DesignElement {
  const aspect = naturalW > 0 ? naturalH / naturalW : 1;
  const w = Math.max(40, zone.w * 0.42);
  const h = w * aspect;
  const cx = zone.x + zone.w / 2;
  const cy = zone.y + zone.h / 2;
  return {
    id: crypto.randomUUID(),
    type: "image",
    view: garmentView,
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

function newTextElement(
  zone: { x: number; y: number; w: number; h: number },
  garmentView: "front" | "back"
): DesignElement {
  const fontSize = 56;
  const w = Math.min(zone.w * 0.85, 280);
  const h = fontSize * 1.25 + 16;
  const cx = zone.x + zone.w / 2;
  const cy = zone.y + zone.h / 2;
  return {
    id: crypto.randomUUID(),
    type: "text",
    view: garmentView,
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

export function CustomizeExperience({ products }: { products: CustomizeProduct[] }) {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const compositorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const designParamLoaded = useRef<string | null>(null);

  const categoriesWithProducts = useMemo(
    () =>
      UI_CATEGORIES.filter((c) =>
        products.some((p) => uiCategoryFromSanMar(p.sanmar_category) === c.seed)
      ),
    [products]
  );

  const [categorySlug, setCategorySlug] = useState<string>(
    () => categoriesWithProducts[0]?.slug ?? UI_CATEGORIES[0].slug
  );

  useEffect(() => {
    const first = categoriesWithProducts[0]?.slug;
    if (first && !categoriesWithProducts.some((c) => c.slug === categorySlug)) {
      setCategorySlug(first);
    }
  }, [categoriesWithProducts, categorySlug]);

  const seedCategory = useMemo(
    () => UI_CATEGORIES.find((c) => c.slug === categorySlug)?.seed ?? "T-Shirts",
    [categorySlug]
  );

  const stylesInCategory = useMemo(
    () =>
      products.filter((p) => uiCategoryFromSanMar(p.sanmar_category) === seedCategory),
    [products, seedCategory]
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
  const [selectedColorKey, setSelectedColorKey] = useState<string>("");
  const [garmentNatural, setGarmentNatural] = useState({ w: 300, h: 400 });
  const [outsideZone, setOutsideZone] = useState(false);

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
    const style = searchParams.get("style");
    const cat = searchParams.get("category");
    if (cat && categoriesWithProducts.some((c) => c.slug === cat)) {
      setCategorySlug(cat);
    }
    if (style) {
      setSelectedStyle(style.trim().toUpperCase());
    }
  }, [searchParams, categoriesWithProducts]);

  useEffect(() => {
    if (products.length === 0 || selectedStyle !== null) return;
    const first = products[0];
    if (!first) return;
    setSelectedStyle(first.style_number.toUpperCase());
    const cc = first.colors[0]?.catalog_color ?? "";
    if (cc) setSelectedColorKey(cc);
  }, [products, selectedStyle]);

  useEffect(() => {
    if (stylesInCategory.length === 0) return;
    const stillValid = stylesInCategory.some(
      (p) => p.style_number.toUpperCase() === (selectedStyle ?? "").toUpperCase()
    );
    if (stillValid) return;
    const next = stylesInCategory[0];
    setSelectedStyle(next.style_number.toUpperCase());
    const cc = next.colors[0]?.catalog_color ?? "";
    if (cc) setSelectedColorKey(cc);
  }, [stylesInCategory, selectedStyle]);

  useEffect(() => {
    if (!selectedProduct?.colors.length) {
      setSelectedColorKey("");
      return;
    }
    setSelectedColorKey((prev) => {
      if (prev && selectedProduct.colors.some((c) => c.catalog_color === prev)) return prev;
      const byDisplay = prev
        ? selectedProduct.colors.find((c) => c.display_color === prev)
        : undefined;
      if (byDisplay) return byDisplay.catalog_color;
      return selectedProduct.colors[0]!.catalog_color;
    });
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

  const onGarmentNaturalSize = useCallback((w: number, h: number) => {
    setGarmentNatural({ w, h });
  }, []);

  const garmentSvgKind = selectedProduct
    ? uiCategoryToGarmentKind(uiCategoryFromSanMar(selectedProduct.sanmar_category))
    : "tshirt";

  const raster = rasterForView(view, selectedProduct, selectedColorKey);

  const zone = useMemo(
    () =>
      zoneInBuffer({
        kind: garmentSvgKind,
        view,
        bufferSize: CUSTOMIZE_CANVAS_BUFFER,
        imageNaturalWidth: garmentNatural.w,
        imageNaturalHeight: garmentNatural.h,
      }),
    [garmentNatural.h, garmentNatural.w, garmentSvgKind, view]
  );

  const selectedColorRow = useMemo(
    () => selectedProduct?.colors.find((c) => c.catalog_color === selectedColorKey) ?? null,
    [selectedColorKey, selectedProduct]
  );

  const selectedDisplayLabel = selectedColorRow?.display_color ?? "";

  const hasBack = Boolean(selectedColorRow?.color_product_back_url);

  useEffect(() => {
    if (!hasBack && view === "back") setView("front");
  }, [hasBack, view]);

  const variantStripColors = useMemo(
    () => colorsForVariantStrip(selectedProduct),
    [selectedProduct]
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
            newImageElement(url, img.naturalWidth || 400, img.naturalHeight || 400, zone, view)
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
    [toast, view, zone]
  );

  const addText = useCallback(() => {
    const el = newTextElement(zone, view);
    setElements((prev) => [...prev, el]);
    setSelectedElementId(el.id);
  }, [zone, view]);

  const deleteElement = useCallback((id: string) => {
    setElements((prev) => prev.filter((e) => e.id !== id));
    setSelectedElementId((cur) => (cur === id ? null : cur));
  }, []);

  const patchSelected = useCallback(
    (patch: Partial<DesignElement>) => {
      if (!selectedElementId) return;
      setElements((prev) =>
        prev.map((e) => (e.id === selectedElementId ? { ...e, ...patch } : e))
      );
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

  const onReorderDrop = useCallback(
    (targetId: string) => {
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
    },
    [draggingId]
  );

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
        garment_color: selectedColorKey || null,
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
    defaultSaveName,
    elements,
    refreshSaved,
    saveName,
    savedDesignId,
    selectedColorKey,
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
      if (row.garment_color) setSelectedColorKey(row.garment_color);
      if (row.view_mode === "front" || row.view_mode === "back") setView(row.view_mode);
      const raw = Array.isArray(row.elements) ? row.elements : [];
      setElements(
        raw.map((el) => {
          const e = el as DesignElement;
          return {
            ...e,
            view: e.view === "back" ? "back" : "front",
          };
        })
      );
      setSelectedElementId(null);
      setSavedDesignId(row.id);
      toast({
        title: "Design loaded",
        description: "Make edits and save again to update.",
      });
    },
    [toast]
  );

  useEffect(() => {
    setSelectedElementId((cur) => {
      if (!cur) return null;
      const el = elements.find((e) => e.id === cur);
      if (!el) return null;
      return el.view === view ? cur : null;
    });
  }, [elements, view]);

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

  const toolBtnClass =
    "w-full rounded-lg border border-[#2A3347] bg-[#0F1521] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2A3347]";
  const toolBtnPrimaryClass =
    "w-full rounded-lg bg-[#3B7BF8] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90";

  const inspectorAside = (
    <div className="rounded-xl border border-[#2A3347] bg-[#1C2333] p-4">
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
            <div className="mt-3 space-y-3">
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

          <label className="mt-3 flex items-center gap-2 text-sm text-white">
            <input
              type="checkbox"
              checked={Boolean(selectedElement.locked)}
              onChange={(e) => patchSelected({ locked: e.target.checked })}
              className="accent-[#3B7BF8]"
            />
            Lock position
          </label>

          <div className="mt-3">
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

          <div className="mt-3">
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
            <div className="mt-3">
              <div className="flex justify-between text-xs text-[#8A94A6]">
                <span>Size</span>
                <span>{Math.round(selectedElement.width)}px wide</span>
              </div>
              <input
                type="range"
                min={40}
                max={Math.max(120, Math.round(CUSTOMIZE_CANVAS_BUFFER * 0.95))}
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

          <div className="mt-4 flex flex-wrap gap-2">
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

          <div className="mt-2 flex flex-wrap gap-2">
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
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F1521] text-white">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
        <header className="mb-6 text-center md:text-left">
          <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-white md:text-4xl">
            Preview Your Logo
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-[#8A94A6] md:mx-0 md:text-base">
            Upload images, add text, and preview placement before you order.
          </p>
        </header>

        {user ? (
          <section className="mb-6 rounded-xl border border-[#2A3347] bg-[#1C2333] p-4 md:p-5">
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
                        <div className="flex h-full items-center justify-center text-xs text-[#8A94A6]">
                          No preview
                        </div>
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

        <section className="mb-6 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#8A94A6]">Category</p>
          <div className="-mx-1 flex gap-2 overflow-x-auto pb-2">
            {categoriesWithProducts.map((c) => {
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
                      : "shrink-0 rounded-full border border-[#2A3347] bg-[#1C2333] px-4 py-2 text-sm font-medium text-[#8A94A6] transition-colors hover:bg-[#2A3347] hover:text-white"
                  }
                >
                  {c.label}
                </button>
              );
            })}
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#8A94A6]">Styles</p>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 py-3">
            {stylesInCategory.map((p) => {
              const active = p.style_number.toUpperCase() === (selectedStyle ?? "").toUpperCase();
              return (
                <button
                  key={p.style_number}
                  type="button"
                  onClick={() => setSelectedStyle(p.style_number.toUpperCase())}
                  className={
                    active
                      ? "w-[140px] shrink-0 rounded-lg border border-transparent bg-[#3B7BF8]/10 p-2 text-left ring-2 ring-[#4A9EFF] ring-offset-2 ring-offset-[#0a1628]"
                      : "w-[140px] shrink-0 rounded-lg border border-[#2A3347] bg-[#1C2333] p-2 text-left text-[#8A94A6]"
                  }
                >
                  <div className="flex flex-col gap-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={styleCardThumbSrc(p, selectedStyle, selectedColorKey)}
                      alt=""
                      width={120}
                      height={120}
                      className="mx-auto h-16 w-full rounded-md border border-[#2A3347] bg-[#0F1521] object-contain"
                    />
                    <span className="block font-mono text-[10px] text-[#8A94A6]">{p.style_number}</span>
                    <span className="line-clamp-2 text-xs font-semibold leading-tight text-white">
                      {p.product_title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-8">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
              {selectedProduct && variantStripColors.length > 0 ? (
                <div
                  className="flex max-h-28 w-full flex-row gap-2 overflow-x-auto overflow-y-hidden px-2 py-2 lg:max-h-[min(72vw,calc(640px+1rem))] lg:w-[4.75rem] lg:max-w-[4.75rem] lg:flex-col lg:gap-3 lg:overflow-y-auto lg:overflow-x-hidden lg:px-1 lg:py-2"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {variantStripColors.map((row) => {
                    const thumb = row.color_product_url ?? row.swatch_image_url;
                    const sel = row.catalog_color === selectedColorKey;
                    return (
                      <button
                        key={row.catalog_color}
                        type="button"
                        title={row.display_color}
                        aria-label={row.display_color}
                        onClick={() => setSelectedColorKey(row.catalog_color)}
                        className={`h-14 w-14 shrink-0 rounded-lg bg-[#1C2333] bg-contain bg-center bg-no-repeat transition-transform lg:mx-auto ${
                          sel
                            ? "scale-105 border border-transparent ring-2 ring-[#4A9EFF] ring-offset-2 ring-offset-[#0a1628]"
                            : "scale-100 border border-[#2A3347]"
                        }`}
                        style={
                          thumb
                            ? { backgroundImage: `url(${thumb})` }
                            : { backgroundColor: SWATCH_FALLBACK_BG }
                        }
                      />
                    );
                  })}
                </div>
              ) : null}

              <div className="min-w-0 flex-1">
                <div className="aspect-square w-full max-w-full rounded-xl border border-[#2A3347] bg-[#1C2333] p-2 md:p-3">
                  <LogoCompositor
                    onCanvasReady={onCanvasReady}
                    garmentSvgKind={garmentSvgKind}
                    view={view}
                    garmentColor={PLACEHOLDER_TINT}
                    garmentRasterUrl={raster}
                    showGarmentPrintZone={printGuides}
                    showSafeZoneOverlay={printGuides}
                    elements={elements}
                    selectedElementId={selectedElementId}
                    onElementsChange={onElementsChange}
                    onSelectElement={setSelectedElementId}
                    onOutsidePrintZoneChange={setOutsideZone}
                    onGarmentNaturalSize={onGarmentNaturalSize}
                    onDeleteElement={deleteElement}
                  />
                </div>

                {selectedProduct ? (
                  <div className="mt-4 w-full max-w-full space-y-2 lg:mx-auto lg:max-w-full">
                    <div className="flex max-w-full items-baseline justify-between gap-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#8A94A6]">
                        GARMENT COLOR
                      </p>
                      <p className="text-xs text-[#8A94A6]">{selectedProduct.colors.length} colors</p>
                    </div>
                    <div className="flex max-w-full flex-wrap gap-2">
                      {selectedProduct.colors.map((row) => {
                        const active = row.catalog_color === selectedColorKey;
                        const swatchImgUrl = row.swatch_image_url ?? row.color_product_url;
                        const letterOnly = !swatchImgUrl;
                        return (
                          <button
                            key={row.catalog_color}
                            type="button"
                            title={row.display_color}
                            aria-label={row.display_color}
                            onClick={() => setSelectedColorKey(row.catalog_color)}
                            className={`relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full transition-transform hover:scale-105 ${
                              active
                                ? "scale-110 ring-2 ring-[#4A9EFF] ring-offset-2 ring-offset-[#0a1628]"
                                : "scale-100 border border-[#2A3347]"
                            }`}
                            style={
                              swatchImgUrl
                                ? {
                                    backgroundImage: `url(${swatchImgUrl})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: row.swatch_image_url ? "center" : "center 30%",
                                  }
                                : { backgroundColor: SWATCH_FALLBACK_BG }
                            }
                          >
                            {letterOnly && !active ? (
                              <span className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-white">
                                {(row.display_color || "?").trim().charAt(0).toUpperCase() || "?"}
                              </span>
                            ) : null}
                            {active ? (
                              <Check
                                className="pointer-events-none absolute h-4 w-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]"
                                strokeWidth={2.5}
                                aria-hidden
                              />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                    {selectedDisplayLabel ? (
                      <p className="text-sm font-medium text-white">{selectedDisplayLabel}</p>
                    ) : null}
                  </div>
                ) : null}

                {outsideZone && selectedElement ? (
                  <p className="mt-3 text-sm text-amber-300/90">
                    Selection may be outside the standard print area.
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-4">
            <input
              id="customize-image-upload"
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

            <div className="space-y-3 rounded-xl border border-[#2A3347] bg-[#1C2333] p-4">
              <button type="button" onClick={() => fileInputRef.current?.click()} className={toolBtnClass}>
                Add Image
              </button>
              <button type="button" onClick={addText} className={toolBtnClass}>
                Add Text
              </button>
              {hasBack ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setView("front")}
                    className={
                      view === "front"
                        ? "flex-1 rounded-lg border border-[#3B7BF8] bg-[#3B7BF8]/10 px-3 py-2 text-sm font-semibold text-white"
                        : "flex-1 rounded-lg border border-[#2A3347] bg-[#0F1521] px-3 py-2 text-sm font-medium text-[#8A94A6] hover:bg-[#2A3347]"
                    }
                  >
                    Front
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("back")}
                    className={
                      view === "back"
                        ? "flex-1 rounded-lg border border-[#3B7BF8] bg-[#3B7BF8]/10 px-3 py-2 text-sm font-semibold text-white"
                        : "flex-1 rounded-lg border border-[#2A3347] bg-[#0F1521] px-3 py-2 text-sm font-medium text-[#8A94A6] hover:bg-[#2A3347]"
                    }
                  >
                    Back
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setView("front")}
                  className="w-full rounded-lg border border-[#3B7BF8] bg-[#3B7BF8]/10 px-3 py-2 text-sm font-semibold text-white"
                >
                  Front
                </button>
              )}
              <button type="button" onClick={openSaveModal} className={toolBtnPrimaryClass}>
                Save Design
              </button>
            </div>

            {inspectorAside}

            <div
              className="rounded-xl border border-dashed border-[#2A3347] bg-[#1C2333] p-4"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                void addFiles(e.dataTransfer.files);
              }}
            >
              <p className="text-sm font-medium text-white">
                Drop images here, or{" "}
                <label
                  htmlFor="customize-image-upload"
                  className="cursor-pointer font-semibold text-[#3B7BF8] underline decoration-[#3B7BF8]/40 underline-offset-2 hover:opacity-90"
                >
                  choose files
                </label>
              </p>
              <p className="mt-1 text-xs text-[#8A94A6]">PNG with transparency works best · max 5MB each</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 w-full rounded-lg bg-[#3B7BF8] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Browse images
              </button>
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
                          onClick={() => {
                            setView(el.view);
                            setSelectedElementId(el.id);
                          }}
                          className="min-w-0 flex-1 text-left text-sm text-white"
                        >
                          <span className="mr-2 inline-block rounded bg-[#2A3347] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#8A94A6]">
                            {el.view}
                          </span>
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

            <button
              type="button"
              onClick={() => {
                downloadCanvasPreview(
                  compositorCanvasRef.current,
                  selectedProduct?.style_number ?? "preview"
                );
              }}
              className="w-full rounded-lg border border-[#2A3347] bg-[#1C2333] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2A3347]"
            >
              Download preview
            </button>

            <div className="rounded-xl border border-[#2A3347] bg-[#1C2333] p-5 lg:sticky lg:bottom-6 lg:z-10">
              <p className="font-display text-lg font-semibold text-white">
                {selectedProduct
                  ? `Ready to order ${selectedProduct.product_title}?`
                  : "Ready to start your order?"}
              </p>
              {selectedProduct ? (
                <p className="mt-2 text-sm text-[#8A94A6]">
                  Style #{selectedProduct.style_number} — {selectedProduct.brand_name}
                </p>
              ) : null}
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={quoteHref}
                  className="inline-flex flex-1 items-center justify-center rounded-lg bg-[#3B7BF8] px-5 py-3 text-center text-sm font-semibold text-white hover:opacity-90"
                >
                  Request a Quote
                </Link>
                <Link
                  href={teamHref}
                  className="inline-flex flex-1 items-center justify-center rounded-lg border border-[#2A3347] bg-[#0F1521] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[#2A3347]"
                >
                  Start a Team Order
                </Link>
              </div>
              <p className="mt-3 text-xs text-[#8A94A6]">
                Share your logo and style number when you reach out — we&apos;ll take it from there.
              </p>
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
