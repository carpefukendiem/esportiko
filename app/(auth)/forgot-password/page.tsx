import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/portal/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset password",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0F1521] px-4 py-12">
      <ForgotPasswordForm />
    </div>
  );
}
