import type { Metadata } from "next";
import LoginForm from "@/components/portal/LoginForm";

function first(sp: Record<string, string | string[] | undefined>, key: string): string {
  const v = sp[key];
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

function safeNext(sp: Record<string, string | string[] | undefined>): string {
  const raw =
    first(sp, "next").trim() ||
    first(sp, "redirect").trim() ||
    "/portal/dashboard";
  return raw.startsWith("/") ? raw : `/${raw}`;
}

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
};

export function generateMetadata({ searchParams }: Props): Metadata {
  const safe = safeNext(searchParams);
  const isAdminDest = safe.startsWith("/admin");
  return {
    title: isAdminDest ? "Admin sign in | Esportiko" : "Team portal sign in | Esportiko",
    robots: { index: false, follow: false },
  };
}

export default function LoginPage({ searchParams }: Props) {
  const initialNext = safeNext(searchParams);
  const initialAuthError = first(searchParams, "error") || null;

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#0F1521] px-4 py-12"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(59,123,248,0.08) 0%, transparent 70%), #0F1521",
      }}
    >
      <LoginForm initialNext={initialNext} initialAuthError={initialAuthError} />
    </div>
  );
}
