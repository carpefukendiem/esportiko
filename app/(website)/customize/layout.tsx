import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

import "@fontsource/bebas-neue/400.css";
import "@fontsource/oswald/400.css";
import "@fontsource/oswald/700.css";
import "@fontsource/anton/400.css";
import "@fontsource/permanent-marker/400.css";
import "@fontsource/archivo-black/400.css";
import "@fontsource/playfair-display/400.css";
import "@fontsource/staatliches/400.css";

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
