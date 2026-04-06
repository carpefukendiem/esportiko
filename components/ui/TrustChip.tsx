import { cn } from "@/lib/utils/cn";

export function TrustChip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-slate bg-navy-light/80 px-3 py-1 font-sans text-body-sm font-medium uppercase tracking-wide text-off-white",
        className
      )}
    >
      {children}
    </span>
  );
}
