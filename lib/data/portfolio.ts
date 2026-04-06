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
    title: "Navy Baseball Cap with Embroidered Logo",
    category: "Hats",
    image: "/images/portfolio/hat-navy-embroidery.svg",
    alt: "Navy baseball cap with embroidered business logo — custom headwear Santa Barbara",
  },
  {
    id: "2",
    title: "Soccer Jersey Set — Names and Numbers",
    category: "Team Uniforms",
    image: "/images/portfolio/jersey-soccer-team.svg",
    alt: "Soccer jerseys with player names and numbers for Central Coast club team",
  },
  {
    id: "3",
    title: "Heather Hoodie — Front Screen Print",
    category: "Hoodies",
    image: "/images/portfolio/hoodie-heather-print.svg",
    alt: "Heather gray hoodie with front screen printed school design",
  },
  {
    id: "4",
    title: "Restaurant Polo — Left Chest Stitch",
    category: "Polos",
    image: "/images/portfolio/polo-restaurant-embroidery.svg",
    alt: "Black polo shirt with left chest embroidery for restaurant staff uniforms",
  },
  {
    id: "5",
    title: "Softshell Jacket — Back Logo",
    category: "Business Apparel",
    image: "/images/portfolio/jacket-softshell-business.svg",
    alt: "Softshell jacket with back embroidery for local business outerwear",
  },
  {
    id: "6",
    title: "Event Tee — Two-Color Front",
    category: "Tees",
    image: "/images/portfolio/tee-event-twocolor.svg",
    alt: "Cotton tee with two-color screen print for community event merchandise",
  },
  {
    id: "7",
    title: "Youth Baseball Jersey — Number Stack",
    category: "Jerseys",
    image: "/images/portfolio/jersey-youth-baseball.svg",
    alt: "Youth baseball jersey with stacked back number screen printing",
  },
  {
    id: "8",
    title: "Trucker Hat — Flat Stitch Front",
    category: "Hats",
    image: "/images/portfolio/hat-trucker-flat.svg",
    alt: "Trucker hat with flat embroidery on front panel",
  },
  {
    id: "9",
    title: "Basketball Reversible — Team Package",
    category: "Team Uniforms",
    image: "/images/portfolio/jersey-basketball-reversible.svg",
    alt: "Reversible basketball jerseys for league team uniform package",
  },
  {
    id: "10",
    title: "Nonprofit Fundraiser Hoodie",
    category: "Hoodies",
    image: "/images/portfolio/hoodie-nonprofit-fundraiser.svg",
    alt: "Charcoal hoodie screen printed for nonprofit fundraiser campaign",
  },
  {
    id: "11",
    title: "Staff Apron — Chest Print",
    category: "Business Apparel",
    image: "/images/portfolio/apron-staff-print.svg",
    alt: "Canvas apron with chest screen print for cafe staff uniforms",
  },
  {
    id: "12",
    title: "Long Sleeve Tee — Sleeve Hit",
    category: "Tees",
    image: "/images/portfolio/tee-longsleeve-sleeve.svg",
    alt: "Long sleeve tee with sleeve print and small front logo",
  },
  {
    id: "13",
    title: "Volleyball Warmup — Script Back",
    category: "Team Uniforms",
    image: "/images/portfolio/hoodie-volleyball-warmup.svg",
    alt: "Volleyball team warmup hoodie with script back print",
  },
  {
    id: "14",
    title: "Corporate Quarter-Zip — Tone on Tone",
    category: "Business Apparel",
    image: "/images/portfolio/pullover-quarterzip-corporate.svg",
    alt: "Quarter-zip pullover with tone-on-tone embroidery for corporate apparel",
  },
  {
    id: "15",
    title: "Lacrosse Pinnie Set",
    category: "Jerseys",
    image: "/images/portfolio/jersey-lacrosse-pinnie.svg",
    alt: "Lacrosse pinnies with numbers for practice and game day",
  },
  {
    id: "16",
    title: "School Spirit Tee — Large Front",
    category: "Tees",
    image: "/images/portfolio/tee-school-spirit.svg",
    alt: "School spirit t-shirt with oversized front screen print",
  },
];
