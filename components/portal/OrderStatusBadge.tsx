import type { OrderStatus } from "@/types/portal";
import { cn } from "@/lib/utils/cn";

const styles: Record<OrderStatus, string> = {
  draft: "border-[#2A3347] bg-[#1C2333] text-[#8A94A6]",
  submitted: "border-[#3B7BF8] bg-[#1C2333] text-[#3B7BF8]",
  in_review: "border-amber-500/60 bg-[#1C2333] text-amber-400",
  in_production: "border-purple-500/60 bg-[#1C2333] text-purple-300",
  complete: "border-emerald-500/60 bg-[#1C2333] text-emerald-400",
  cancelled: "border-red-500/60 bg-[#1C2333] text-red-400",
};

const labels: Record<OrderStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  in_review: "In review",
  in_production: "In production",
  complete: "Complete",
  cancelled: "Cancelled",
};

export function OrderStatusBadge({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-sans text-xs font-medium",
        styles[status],
        className
      )}
    >
      {labels[status]}
    </span>
  );
}
