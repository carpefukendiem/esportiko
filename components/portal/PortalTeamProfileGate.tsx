"use client";

import { useLayoutEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isPublicAdminEmail } from "@/lib/auth/admin-public";

/**
 * Incomplete profiles must finish team details on /portal/settings first.
 * Uses the client URL because `x-es-pathname` from middleware is not always
 * visible to Server Components on Vercel, which made `onSettings` always false
 * and forced a redirect loop / blocked the whole portal including settings.
 *
 * Also treats `NEXT_PUBLIC_ADMIN_EMAILS` on the client as admin for this gate,
 * so a deploy where server-side env reads differ from the client bundle (or
 * only the public list is set) still matches login and skips team setup.
 */
export function PortalTeamProfileGate({
  needsTeamProfile,
  isAdmin,
  userEmail,
  children,
}: {
  needsTeamProfile: boolean;
  isAdmin: boolean;
  userEmail: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const onSettings =
    pathname === "/portal/settings" || pathname.startsWith("/portal/settings/");
  const skipTeamSetup =
    isAdmin || (userEmail != null && userEmail !== "" && isPublicAdminEmail(userEmail));
  const mustRedirect = Boolean(needsTeamProfile && !skipTeamSetup && !onSettings);

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
