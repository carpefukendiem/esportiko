import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import "@/styles/globals.css";
import { RootToaster } from "@/components/ui/root-toaster";
import { LeadConnectorChatEmbed } from "@/components/third-party/LeadConnectorChatEmbed";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Esportiko",
  description:
    "Custom team and business apparel built in Goleta — serving Santa Barbara and the Central Coast. Screen printing, embroidery, and team uniforms.",
  url: "https://esportikosb.com",
  areaServed: [
    "Santa Barbara",
    "Goleta",
    "Carpinteria",
    "Ventura",
    "Central Coast California",
  ],
  serviceType: [
    "Screen Printing",
    "Embroidery",
    "Team Uniforms",
    "Custom Apparel",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://esportikosb.com"),
  title: {
    default: "Esportiko — Custom Apparel Goleta & Santa Barbara · Central Coast",
    template: "%s | Esportiko — Custom Apparel Goleta & Santa Barbara",
  },
  description:
    "Custom team and business apparel built in Goleta — serving Santa Barbara and the Central Coast. Screen printing, embroidery, and team uniforms. Start your project.",
  icons: {
    icon: [
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/favicons/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0a1628",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${dmSans.variable}`}
    >
      <body className="min-h-screen font-sans antialiased">
        {children}
        <RootToaster />
        <LeadConnectorChatEmbed />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
      </body>
    </html>
  );
}
