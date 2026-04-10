import type { Metadata } from "next";
import { Suspense } from "react";
import { SignupForm } from "@/components/portal/SignupForm";

export const metadata: Metadata = {
  title: "Create account",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0F1521] px-4 py-12">
      <Suspense fallback={<SignupSkeleton />}>
        <SignupForm />
      </Suspense>
    </div>
  );
}

function SignupSkeleton() {
  return (
    <div className="h-[560px] w-full max-w-md animate-pulse rounded-xl border border-[#2A3347] bg-[#1C2333]" />
  );
}
