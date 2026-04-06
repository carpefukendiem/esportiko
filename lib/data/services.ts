import { media } from "@/lib/data/media";

export interface Service {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  icon: "print" | "needle" | "users" | "briefcase";
  image: string;
  ctaLabel: string;
  ctaHref: string;
}

export const services: Service[] = [
  {
    id: "screen-printing",
    name: "Screen Printing",
    slug: "screen-printing",
    shortDescription:
      "Vivid, durable prints for bulk runs, events, and team apparel.",
    longDescription:
      "High-opacity inks, consistent registration, and production workflows built for volume — ideal for team sets, event merch, and bold graphics on tees and hoodies.",
    icon: "print",
    image: media.services.screenPrinting,
    ctaLabel: "Explore screen printing",
    ctaHref: "/screen-printing",
  },
  {
    id: "embroidery",
    name: "Embroidery",
    slug: "embroidery",
    shortDescription:
      "Premium stitched decoration for hats, polos, jackets, and workwear.",
    longDescription:
      "Dimensional thread work that reads professional up close — structured caps, polos, outerwear, and staff uniforms with placement guidance.",
    icon: "needle",
    image: media.services.embroidery,
    ctaLabel: "Explore embroidery",
    ctaHref: "/embroidery",
  },
  {
    id: "team-uniforms",
    name: "Team Uniforms",
    slug: "team-orders",
    shortDescription:
      "Organized uniform packages for sports teams, clubs, and leagues.",
    longDescription:
      "Roster-aware ordering with names, numbers, and size breakdowns — fewer emails, cleaner handoffs, predictable timelines.",
    icon: "users",
    image: media.services.teamUniforms,
    ctaLabel: "Plan a team order",
    ctaHref: "/team-orders",
  },
  {
    id: "branded-apparel",
    name: "Branded Apparel",
    slug: "business-apparel",
    shortDescription:
      "Custom-branded merchandise and staff uniforms for local businesses.",
    longDescription:
      "From restaurant polos to company swag — garment selection, decoration method, and quantity guidance aligned to how your brand shows up daily.",
    icon: "briefcase",
    image: media.services.brandedApparel,
    ctaLabel: "Start a brand project",
    ctaHref: "/business-apparel",
  },
];
