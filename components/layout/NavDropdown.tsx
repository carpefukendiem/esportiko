"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const CLOSE_DELAY_MS = 150;

function isActivePath(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (href !== "/" && pathname.startsWith(href)) return true;
  return false;
}

export function NavDropdown({
  label,
  items,
  className,
}: {
  label: string;
  items: { label: string; href: string }[];
  className?: string;
}) {
  const pathname = usePathname();
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [open, setOpen] = useState(false);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
      closeTimerRef.current = null;
    }, CLOSE_DELAY_MS);
  }, [clearCloseTimer]);

  const openMenu = useCallback(() => {
    clearCloseTimer();
    setOpen(true);
  }, [clearCloseTimer]);

  const closeMenu = useCallback(() => {
    clearCloseTimer();
    setOpen(false);
  }, [clearCloseTimer]);

  useEffect(() => {
    return () => clearCloseTimer();
  }, [clearCloseTimer]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closeMenu]);

  useEffect(() => {
    if (!open) return;
    const onDocPointerDown = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el?.contains(e.target as Node)) closeMenu();
    };
    document.addEventListener("mousedown", onDocPointerDown);
    return () => document.removeEventListener("mousedown", onDocPointerDown);
  }, [open, closeMenu]);

  const focusFirstItem = useCallback(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const first = menu.querySelector<HTMLAnchorElement>('a[role="menuitem"]');
    first?.focus();
  }, []);

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!open) {
        openMenu();
        requestAnimationFrame(() => focusFirstItem());
      } else {
        focusFirstItem();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button
        ref={triggerRef}
        type="button"
        id={`${menuId}-trigger`}
        className={cn(
          "flex items-center gap-1 rounded-md px-1 py-2 font-sans text-[15px] font-medium text-[#E8ECF1] transition-colors",
          "hover:text-[#4A9EFF]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A9EFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]",
          open && "text-[#4A9EFF]"
        )}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onTriggerKeyDown}
      >
        <span>{label}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 opacity-80 transition-transform duration-150",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      <div
        ref={menuRef}
        id={menuId}
        className={cn(
          "absolute left-0 top-full z-50 pt-2 transition-opacity duration-150 ease-out",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none invisible opacity-0"
        )}
        aria-hidden={!open}
      >
        <ul
          role="menu"
          aria-labelledby={`${menuId}-trigger`}
          className={cn(
            "min-w-[14rem] overflow-hidden rounded-[12px] border border-[#2A3347] bg-[#0F1521] shadow-lg",
            "py-2"
          )}
        >
          {items.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <li key={item.href} role="none">
                <Link
                  href={item.href}
                  role="menuitem"
                  tabIndex={open ? 0 : -1}
                  className={cn(
                    "block px-4 py-3 font-sans text-[15px] font-medium text-[#E8ECF1] transition-colors",
                    "hover:bg-[#1C2333] hover:text-[#4A9EFF]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#4A9EFF]",
                    active &&
                      "font-semibold text-[#4A9EFF] hover:text-[#4A9EFF]"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
