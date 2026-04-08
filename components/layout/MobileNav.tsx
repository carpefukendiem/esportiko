"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { primaryNav } from "@/lib/data/nav";
import { NavLink } from "@/components/layout/NavLink";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
                aria-label="Close navigation"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <ul className="flex flex-1 flex-col gap-1">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    onNavigate={onClose}
                    className="block rounded-md px-3 py-3 text-lg"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 border-t border-slate pt-8">
              <Button asChild variant="primary" width="full">
                <Link href="/request-a-quote?path=team" onClick={onClose}>
                  Get A Team Quote
                </Link>
              </Button>
              <Button asChild variant="secondary" width="full">
                <Link href="/request-a-quote?path=business" onClick={onClose}>
                  Get A Quote
                </Link>
              </Button>
              <Button asChild variant="ghost" width="full" className="justify-center">
                <Link href="/contact" onClick={onClose}>
                  Contact
                </Link>
              </Button>
            </div>
          </motion.nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
