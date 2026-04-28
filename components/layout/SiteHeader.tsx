"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { primaryNav } from "@/lib/data/nav";
import { NavLink } from "@/components/layout/NavLink";
import { MobileNav } from "@/components/layout/MobileNav";
import { MyTeamNav } from "@/components/layout/MyTeamNav";
import { TeamPortalAuthProvider } from "@/components/layout/TeamPortalAuthContext";
import { EsportikoLogo } from "@/components/layout/EsportikoLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <TeamPortalAuthProvider>
      <>
        <header
          className={cn(
            "sticky top-0 z-40 min-h-[80px] border-b border-transparent py-2 transition-colors md:min-h-[96px] md:py-2.5",
            scrolled
              ? "border-slate/80 bg-navy/95 backdrop-blur-md"
              : "bg-transparent"
          )}
        >
          <div className="mx-auto flex h-full max-w-content items-center gap-0 px-4 md:px-6 lg:justify-between lg:gap-4 lg:pl-2 lg:pr-8 xl:pl-0 xl:pr-10">
            {/* Same width as menu control so logo stays visually centered below lg */}
            <div className="hidden w-11 shrink-0 max-lg:block" aria-hidden />
            <Link
              href="/"
              className={cn(
                "flex min-w-0 items-center gap-2 text-white focus-visible:outline-none",
                "flex-1 justify-center lg:flex-none lg:justify-start lg:-translate-x-3 xl:-translate-x-6 2xl:-translate-x-8"
              )}
              aria-label="Esportiko home"
            >
              <EsportikoLogo
                className="h-[48px] w-auto max-w-[min(78vw,440px)] md:h-[72px] md:max-w-[min(52vw,560px)]"
                priority
              />
            </Link>
            <nav
              aria-label="Primary"
              className="hidden items-center gap-5 lg:flex lg:gap-6"
            >
              {primaryNav.map((item) => (
                <NavLink key={item.href} href={item.href}>
                  {item.label}
                </NavLink>
              ))}
              <MyTeamNav />
            </nav>
            <div className="flex w-11 shrink-0 items-center justify-end gap-2 lg:w-auto">
              <Button
                asChild
                variant="primary"
                className="hidden px-5 py-2.5 lg:inline-flex"
              >
                <Link href="/contact">Contact</Link>
              </Button>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-md text-off-white hover:bg-navy-light lg:hidden"
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </header>
        <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      </>
    </TeamPortalAuthProvider>
  );
}
