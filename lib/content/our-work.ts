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
    id: "jersey-names-numbers",
    title: "Team jersey — back names & numbers",
    category: "teams",
    imagePath: "/images/our-work/teams/jersey-names-numbers.webp",
    alt: "Custom team jersey back with player name and number decoration",
    featured: true,
  },
  {
    id: "uniform-program",
    title: "Team uniform package",
    category: "teams",
    imagePath: "/images/our-work/teams/uniform-program.webp",
    alt: "Coordinated team uniform pieces for schools and athletic programs",
  },
  {
    id: "spirit-hoodie",
    title: "Spirit hoodie — dark fleece",
    category: "teams",
    imagePath: "/images/our-work/teams/spirit-hoodie.webp",
    alt: "Dark fleece hoodie with custom front screen print or embroidery",
  },
  {
    id: "warmup-hoodie",
    title: "Warmup hoodie — program package",
    category: "teams",
    imagePath: "/images/our-work/teams/warmup-hoodie.webp",
    alt: "Blue branded hoodie for team or school spirit wear",
  },
  {
    id: "staff-polo",
    title: "Staff polo — chest embroidery",
    category: "business",
    imagePath: "/images/our-work/business/staff-polo.webp",
    alt: "Polo shirt with professional left-chest embroidery for staff uniforms",
  },
  {
    id: "corporate-headwear",
    title: "Corporate headwear program",
    category: "business",
    imagePath: "/images/our-work/business/corporate-headwear.webp",
    alt: "Branded cap for restaurant or retail staff uniform programs",
  },
  {
    id: "brand-lineup",
    title: "Brand kit — apparel lineup",
    category: "business",
    imagePath: "/images/our-work/business/brand-lineup.webp",
    alt: "Branded apparel presentation with coordinated merchandise",
  },
  {
    id: "merchandise-suite",
    title: "Branded merchandise suite",
    category: "business",
    imagePath: "/images/our-work/business/merchandise-suite.webp",
    alt: "Custom branded apparel and merch for local business marketing",
  },
  {
    id: "spot-color-tee",
    title: "Screen print — spot-color tee",
    category: "screen-printing",
    imagePath: "/images/our-work/screen-printing/spot-color-tee.webp",
    alt: "Bold screen-printed graphic on apparel for events and team merch",
  },
  {
    id: "event-graphic",
    title: "Event tee — vibrant graphic",
    category: "screen-printing",
    imagePath: "/images/our-work/screen-printing/event-graphic.webp",
    alt: "Event or fundraiser tee with vibrant screen-printed artwork",
  },
  {
    id: "work-shirt-detail",
    title: "Embroidered work shirt",
    category: "embroidery",
    imagePath: "/images/our-work/embroidery/work-shirt-detail.webp",
    alt: "Embroidered shirt for trades, service businesses, and staff uniforms",
  },
  {
    id: "structured-team-cap",
    title: "Structured cap — embroidery",
    category: "hats",
    imagePath: "/images/our-work/hats/structured-team-cap.webp",
    alt: "Custom embroidered baseball cap with brand logo",
    featured: true,
  },
  {
    id: "sideline-cap",
    title: "Structured cap — team sideline",
    category: "hats",
    imagePath: "/images/our-work/hats/sideline-cap.webp",
    alt: "Structured team cap with front logo for sideline and fan wear",
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
