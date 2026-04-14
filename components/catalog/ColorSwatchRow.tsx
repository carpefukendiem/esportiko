"use client";

import type { ProductColor } from "@/lib/catalog/types";
import { cn } from "@/lib/utils/cn";

export function ColorSwatchRow({
  colors,
  maxVisible = 6,
  selectedColor,
  onSelect,
  size = "sm",
}: {
  colors: ProductColor[];
  maxVisible?: number;
  selectedColor?: string;
  onSelect?: (color: ProductColor) => void;
  size?: "sm" | "md";
}) {
  const visible = colors.slice(0, maxVisible);
  const overflow = colors.length - visible.length;
  const dim = size === "md" ? "h-6 w-6" : "h-[18px] w-[18px]";

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {visible.map((c) => {
        const isSelected = selectedColor === c.catalogColor;
        const isPlaceholder = c.swatchImageUrl.includes("placeholder");
        const common = cn(
          dim,
          "shrink-0 rounded-full border bg-slate/40 bg-cover bg-center ring-1 transition",
          isSelected
            ? "border-blue-accent ring-blue-accent/60 scale-110"
            : "border-slate/40 ring-white/10 hover:ring-white/30"
        );

        if (onSelect) {
          return (
            <button
              key={`${c.catalogColor}-${c.displayColor}`}
              type="button"
              aria-pressed={isSelected}
              title={c.displayColor}
              onClick={() => onSelect(c)}
              className={common}
              style={
                isPlaceholder
                  ? undefined
                  : { backgroundImage: `url(${c.swatchImageUrl})` }
              }
            />
          );
        }

        return (
          <span
            key={`${c.catalogColor}-${c.displayColor}`}
            title={c.displayColor}
            className={common}
            style={
              isPlaceholder
                ? undefined
                : { backgroundImage: `url(${c.swatchImageUrl})` }
            }
            aria-hidden
          />
        );
      })}
      {overflow > 0 ? (
        <span className="font-sans text-xs text-gray-muted">+{overflow} more</span>
      ) : null}
    </div>
  );
}
