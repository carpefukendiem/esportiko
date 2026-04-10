import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import "@/styles/globals.css";
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
        {children}
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
