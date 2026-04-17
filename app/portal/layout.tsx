import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PortalShellSkeleton } from "@/components/portal/PortalShellSkeleton";
import { PortalLayoutWithAccount } from "./PortalLayoutWithAccount";

export const metadata: Metadata = {
  title: {
    template: "%s | Team portal | Esportiko",
    default: "Team portal",
  },
  robots: { index: false, follow: false },
};

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<PortalShellSkeleton />}>
      <PortalLayoutWithAccount user={user}>{children}</PortalLayoutWithAccount>
    </Suspense>
  );
}
