/**
 * Placeholder SanMar-style catalog for marketing / browse UI.
 * Replaced by live data when SOAP + FTP pipelines are wired.
 */

export type SanMarSeedCategory =
  | "T-Shirts"
  | "Hoodies"
  | "Polos"
  | "Jerseys"
  | "Hats";

export type SanMarDecorationMethod = "Screen Print" | "Embroidery" | "Both";

export interface SanMarSeedProduct {
  style_number: string;
  name: string;
  brand: string;
  category: SanMarSeedCategory;
  description: string;
  available_colors: string[];
  available_sizes: string[];
  /** Raster preview URL; empty uses in-card placeholder artwork. */
  image_url: string;
  decoration_methods: SanMarDecorationMethod[];
  min_quantity: number;
}

const SIZES_STD = ["XS", "S", "M", "L", "XL", "2XL", "3XL"] as const;
const SIZES_CAP = ["S/M", "M/L", "L/XL"] as const;

export const SANMAR_SEED_PRODUCTS: SanMarSeedProduct[] = [
  {
    style_number: "PC61",
    name: "Port & Company Core Cotton Tee",
    brand: "Port & Company",
    category: "T-Shirts",
    description:
      "Heavyweight cotton tee with a reliable fit for teams and events. Takes ink and embroidery beautifully for everyday uniforms.",
    available_colors: ["Black", "Navy", "White", "Athletic Heather", "Royal", "Red"],
    available_sizes: [...SIZES_STD],
    image_url: "",
    decoration_methods: ["Both"],
    min_quantity: 12,
  },
  {
    style_number: "PC55",
    name: "Port & Company Core Blend Tee",
    brand: "Port & Company",
    category: "T-Shirts",
    description:
      "Soft cotton-poly blend with minimal shrink for repeat orders. Ideal for school spirit stacks and sponsor-backed runs.",
    available_colors: ["Black", "Navy", "Charcoal", "Royal", "Maroon"],
    available_sizes: [...SIZES_STD],
    image_url: "",
    decoration_methods: ["Screen Print", "Embroidery"],
    min_quantity: 12,
  },
  {
    style_number: "ST350",
    name: "Sport-Tek PosiCharge Competitor Tee",
    brand: "Sport-Tek",
    category: "T-Shirts",
    description:
      "Moisture-wicking performance tee for training and sidelines. Lightweight body that holds crisp screen print and tackle twill numbers.",
    available_colors: ["True Royal", "Black", "Iron Grey", "White", "Scarlet"],
    available_sizes: [...SIZES_STD],
    image_url: "",
    decoration_methods: ["Screen Print", "Embroidery"],
    min_quantity: 6,
  },
  {
    style_number: "BC3001",
    name: "Bella+Canvas Unisex Jersey Tee",
    brand: "Bella+Canvas",
    category: "T-Shirts",
    description:
      "Retail-soft jersey with a modern side-seamed fit. Popular for lifestyle merch and premium team retail add-ons.",
    available_colors: ["Black", "Heather Navy", "Asphalt", "White", "True Royal"],
    available_sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    image_url: "",
    decoration_methods: ["Screen Print"],
    min_quantity: 24,
  },
  {
    style_number: "PC78H",
    name: "Port & Company Core Fleece Pullover Hoodie",
    brand: "Port & Company",
    category: "Hoodies",
    description:
      "Midweight fleece hoodie with a front pouch pocket. A go-to for fall leagues and staff layering programs.",
    available_colors: ["Black", "Navy", "Athletic Heather", "Forest Green", "Maroon"],
    available_sizes: [...SIZES_STD],
    image_url: "",
    decoration_methods: ["Both"],
    min_quantity: 12,
  },
  {
    style_number: "PC90H",
    name: "Port & Company Essential Fleece Hoodie",
    brand: "Port & Company",
    category: "Hoodies",
    description:
      "Clean essential fleece with a smooth print surface across the chest. Built for high-volume spirit wear packages.",
    available_colors: ["Black", "True Navy", "Charcoal", "Royal", "Cardinal"],
    available_sizes: [...SIZES_STD],
    image_url: "",
    decoration_methods: ["Screen Print", "Embroidery"],
    min_quantity: 12,
  },
  {
    style_number: "G185",
    name: "Gildan Heavy Blend Hooded Sweatshirt",
    brand: "Gildan",
    category: "Hoodies",
    description:
      "Budget-friendly fleece for large school and club orders. Pairs well with matching sweatpants for uniform bundles.",
    available_colors: ["Black", "Navy", "Maroon", "Royal", "White", "Sports Grey"],
    available_sizes: [...SIZES_STD],
    image_url: "",
    decoration_methods: ["Screen Print"],
    min_quantity: 24,
  },
  {
    style_number: "ST254",
    name: "Sport-Tek Pullover Hooded Sweatshirt",
    brand: "Sport-Tek",
    category: "Hoodies",
    description:
      "Performance fleece with stretch for cool-weather training. Wicking interior keeps athletes comfortable under shells.",
    available_colors: ["Black", "True Navy", "Iron Grey", "Forest Green"],
    available_sizes: [...SIZES_STD],
    image_url: "",
    decoration_methods: ["Embroidery", "Screen Print"],
    min_quantity: 6,
  },
  {
    style_number: "K500",
    name: "Port Authority Silk Touch Polo",
    brand: "Port Authority",
    category: "Polos",
    description:
      "The default staff polo with a soft hand and wrinkle resistance. Embroidery-friendly placket and collar structure.",
    available_colors: ["Black", "Navy", "White", "Red", "Royal", "Stone"],
    available_sizes: [...SIZES_STD],
    image_url: "",
    decoration_methods: ["Embroidery", "Screen Print"],
    min_quantity: 6,
  },
  {
    style_number: "K540",
    name: "Port Authority Silk Touch Performance Polo",
    brand: "Port Authority",
    category: "Polos",
    description:
      "Breathable micro-mesh for outdoor staff and coaches. UV-minded fabric for long tournament days on the Central Coast.",
    available_colors: ["Black", "True Royal", "White", "Grey Steel", "Navy"],
    available_sizes: [...SIZES_STD],
    image_url: "",
    decoration_methods: ["Embroidery"],
    min_quantity: 6,
  },
  {
    style_number: "ST640",
    name: "Sport-Tek PosiCharge RacerMesh Polo",
    brand: "Sport-Tek",
    category: "Polos",
    description:
      "Snag-resistant mesh polo built for active sidelines. Holds crisp left-chest embroidery and small sleeve hits.",
    available_colors: ["Black", "True Navy", "Iron Grey", "White", "Kelly Green"],
    available_sizes: [...SIZES_STD],
    image_url: "",
    decoration_methods: ["Embroidery", "Screen Print"],
    min_quantity: 6,
  },
  {
    style_number: "LST353",
    name: "Sport-Tek Micropique Sport-Wick Polo",
    brand: "Sport-Tek",
    category: "Polos",
    description:
      "Women's-fit micropique with a tapered silhouette. Popular for hospitality uniforms and golf outings.",
    available_colors: ["Black", "True Navy", "Iron Grey", "White", "Pink Raspberry"],
    available_sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    image_url: "",
    decoration_methods: ["Embroidery"],
    min_quantity: 6,
  },
  {
    style_number: "ST380",
    name: "Sport-Tek PosiCharge Tough Mesh Full-Button Jersey",
    brand: "Sport-Tek",
    category: "Jerseys",
    description:
      "Full-button mesh jersey base for tackle twill numbers and crest work. Built for baseball and softball programs.",
    available_colors: ["White/Black", "Grey/Black", "True Royal/White", "Scarlet/White"],
    available_sizes: [...SIZES_STD],
    image_url: "",
    decoration_methods: ["Screen Print", "Embroidery"],
    min_quantity: 12,
  },
  {
    style_number: "ST700",
    name: "Sport-Tek PosiCharge Replica Jersey",
    brand: "Sport-Tek",
    category: "Jerseys",
    description:
      "Lightweight replica body for names, numbers, and sponsor patches. Dries quickly between innings and practices.",
    available_colors: ["True Royal", "White", "Black", "Scarlet", "Purple"],
    available_sizes: [...SIZES_STD],
    image_url: "",
    decoration_methods: ["Screen Print"],
    min_quantity: 12,
  },
  {
    style_number: "N3142",
    name: "A4 Cooling Performance Muscle",
    brand: "A4",
    category: "Jerseys",
    description:
      "Performance muscle silhouette common in youth and adult league sets. Ideal for two-color screen print layouts.",
    available_colors: ["Navy", "Black", "White", "Royal", "Graphite"],
    available_sizes: ["S", "M", "L", "XL", "2XL"],
    image_url: "",
    decoration_methods: ["Screen Print", "Embroidery"],
    min_quantity: 12,
  },
  {
    style_number: "AG5999",
    name: "Augusta Winning Streak Jersey",
    brand: "Augusta Sportswear",
    category: "Jerseys",
    description:
      "Two-color athletic jersey body for numbers and crest decoration. Built for contrast panels that pop on field.",
    available_colors: ["Purple/Gold", "Navy/White", "Black/Scarlet", "Royal/White"],
    available_sizes: ["S", "M", "L", "XL", "2XL"],
    image_url: "",
    decoration_methods: ["Screen Print"],
    min_quantity: 12,
  },
  {
    style_number: "C112",
    name: "Richardson 112 Trucker Cap",
    brand: "Richardson",
    category: "Hats",
    description:
      "Industry-standard trucker profile with structured front panels. Front logo embroidery is the default decoration path.",
    available_colors: ["Navy/White", "Black/Charcoal", "Cardinal/White", "Royal/White"],
    available_sizes: ["One Size"],
    image_url: "",
    decoration_methods: ["Embroidery"],
    min_quantity: 12,
  },
  {
    style_number: "NE1000",
    name: "New Era Structured Stretch Cotton Cap",
    brand: "New Era",
    category: "Hats",
    description:
      "Structured stretch-fit cap for retail-quality headwear programs. Clean crown for centered embroidery marks.",
    available_colors: ["Navy", "Black", "Graphite", "Cardinal"],
    available_sizes: [...SIZES_CAP],
    image_url: "",
    decoration_methods: ["Embroidery"],
    min_quantity: 12,
  },
  {
    style_number: "B500",
    name: "Richardson Twill Back Trucker",
    brand: "Richardson",
    category: "Hats",
    description:
      "Deep crown trucker with curved visor for classic sideline look. Mesh back keeps crews cool in warm weather.",
    available_colors: ["Navy", "Black/Black", "Cardinal", "Loden"],
    available_sizes: ["One Size"],
    image_url: "",
    decoration_methods: ["Embroidery", "Screen Print"],
    min_quantity: 12,
  },
  {
    style_number: "CP80",
    name: "Port & Company Six-Panel Twill Cap",
    brand: "Port & Company",
    category: "Hats",
    description:
      "Budget-friendly twill cap for camps and giveaways. Dependable six-panel build for single-hit front logos.",
    available_colors: ["Black", "Navy", "Khaki", "Spruce", "White"],
    available_sizes: ["One Size"],
    image_url: "",
    decoration_methods: ["Embroidery"],
    min_quantity: 24,
  },
];
