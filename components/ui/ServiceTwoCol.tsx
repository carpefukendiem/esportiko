import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

export function ServiceTwoCol({
  heading,
  children,
  image,
  imageAlt,
  imagePosition = "right",
}: {
  heading: string;
  children: ReactNode;
  image: string;
  imageAlt: string;
  imagePosition?: "left" | "right";
}) {
  const textCol = (
    <div className={cn(imagePosition === "right" ? "lg:order-1" : "lg:order-2")}>
      <h2 className="mb-4 font-display text-h2 font-semibold text-white">
        {heading}
      </h2>
      {children}
    </div>
  );

  const imageCol = (
    <div
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden rounded-xl",
        imagePosition === "right" ? "lg:order-2" : "lg:order-1"
      )}
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
    </div>
  );

  return (
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
      {textCol}
      {imageCol}
    </div>
  );
}
