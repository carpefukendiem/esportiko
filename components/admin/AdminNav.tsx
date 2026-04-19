"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { label: "Orders", href: "/admin/orders" },
  { label: "Accounts", href: "/admin/accounts" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-6" aria-label="Admin navigation">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "font-sans text-sm font-medium transition-colors",
              isActive ? "text-white" : "text-[#8A94A6] hover:text-white"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
