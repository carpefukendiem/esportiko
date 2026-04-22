import type { Metadata } from "next";

/** Title is set per-request on `login/page.tsx` via `generateMetadata`. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
