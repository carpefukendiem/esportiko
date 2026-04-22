"use client";

import { useLayoutEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Incomplete profiles must finish team details on /portal/settings first.
 * Uses the client URL because `x-es-pathname` from middleware is not always
 * visible to Server Components on Vercel, which made `onSettings` always false
 * and forced a redirect loop / blocked the whole portal including settings.
 */
export function PortalTeamProfileGate({
  needsTeamProfile,
  isAdmin,
  children,
}: {
  needsTeamProfile: boolean;
  isAdmin: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const onSettings =
    pathname === "/portal/settings" || pathname.startsWith("/portal/settings/");
  const mustRedirect = Boolean(needsTeamProfile && !isAdmin && !onSettings);

  useLayoutEffect(() => {
    if (!mustRedirect) return;
    router.replace("/portal/settings?onboarding=true");
  }, [mustRedirect, router]);

  if (mustRedirect) {
    return (
      <div className="mx-auto max-w-md px-6 py-16 text-center font-sans text-sm text-[#8A94A6]">
        Taking you to team setup…
      </div>
    );
  }

  return <>{children}</>;
}
