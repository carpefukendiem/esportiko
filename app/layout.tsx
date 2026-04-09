import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import "@/styles/globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Toaster } from "@/components/ui/toaster";
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
    "Premium custom screen printing, embroidery, team uniforms, and branded apparel serving Santa Barbara, Goleta, and the Central Coast.",
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
    default: "Esportiko — Custom Apparel Santa Barbara & Central Coast",
    template: "%s | Esportiko — Custom Apparel Santa Barbara",
  },
  description:
    "Premium screen printing, embroidery, team uniforms, and branded apparel for Goleta, Santa Barbara, and the Central Coast. Start your project.",
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-blue-accent focus:px-4 focus:py-3 focus:font-sans focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content" className="min-h-[50vh]">
          {children}
        </main>
        <SiteFooter />
        <Toaster />
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
