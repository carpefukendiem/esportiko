import Image from "next/image";
import { cn } from "@/lib/utils/cn";

export function GalleryCard({
  src,
  alt,
  label,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  label?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative aspect-[4/5] min-w-[240px] flex-shrink-0 snap-start overflow-hidden rounded-xl border border-slate bg-navy sm:min-w-[280px]",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        sizes="(max-width: 768px) 75vw, 280px"
        priority={priority}
        loading={priority ? undefined : "lazy"}
      />
      {label ? (
        <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-navy/90 via-navy/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="font-sans text-body-sm font-medium text-white">
            {label}
          </span>
        </div>
      ) : null}
    </div>
  );
}
