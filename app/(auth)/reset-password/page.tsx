import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/portal/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Set new password",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0F1521] px-4 py-12">
      <ResetPasswordForm />
    </div>
  );
}
