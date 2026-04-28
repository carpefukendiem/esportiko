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
          {/* Mobile / tablet: spacer | centered logo | hamburger (matches lg:hidden menu) */}
          <div className="mx-auto flex h-full max-w-content items-center gap-0 px-4 py-5 md:px-6 lg:hidden">
            <div className="w-11 shrink-0" aria-hidden />
            <Link
              href="/"
              className="flex min-w-0 flex-1 justify-center gap-2 text-white focus-visible:outline-none"
              aria-label="Esportiko home"
            >
              <EsportikoLogo
                className="h-[64px] w-auto max-w-[min(78vw,440px)] md:h-[72px] md:max-w-[min(52vw,560px)]"
                priority
              />
            </Link>
            <div className="flex w-11 shrink-0 justify-end">
              <button
                type="button"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-off-white hover:bg-navy-light"
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Desktop */}
          <div className="mx-auto hidden h-full max-w-content items-center justify-between gap-4 px-4 md:px-6 lg:flex lg:pl-2 lg:pr-8 xl:pl-0 xl:pr-10">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 text-white focus-visible:outline-none lg:-translate-x-3 xl:-translate-x-6 2xl:-translate-x-8"
              aria-label="Esportiko home"
            >
              <EsportikoLogo
                className="h-[48px] w-auto max-w-[min(78vw,440px)] md:h-[72px] md:max-w-[min(52vw,560px)]"
              />
            </Link>
            <nav aria-label="Primary" className="flex items-center gap-5 lg:gap-6">
              {primaryNav.map((item) => (
                <NavLink key={item.href} href={item.href}>
                  {item.label}
                </NavLink>
              ))}
              <MyTeamNav />
            </nav>
            <div className="flex items-center gap-2">
              <Button asChild variant="primary" className="px-5 py-2.5 lg:inline-flex">
                <Link href="/contact">Contact</Link>
              </Button>
            </div>
          </div>
        </header>
        <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      </>
    </TeamPortalAuthProvider>
  );
}
