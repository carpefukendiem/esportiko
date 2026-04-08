import { cn } from "@/lib/utils/cn";

export function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "mb-4 inline-block rounded-full border border-slate bg-navy-light px-3 py-1 font-sans text-label font-medium uppercase tracking-wider text-gray-soft",
        className
      )}
    >
      {children}
    </p>
  );
}
