"use client";

import ForgotPasswordForm from "@/components/portal/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div
      className="min-h-screen bg-[#0F1521] flex items-center justify-center px-4 py-12"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(59,123,248,0.08) 0%, transparent 70%), #0F1521",
      }}
    >
      <ForgotPasswordForm />
    </div>
  );
}
