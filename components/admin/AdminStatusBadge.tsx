import type { OrderStatus } from "@/types/portal";
import { cn } from "@/lib/utils/cn";

const styles: Record<OrderStatus, string> = {
  draft: "bg-[#2A3347] text-[#8A94A6] border-[#2A3347]",
  submitted: "bg-blue-500/15 text-[#7EB6FF] border-blue-500/40",
  in_review: "bg-amber-500/15 text-amber-200 border-amber-500/40",
  in_production: "bg-purple-500/15 text-purple-200 border-purple-500/40",
  complete: "bg-emerald-500/15 text-emerald-200 border-emerald-500/40",
  cancelled: "bg-red-500/15 text-red-200 border-red-500/40",
};

export function AdminStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 font-sans text-xs font-semibold capitalize",
        styles[status] ?? styles.draft
      )}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
