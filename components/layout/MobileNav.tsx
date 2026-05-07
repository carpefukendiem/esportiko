"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, X } from "lucide-react";
import type { NavItem } from "@/lib/data/nav";
import { primaryNav } from "@/lib/data/nav";
import { MyTeamMobileNavSection } from "@/components/layout/MyTeamMobileNavSection";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

function isActivePath(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (href !== "/" && pathname.startsWith(href)) return true;
  return false;
}

function navChildLinks(children: NavItem[]): { label: string; href: string }[] {
  const out: { label: string; href: string }[] = [];
  for (const c of children) {
    if (c.href) out.push({ label: c.label, href: c.href });
  }
  return out;
}

function MobileNavLeaf({
  href,
  children,
  onClose,
  indent,
}: {
  href: string;
  children: React.ReactNode;
  onClose: () => void;
  indent?: boolean;
}) {
  const pathname = usePathname();
  const active = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      onClick={onClose}
      className={cn(
        "flex min-h-[44px] items-center rounded-md font-sans text-[15px] font-medium transition-colors",
        "text-[#E8ECF1] hover:bg-navy-light/30 hover:text-[#4A9EFF]",
        indent ? "px-3 pl-10 pr-3" : "px-3",
        active &&
          "text-[#4A9EFF] underline decoration-2 decoration-[#4A9EFF] underline-offset-4",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A9EFF] focus-visible:ring-offset-2 focus-visible:ring-offset-navy-mid"
      )}
    >
      {children}
    </Link>
  );
}

function MobileAccordionSection({
  title,
  items,
  expanded,
  onToggle,
  onClose,
}: {
  title: string;
  items: { label: string; href: string }[];
  expanded: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  return (
    <li className="list-none">
      <button
        type="button"
        onClick={onToggle}
        className="flex min-h-[44px] w-full items-center justify-between rounded-md px-3 text-left font-sans text-[15px] font-medium text-[#E8ECF1] transition-colors hover:bg-navy-light/30 hover:text-[#4A9EFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A9EFF] focus-visible:ring-offset-2 focus-visible:ring-offset-navy-mid"
        aria-expanded={expanded}
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 opacity-80 transition-transform duration-150",
            expanded && "rotate-180"
          )}
          aria-hidden
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-[max-height] duration-200 ease-out",
          expanded ? "max-h-[480px]" : "max-h-0"
        )}
      >
        <ul className="flex flex-col gap-0.5 border-t border-slate/30 py-1">
          {items.map((item) => (
            <li key={item.href} className="list-none">
              <MobileNavLeaf href={item.href} onClose={onClose} indent>
                {item.label}
              </MobileNavLeaf>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) setExpandedSection(null);
  }, [open]);

  const toggleSection = (key: string) => {
    setExpandedSection((current) => (current === key ? null : key));
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-navy/90 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={onClose}
          />
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
            className="absolute right-0 top-0 flex h-full w-[min(100%,380px)] flex-col border-l border-slate bg-navy-mid px-6 pb-10 pt-6 shadow-xl"
            aria-label="Mobile primary"
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="font-display text-lg font-semibold uppercase tracking-wide text-white">
                Menu
              </span>
              <button
                type="button"
                onClick={onClose}
                className="flex h-11 w-11 items-center justify-center rounded-md text-off-white hover:bg-navy-light"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <ul className="flex flex-1 flex-col gap-1 overflow-y-auto">
              {primaryNav.map((item) =>
                item.children ? (
                  <MobileAccordionSection
                    key={item.label}
                    title={item.label}
                    items={navChildLinks(item.children)}
                    expanded={expandedSection === item.label}
                    onToggle={() => toggleSection(item.label)}
                    onClose={onClose}
                  />
                ) : item.href ? (
                  <li key={item.href} className="list-none">
                    <MobileNavLeaf href={item.href} onClose={onClose}>
                      {item.label}
                    </MobileNavLeaf>
                  </li>
                ) : null
              )}
              <MyTeamMobileNavSection onClose={onClose} />
              <li className="list-none">
                <MobileNavLeaf href="/contact" onClose={onClose}>
                  Contact
                </MobileNavLeaf>
              </li>
            </ul>
            <div className="mt-8 flex flex-col gap-3 border-t border-slate pt-8">
              <Button
                asChild
                variant="primary"
                width="full"
                className="min-h-[44px] font-display font-semibold"
              >
                <Link href="/request-a-quote" onClick={onClose}>
                  Request a Quote
                </Link>
              </Button>
            </div>
          </motion.nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
