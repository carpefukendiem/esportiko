export type WorkCategory =
  | "teams"
  | "business"
  | "screen-printing"
  | "embroidery"
  | "hats";

export interface WorkItem {
  id: string;
  title: string;
  client?: string;
  category: WorkCategory;
  imagePath: string;
  alt: string;
  featured?: boolean;
  date?: string;
}

export const WORK_ITEMS: WorkItem[] = [
  {
    id: "all-stars-santa-barbara",
    title: "Santa Barbara All-Stars",
    client: "Santa Barbara All-Stars",
    category: "teams",
    imagePath: "/images/our-work/teams/all-stars-santa-barbara.webp",
    alt: "Custom Santa Barbara All-Stars team apparel by Esportiko",
    featured: true,
  },
  {
    id: "santa-barbara-dons-screenprinting",
    title: "Santa Barbara Dons Screen Printing",
    client: "Santa Barbara Dons",
    category: "teams",
    imagePath: "/images/our-work/teams/santa-barbara-dons-screenprinting.webp",
    alt: "Santa Barbara Dons custom screen-printed team apparel and spirit wear",
    featured: true,
  },
  {
    id: "softball-jersey-screenprinting",
    title: "Softball Jersey Screen Printing",
    category: "teams",
    imagePath: "/images/our-work/teams/softball-jersey-screenprinting.webp",
    alt: "Custom screen-printed softball jersey with team graphics and numbers",
    featured: true,
  },
  {
    id: "custom-jersey-screenprinting",
    title: "Custom Jersey Screen Printing",
    category: "teams",
    imagePath: "/images/our-work/teams/custom-jersey-screenprinting.webp",
    alt: "Custom jerseys with bold screen-printed graphics for teams and leagues",
    featured: false,
  },
  {
    id: "santa-barbara-city-screenprinting",
    title: "Santa Barbara City Screen Printing",
    client: "Santa Barbara City",
    category: "teams",
    imagePath: "/images/our-work/teams/santa-barbara-city-screenprinting.webp",
    alt: "Santa Barbara City screen-printed team apparel on the field",
    featured: false,
  },
  {
    id: "soccer-jersey-screenprinting",
    title: "Soccer Jersey Screen Printing",
    category: "teams",
    imagePath: "/images/our-work/teams/soccer-jersey-screenprinting.webp",
    alt: "Soccer team jersey with bold screen-printed front and detail",
    featured: false,
  },
  {
    id: "soccer-screen-printing",
    title: "Soccer Team Screen Printing",
    category: "teams",
    imagePath: "/images/our-work/teams/soccer-screen-printing.webp",
    alt: "Soccer club apparel with crisp screen-printed crest and lettering",
    featured: false,
  },
  {
    id: "sports-jersey-screen-printing",
    title: "Sports Jersey Screen Printing",
    category: "teams",
    imagePath: "/images/our-work/teams/sports-jersey-screen-printing.webp",
    alt: "Athletic jersey with high-impact screen printing for game day",
    featured: false,
  },
  {
    id: "restaurant-screenprinting",
    title: "Restaurant Branded Apparel",
    category: "business",
    imagePath: "/images/our-work/business/restaurant-screenprinting.webp",
    alt: "Restaurant staff shirts and branded apparel with front screen print",
    featured: true,
  },
  {
    id: "business-apparel-screenprinting",
    title: "Business Apparel Screen Printing",
    category: "business",
    imagePath: "/images/our-work/business/business-apparel-screenprinting.webp",
    alt: "Layered business apparel with coordinated screen-printed branding",
    featured: false,
  },
  {
    id: "business-screenprinting",
    title: "Business Screen Printing",
    category: "business",
    imagePath: "/images/our-work/business/business-screenprinting.webp",
    alt: "Folded business shirts and polos ready for company-wide screen printing",
    featured: false,
  },
  {
    id: "screenprint-business-shirts",
    title: "Business Screen-Printed Shirts",
    category: "business",
    imagePath: "/images/our-work/business/screenprint-business-shirts.webp",
    alt: "Coordinated business shirts with company logo screen printing",
    featured: false,
  },
  {
    id: "business-t-shirt-screenprinting",
    title: "Business T-Shirt Screen Printing",
    category: "business",
    imagePath: "/images/our-work/business/business-t-shirt-screenprinting.webp",
    alt: "Retail-ready T-shirts with crisp multi-color screen printing for brands",
    featured: false,
  },
  {
    id: "plumber-screenprinting",
    title: "Plumbing Business Branded Apparel",
    category: "business",
    imagePath: "/images/our-work/business/plumber-screenprinting.webp",
    alt: "Service trade work shirts and hoodies with bold branded screen print",
    featured: false,
  },
  {
    id: "large-scale-screenprinting",
    title: "Large-Scale Screen Printing Run",
    category: "screen-printing",
    imagePath: "/images/our-work/screen-printing/large-scale-screenprinting.webp",
    alt: "High-volume screen printing setup for team and business orders",
    featured: true,
  },
  {
    id: "screenprint-shirts",
    title: "Custom Screen-Printed Shirts",
    category: "screen-printing",
    imagePath: "/images/our-work/screen-printing/screenprint-shirts.webp",
    alt: "Stack of custom T-shirts with multi-color screen-printed graphics",
    featured: false,
  },
  {
    id: "martial-arts-school-screenprinting",
    title: "Martial Arts School Screen Printing",
    category: "screen-printing",
    imagePath:
      "/images/our-work/screen-printing/martial-arts-school-screenprinting.webp",
    alt: "Martial arts school apparel with detailed screen-printed artwork",
    featured: false,
  },
  {
    id: "screen-printing-sweaters",
    title: "Screen-Printed Sweaters",
    category: "screen-printing",
    imagePath: "/images/our-work/screen-printing/screen-printing-sweaters.webp",
    alt: "Fleece sweaters with durable screen-printed school or club graphics",
    featured: false,
  },
  {
    id: "high-school-logo-hat-embroidery",
    title: "High School Logo Hat Embroidery",
    category: "embroidery",
    imagePath: "/images/our-work/embroidery/high-school-logo-hat-embroidery.webp",
    alt: "Custom embroidered high school logo on athletic hat",
    featured: true,
  },
  {
    id: "high-school-sports-embroidery",
    title: "High School Sports Embroidery",
    category: "embroidery",
    imagePath: "/images/our-work/embroidery/high-school-sports-embroidery.webp",
    alt: "Embroidered high school sports apparel by Esportiko",
    featured: false,
  },
  {
    id: "visor-screenprinting",
    title: "Custom Visor Screen Printing",
    category: "hats",
    imagePath: "/images/our-work/hats/visor-screenprinting.webp",
    alt: "Custom visor with front screen-printed logo for sun and sideline wear",
    featured: true,
  },
  {
    id: "screen-print-hats",
    title: "Screen-Printed Hats",
    category: "hats",
    imagePath: "/images/our-work/hats/screen-print-hats.webp",
    alt: "Assorted caps and hats with bold screen-printed front graphics",
    featured: false,
  },
];

export const CATEGORIES: { slug: WorkCategory; label: string }[] = [
  { slug: "teams", label: "Teams & Uniforms" },
  { slug: "business", label: "Business & Brand" },
  { slug: "screen-printing", label: "Screen Printing" },
  { slug: "embroidery", label: "Embroidery" },
  { slug: "hats", label: "Hats & Headwear" },
];

export function workCategoryLabel(slug: WorkCategory): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}
