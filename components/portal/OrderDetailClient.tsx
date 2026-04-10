"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { OrderItemRow } from "@/types/portal";

export function OrderSubmittedToast() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    if (searchParams.get("submitted") === "1") {
      toast({
        title: "Order submitted",
        description: "Thanks — our team will follow up shortly.",
      });
    }
  }, [searchParams, toast]);

  return null;
}

export function DownloadRosterButton({ items }: { items: OrderItemRow[] }) {
  const download = () => {
    const header = "Player name,Number,Size,Quantity";
    const lines = items.map(
      (i) =>
        `"${(i.player_name ?? "").replace(/"/g, '""')}",${i.player_number ?? ""},${i.size ?? ""},${i.quantity}`
    );
    const blob = new Blob([[header, ...lines].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "roster-summary.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={download}
      className="rounded-lg border border-[#2A3347] px-4 py-2 font-sans text-sm font-semibold text-[#8A94A6] hover:border-[#3B7BF8] hover:text-[#3B7BF8]"
    >
      Download summary
    </button>
  );
}
