import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/portal/LoginForm";

export const metadata: Metadata = {
  title: "Team portal sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0F1521] px-4 py-12">
      <Suspense fallback={<LoginSkeleton />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

function LoginSkeleton() {
  return (
    <div className="h-[480px] w-full max-w-md animate-pulse rounded-xl border border-[#2A3347] bg-[#1C2333]" />
  );
}
