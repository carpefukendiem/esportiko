"use client";

import { Suspense } from "react";
import LoginForm from "@/components/portal/LoginForm";

export default function LoginPage() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 py-12"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(59,123,248,0.08) 0%, transparent 70%), #0F1521",
      }}
    >
      <Suspense fallback={<div className="h-40 w-full max-w-md animate-pulse rounded-xl bg-[#1C2333]/80" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
