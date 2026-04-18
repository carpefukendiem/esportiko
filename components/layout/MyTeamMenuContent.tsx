"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTeamPortalAuth } from "@/components/layout/TeamPortalAuthContext";
import { cn } from "@/lib/utils/cn";

const portalLinks: { label: string; href: string }[] = [
  { label: "Dashboard", href: "/portal/dashboard" },
  { label: "My Orders", href: "/portal/orders" },
  { label: "New Order", href: "/portal/new-order" },
  { label: "Roster", href: "/portal/roster" },
];

const includes = [
  "Jerseys & uniforms",
  "Hoodies & spirit wear",
  "Screen printing & embroidery",
  "Hats & accessories",
];

const linkClass =
  "block rounded-md py-2 text-sm font-medium text-off-white transition-colors hover:bg-[#252d42] hover:text-blue-light";

export function MyTeamMenuContent({
  onNavigate,
  compact = false,
}: {
  onNavigate?: () => void;
  compact?: boolean;
}) {
  const router = useRouter();
  const { user, teamName, loading, signOut } = useTeamPortalAuth();

  const initial = (teamName?.[0] ?? user?.email?.[0] ?? "?").toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    onNavigate?.();
    router.refresh();
  };

  const afterNav = () => {
    onNavigate?.();
    router.refresh();
  };

  return (
    <div
      className={cn(
        "grid gap-8",
        compact ? "grid-cols-1" : "lg:grid-cols-2"
      )}
    >
      <div
        className={cn(
          "space-y-4",
          !compact &&
            "border-b border-[#2A3347] pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8"
        )}
      >
        {loading && !user ? (
          <div
            className="h-36 animate-pulse rounded-lg bg-[#252d42]"
            aria-hidden
          />
        ) : user ? (
          <>
            <div className="flex items-center gap-3">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-accent text-base font-bold text-white"
                aria-hidden
              >
                {initial}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-soft">
                  Your team account
                </p>
                <p className="truncate font-display text-lg font-semibold text-white">
                  {teamName ?? "My team"}
                </p>
              </div>
            </div>
            <nav aria-label="Team portal" className="flex flex-col border-t border-[#2A3347] pt-4">
              {portalLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={linkClass}
                  onClick={afterNav}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-[#2A3347] pt-4">
              <button
                type="button"
                className="text-sm font-medium text-blue-accent underline-offset-4 hover:text-blue-light hover:underline"
                onClick={() => void handleSignOut()}
              >
                Sign out
              </button>
            </div>
          </>
        ) : (
          <>
            <div>
              <h3 className="font-display text-lg font-semibold text-white">
                Access your team portal
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-soft">
                View past orders, reorder, and manage your roster in one place.
              </p>
            </div>
            <div
              className={cn(
                "flex flex-col gap-3",
                !compact && "sm:flex-row sm:flex-wrap"
              )}
            >
              <Button asChild variant="primary" width={compact ? "full" : "auto"}>
                <Link href="/login" onClick={afterNav}>
                  Sign in
                </Link>
              </Button>
              <Button asChild variant="secondary" width={compact ? "full" : "auto"}>
                <Link href="/signup" onClick={afterNav}>
                  Create account
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-soft">
            New to Esportiko?
          </p>
          <h3 className="mt-1 font-display text-lg font-semibold text-white">
            Start a team order
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-soft">
            Uniforms, spirit wear, and custom apparel for teams of any size.
          </p>
        </div>
        <Button asChild variant="primary" width={compact ? "full" : "auto"}>
          <Link href="/team-orders" onClick={afterNav}>
            Request a quote
          </Link>
        </Button>
        <p className="pt-2">
          <Link
            href="/customize"
            onClick={afterNav}
            className="text-sm text-[#8A94A6] transition-colors hover:text-white"
          >
            Preview your logo →
          </Link>
        </p>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-soft">
            What&apos;s included
          </p>
          <ul className="space-y-2 text-sm text-off-white">
            {includes.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="text-blue-light" aria-hidden>
                  ·
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
