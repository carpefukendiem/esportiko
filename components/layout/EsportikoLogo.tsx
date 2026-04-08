import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { brandLogo } from "@/lib/data/media";

export function EsportikoLogo({
  className,
  priority = false,
}: {
  className?: string;
  /** Set true in header for faster LCP */
  priority?: boolean;
}) {
  return (
    <Image
      src={brandLogo.src}
      alt="Esportiko"
      width={brandLogo.width}
      height={brandLogo.height}
      className={cn("h-auto w-auto max-w-[220px]", className)}
      priority={priority}
    />
  );
}
