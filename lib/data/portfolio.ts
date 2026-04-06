import { media } from "@/lib/data/media";

export type PortfolioCategory =
  | "Hats"
  | "Jerseys"
  | "Polos"
  | "Hoodies"
  | "Tees"
  | "Business Apparel"
  | "Team Uniforms";

export interface PortfolioItem {
  id: string;
  title: string;
  category: PortfolioCategory;
  image: string;
  alt: string;
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: "1",
    title: "Branded cap — embroidery",
    category: "Hats",
    image: media.portfolio.hat,
    alt: "Custom embroidered baseball cap with brand logo for Santa Barbara clients",
  },
  {
    id: "2",
    title: "Team jersey — back names & numbers",
    category: "Team Uniforms",
    image: media.portfolio.jerseyBack,
    alt: "Custom team jersey back with player name and number decoration",
  },
  {
    id: "3",
    title: "Dark hoodie — front branding",
    category: "Hoodies",
    image: media.portfolio.hoodieDark,
    alt: "Dark fleece hoodie with custom front screen print or embroidery",
  },
  {
    id: "4",
    title: "Polo — chest embroidery",
    category: "Polos",
    image: media.portfolio.polo,
    alt: "Polo shirt with professional left-chest embroidery for staff uniforms",
  },
  {
    id: "5",
    title: "Blue hoodie — program package",
    category: "Hoodies",
    image: media.portfolio.hoodieBlue,
    alt: "Blue branded hoodie for team or school spirit wear on the Central Coast",
  },
  {
    id: "6",
    title: "Headwear — business program",
    category: "Business Apparel",
    image: media.portfolio.businessHat,
    alt: "Isolated branded cap for restaurant or retail staff uniform programs",
  },
  {
    id: "7",
    title: "Brand kit — apparel lineup",
    category: "Business Apparel",
    image: media.portfolio.businessCard,
    alt: "Branded apparel presentation with hat, shirt, and coordinated merchandise",
  },
  {
    id: "8",
    title: "Screen print graphic — tee or top",
    category: "Tees",
    image: media.portfolio.screenPrint,
    alt: "Bold screen-printed graphic on apparel for events and team merch",
  },
  {
    id: "9",
    title: "Structured cap — team sideline",
    category: "Hats",
    image: media.portfolio.hat,
    alt: "Structured team cap with front logo for sideline and fan wear",
  },
  {
    id: "10",
    title: "Uniform jersey — league set",
    category: "Jerseys",
    image: media.portfolio.jerseyBack,
    alt: "League or club jersey with custom numbering and personalization",
  },
  {
    id: "11",
    title: "Embroidered work shirt",
    category: "Business Apparel",
    image: media.portfolio.embroidery,
    alt: "Embroidered shirt graphic for trades, service businesses, and staff uniforms",
  },
  {
    id: "12",
    title: "Team uniform package",
    category: "Team Uniforms",
    image: media.portfolio.teamUniformsGraphic,
    alt: "Coordinated team uniform pieces for schools and athletic programs",
  },
  {
    id: "13",
    title: "Event tee — spot-color print",
    category: "Tees",
    image: media.portfolio.screenPrint,
    alt: "Event or fundraiser tee with vibrant screen-printed artwork",
  },
  {
    id: "14",
    title: "Branded merchandise suite",
    category: "Business Apparel",
    image: media.portfolio.brandedGraphic,
    alt: "Custom branded apparel and merch for local business marketing",
  },
  {
    id: "15",
    title: "Warmup / spirit hoodie",
    category: "Hoodies",
    image: media.portfolio.hoodieDark,
    alt: "Team warmup hoodie with custom decoration for Central Coast athletics",
  },
  {
    id: "16",
    title: "Long-run print project",
    category: "Tees",
    image: media.portfolio.screenPrint,
    alt: "High-impact screen printing for bulk runs and organization-wide orders",
  },
];
