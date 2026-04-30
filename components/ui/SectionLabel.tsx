import { cn } from "@/lib/utils/cn";

export function SectionLabel({
  children,
  className,
  variant = "dark",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "dark" | "light";
}) {
  return (
    <p
      className={cn(
        "mb-4 inline-block rounded-full border px-3 py-1 font-sans text-label font-semibold uppercase tracking-wider",
        variant === "dark" &&
          "border-slate bg-navy-light text-gray-soft",
        variant === "light" &&
          "border-navy/15 bg-white text-on-light-strong shadow-sm",
        className
      )}
    >
      {children}
    </p>
  );
}
