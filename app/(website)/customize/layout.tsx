import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Preview Your Logo",
  description:
    "Upload your logo and preview placement on tees, hoodies, polos, jerseys, and hats before you request a quote.",
  path: "/customize",
});

export default function CustomizeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
