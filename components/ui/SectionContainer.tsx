import { cn } from "@/lib/utils/cn";

export function SectionContainer({
  className,
  children,
  as: Tag = "section",
  id,
}: {
  className?: string;
  children: React.ReactNode;
  as?: "section" | "div";
  id?: string;
}) {
  return (
    <Tag id={id} className={cn("py-14 md:py-20", className)}>
      <div className="mx-auto w-full max-w-content px-6 md:px-8 lg:px-12">
        {children}
      </div>
    </Tag>
  );
}
