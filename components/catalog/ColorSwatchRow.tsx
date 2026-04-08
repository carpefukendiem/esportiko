import type { ProductColor } from "@/lib/catalog/types";

export function ColorSwatchRow({
  colors,
  maxVisible = 6,
}: {
  colors: ProductColor[];
  maxVisible?: number;
}) {
  const visible = colors.slice(0, maxVisible);
  const overflow = colors.length - visible.length;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {visible.map((c) => {
        const isPlaceholder = c.swatchImageUrl.includes("placeholder");
        return (
          <span
            key={`${c.catalogColor}-${c.displayColor}`}
            title={c.displayColor}
            className="h-[18px] w-[18px] shrink-0 rounded-full border border-slate/40 bg-slate/40 bg-cover bg-center ring-1 ring-white/10"
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
