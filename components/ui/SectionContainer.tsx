import { cn } from "@/lib/utils/cn";

export function SectionContainer({
  className,
  contentClassName,
  children,
  as: Tag = "section",
  id,
}: {
  className?: string;
  /** Merged with default inner wrapper (max-width, horizontal padding). */
  contentClassName?: string;
  children: React.ReactNode;
  as?: "section" | "div";
  id?: string;
}) {
  return (
    <Tag id={id} className={cn("py-14 md:py-20", className)}>
      <div
        className={cn(
          "mx-auto w-full max-w-content px-6 md:px-8 lg:px-12",
          contentClassName
        )}
      >
        {children}
      </div>
    </Tag>
  );
}
