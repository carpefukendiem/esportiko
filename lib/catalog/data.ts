import type {
  CatalogProduct,
  ProductColor,
  SanMarCategory,
  ProductStatus,
} from "@/lib/catalog/types";

const PH = "/images/catalog/placeholder.svg";

function color(displayColor: string): ProductColor {
  return {
    catalogColor: displayColor.toUpperCase().replace(/\s+/g, "_"),
    displayColor,
    swatchImageUrl: PH,
    modelImageUrl: PH,
  };
}

function colors(...names: string[]): ProductColor[] {
  return names.map(color);
}

function product(input: {
  uniqueKey: string;
  styleNumber: string;
  productTitle: string;
  brandName: string;
  productDescription: string;
  status: ProductStatus;
  sanMarCategory: SanMarCategory;
  availableSizes: string;
  colorNames: string[];
  decorationTypes: string[];
}): CatalogProduct {
  return {
    uniqueKey: input.uniqueKey,
    styleNumber: input.styleNumber,
    productTitle: input.productTitle,
    brandName: input.brandName,
    productDescription: input.productDescription,
    status: input.status,
    sanMarCategory: input.sanMarCategory,
    availableSizes: input.availableSizes,
    colors: colors(...input.colorNames),
    images: {
      productImageUrl: PH,
      thumbnailUrl: PH,
    },
    decorationTypes: input.decorationTypes,
  };
}

/**
 * Maps each browse slug to style numbers for placeholder data only.
 * SanMar integration will replace this with database queries keyed on category merge rules.
 */
export const MOCK_STYLE_NUMBERS_BY_DISPLAY_SLUG: Record<string, readonly string[]> = {
  tshirts: ["PC61", "PC55", "ST350"],
  "hoodies-sweatshirts": ["PC78H", "G185", "F497"],
  polos: ["K500", "K540", "LST353"],
  "jerseys-uniforms": ["J317", "A4N3142", "AG5999"],
  hats: ["C112", "B500", "BA672"],
  "jackets-outerwear": ["NF0A8BA", "J754", "JK100"],
  bottoms: ["LNP", "PT83", "M500"],
  "bags-accessories": ["BG118", "B149", "TMT1"],
};

/**
 * Placeholder catalog rows — shape matches future SanMar-derived records.
 * One discontinued row is included to verify fetcher-side filtering.
 */
export const MOCK_CATALOG_PRODUCTS: CatalogProduct[] = [
  product({
    uniqueKey: "PC61-001",
    styleNumber: "PC61",
    productTitle: "Port & Company — Essential Tee",
    brandName: "Port & Company",
    productDescription:
      "Heavyweight cotton tee with a classic fit. A dependable base for screen print and embroidery programs.",
    status: "Active",
    sanMarCategory: "T-Shirts",
    availableSizes: "Adult Sizes: S–6XL",
    colorNames: ["Navy", "Black", "White", "Athletic Heather", "Red", "Royal"],
    decorationTypes: ["Screen Print", "Embroidery"],
  }),
  product({
    uniqueKey: "PC55-001",
    styleNumber: "PC55",
    productTitle: "Port & Company — Core Blend Tee",
    brandName: "Port & Company",
    productDescription:
      "Soft cotton-poly blend with minimal shrink. Ideal for large team runs and event stacks.",
    status: "New",
    sanMarCategory: "T-Shirts",
    availableSizes: "Adult Sizes: XS–4XL",
    colorNames: ["Black", "Navy", "Charcoal", "Royal"],
    decorationTypes: ["Screen Print", "Heat Transfer"],
  }),
  product({
    uniqueKey: "ST350-001",
    styleNumber: "ST350",
    productTitle: "Sport-Tek — Competitor Tee",
    brandName: "Sport-Tek",
    productDescription:
      "Moisture-wicking performance tee for training and sideline wear.",
    status: "Regular",
    sanMarCategory: "T-Shirts",
    availableSizes: "Adult Sizes: XS–4XL",
    colorNames: ["True Royal", "Black", "Iron Grey", "White"],
    decorationTypes: ["Screen Print", "Embroidery"],
  }),
  product({
    uniqueKey: "PC78H-001",
    styleNumber: "PC78H",
    productTitle: "Port & Company — Core Fleece Hoodie",
    brandName: "Port & Company",
    productDescription:
      "Midweight fleece hoodie with front pouch pocket. A staple for spirit wear packages.",
    status: "Active",
    sanMarCategory: "Sweatshirts/Fleece",
    availableSizes: "Adult Sizes: S–4XL",
    colorNames: ["Navy", "Black", "Athletic Heather", "Forest Green"],
    decorationTypes: ["Screen Print", "Embroidery"],
  }),
  product({
    uniqueKey: "G185-001",
    styleNumber: "G185",
    productTitle: "Gildan — Heavy Blend Hooded Sweatshirt",
    brandName: "Gildan",
    productDescription:
      "Budget-friendly fleece hoodie for high-volume school and club orders.",
    status: "Regular",
    sanMarCategory: "Sweatshirts/Fleece",
    availableSizes: "Adult Sizes: S–5XL",
    colorNames: ["Black", "Navy", "Maroon", "Royal", "White"],
    decorationTypes: ["Screen Print"],
  }),
  product({
    uniqueKey: "F497-001",
    styleNumber: "F497",
    productTitle: "Sport-Tek — Sport-Wick Fleece Hooded Pullover",
    brandName: "Sport-Tek",
    productDescription:
      "Performance fleece with stretch and wicking for cool-weather training.",
    status: "New",
    sanMarCategory: "Sweatshirts/Fleece",
    availableSizes: "Adult Sizes: XS–4XL",
    colorNames: ["Black", "True Navy", "Iron Grey"],
    decorationTypes: ["Screen Print", "Embroidery"],
  }),
  product({
    uniqueKey: "K500-001",
    styleNumber: "K500",
    productTitle: "Port Authority — Silk Touch Polo",
    brandName: "Port Authority",
    productDescription:
      "Wrinkle-resistant polo with a soft hand — common pick for staff uniforms.",
    status: "Active",
    sanMarCategory: "Polos/Knits",
    availableSizes: "Adult Sizes: XS–4XL",
    colorNames: ["Black", "Navy", "White", "Red", "Royal"],
    decorationTypes: ["Embroidery", "Screen Print"],
  }),
  product({
    uniqueKey: "K540-001",
    styleNumber: "K540",
    productTitle: "Port Authority — Dry Zone UV Micro-Mesh Polo",
    brandName: "Port Authority",
    productDescription:
      "Breathable micro-mesh with UV protection for outdoor staff and coaches.",
    status: "Regular",
    sanMarCategory: "Polos/Knits",
    availableSizes: "Adult Sizes: XS–4XL",
    colorNames: ["Black", "True Royal", "White", "Grey Steel"],
    decorationTypes: ["Embroidery"],
  }),
  product({
    uniqueKey: "LST353-001",
    styleNumber: "LST353",
    productTitle: "Sport-Tek — Micropique Sport-Wick Polo",
    brandName: "Sport-Tek",
    productDescription:
      "Snag-resistant micropique polo built for active staff and league sidelines.",
    status: "New",
    sanMarCategory: "Polos/Knits",
    availableSizes: "Adult Sizes: XS–4XL",
    colorNames: ["Black", "True Navy", "Iron Grey", "White"],
    decorationTypes: ["Embroidery", "Heat Transfer"],
  }),
  product({
    uniqueKey: "J317-001",
    styleNumber: "J317",
    productTitle: "Sport-Tek — PosiCharge Replica Jersey",
    brandName: "Sport-Tek",
    productDescription:
      "Lightweight replica jersey base for numbers, names, and team crest work.",
    status: "Active",
    sanMarCategory: "Activewear",
    availableSizes: "Adult Sizes: XS–4XL",
    colorNames: ["True Royal", "White", "Black", "Scarlet"],
    decorationTypes: ["Screen Print", "Heat Transfer"],
  }),
  product({
    uniqueKey: "A4N3142-001",
    styleNumber: "A4N3142",
    productTitle: "A4 — Cooling Performance Muscle",
    brandName: "A4",
    productDescription:
      "Performance muscle tee pattern common in youth and adult league sets.",
    status: "Regular",
    sanMarCategory: "Activewear",
    availableSizes: "Adult Sizes: S–3XL · Youth XS–XL",
    colorNames: ["Navy", "Black", "White", "Royal"],
    decorationTypes: ["Screen Print", "Embroidery"],
  }),
  product({
    uniqueKey: "AG5999-001",
    styleNumber: "AG5999",
    productTitle: "Augusta Sportswear — Winning Streak Jersey",
    brandName: "Augusta Sportswear",
    productDescription:
      "Two-color athletic jersey body intended for numbers, names, and crest decoration.",
    status: "New",
    sanMarCategory: "Activewear",
    availableSizes: "Adult Sizes: S–3XL · Youth XS–XL",
    colorNames: ["Purple/Gold", "Navy/White", "Black/Scarlet"],
    decorationTypes: ["Screen Print", "Heat Transfer"],
  }),
  product({
    uniqueKey: "C112-001",
    styleNumber: "C112",
    productTitle: "Port Authority — Snapback Trucker Cap",
    brandName: "Port Authority",
    productDescription:
      "Classic trucker profile with structured front panels for front logo work.",
    status: "Active",
    sanMarCategory: "Caps",
    availableSizes: "One Size",
    colorNames: ["Navy/White", "Black/Charcoal", "Red/White"],
    decorationTypes: ["Embroidery", "Heat Transfer"],
  }),
  product({
    uniqueKey: "B500-001",
    styleNumber: "B500",
    productTitle: "Richardson — 112 Twill Back Trucker",
    brandName: "Richardson",
    productDescription:
      "Industry-standard trucker cap with deep crown and curved visor.",
    status: "Regular",
    sanMarCategory: "Caps",
    availableSizes: "One Size",
    colorNames: ["Navy", "Black/Black", "Cardinal", "Royal/White"],
    decorationTypes: ["Embroidery"],
  }),
  product({
    uniqueKey: "BA672-001",
    styleNumber: "BA672",
    productTitle: "New Era — Original Fit Diamond Era Cap",
    brandName: "New Era",
    productDescription:
      "Structured cap with performance fabric for sideline and retail programs.",
    status: "New",
    sanMarCategory: "Caps",
    availableSizes: "S/M · M/L",
    colorNames: ["Navy", "Black", "Graphite"],
    decorationTypes: ["Embroidery"],
  }),
  product({
    uniqueKey: "NF0A8BA-001",
    styleNumber: "NF0A8BA",
    productTitle: "The North Face — Apex Soft Shell Jacket",
    brandName: "The North Face",
    productDescription:
      "Wind-resistant soft shell for coaches, staff, and premium giveaways.",
    status: "Active",
    sanMarCategory: "Outerwear",
    availableSizes: "Adult Sizes: XS–3XL",
    colorNames: ["TNF Black", "Urban Navy", "Asphalt Grey"],
    decorationTypes: ["Embroidery", "Heat Transfer"],
  }),
  product({
    uniqueKey: "J754-001",
    styleNumber: "J754",
    productTitle: "Port Authority — Collective Soft Shell Jacket",
    brandName: "Port Authority",
    productDescription:
      "Water-resistant soft shell with clean lines for embroidery placement.",
    status: "Regular",
    sanMarCategory: "Outerwear",
    availableSizes: "Adult Sizes: XS–4XL",
    colorNames: ["Black", "True Navy", "Iron Grey"],
    decorationTypes: ["Embroidery"],
  }),
  product({
    uniqueKey: "JK100-001",
    styleNumber: "JK100",
    productTitle: "CornerStone — ANSI Class 3 Jacket",
    brandName: "CornerStone",
    productDescription:
      "Hi-vis shell for workwear programs requiring reflective decoration zones.",
    status: "Coming Soon",
    sanMarCategory: "Outerwear",
    availableSizes: "Adult Sizes: S–4XL",
    colorNames: ["Safety Yellow", "Safety Orange"],
    decorationTypes: ["Heat Transfer", "Screen Print"],
  }),
  product({
    uniqueKey: "LNP-001",
    styleNumber: "LNP",
    productTitle: "Sport-Tek — Open Bottom Sweatpant",
    brandName: "Sport-Tek",
    productDescription:
      "Fleece sweatpant with open bottom — pairs with decorated hoodies and tees.",
    status: "Active",
    sanMarCategory: "Bottoms",
    availableSizes: "Adult Sizes: XS–4XL",
    colorNames: ["Black", "True Navy", "Athletic Heather"],
    decorationTypes: ["Screen Print", "Embroidery"],
  }),
  product({
    uniqueKey: "PT83-001",
    styleNumber: "PT83",
    productTitle: "Port Authority — Core Classic Pique Short",
    brandName: "Port Authority",
    productDescription:
      "Casual pique short for camps, intramurals, and warm-weather uniforms.",
    status: "Regular",
    sanMarCategory: "Bottoms",
    availableSizes: "Adult Sizes: S–3XL",
    colorNames: ["Black", "Navy", "Khaki"],
    decorationTypes: ["Embroidery"],
  }),
  product({
    uniqueKey: "M500-001",
    styleNumber: "M500",
    productTitle: "Mercer+Mettle — Stretch Jogger",
    brandName: "Mercer+Mettle",
    productDescription:
      "Modern jogger silhouette for lifestyle and staff uniform extensions.",
    status: "New",
    sanMarCategory: "Bottoms",
    availableSizes: "Adult Sizes: XS–4XL",
    colorNames: ["Black", "Heather Grey", "Navy"],
    decorationTypes: ["Embroidery", "Heat Transfer"],
  }),
  product({
    uniqueKey: "BG118-001",
    styleNumber: "BG118",
    productTitle: "Port Authority — Cotton Canvas Tote",
    brandName: "Port Authority",
    productDescription:
      "Sturdy canvas tote for events, onboarding kits, and retail add-ons.",
    status: "Active",
    sanMarCategory: "Bags",
    availableSizes: "One Size",
    colorNames: ["Natural", "Black", "Navy"],
    decorationTypes: ["Screen Print", "Embroidery"],
  }),
  product({
    uniqueKey: "B149-001",
    styleNumber: "B149",
    productTitle: "Port Authority — Cinch Pack",
    brandName: "Port Authority",
    productDescription:
      "Lightweight drawstring pack for camps, races, and school programs.",
    status: "Regular",
    sanMarCategory: "Bags",
    availableSizes: "One Size",
    colorNames: ["Black", "True Royal", "Red"],
    decorationTypes: ["Screen Print", "Embroidery"],
  }),
  product({
    uniqueKey: "TMT1-001",
    styleNumber: "TMT1",
    productTitle: "Sportsman — Pigment-Dyed Cap",
    brandName: "Sportsman",
    productDescription:
      "Vintage-wash cap style often used in retail and lifestyle merch drops.",
    status: "New",
    sanMarCategory: "Accessories",
    availableSizes: "One Size",
    colorNames: ["Khaki", "Navy", "Black"],
    decorationTypes: ["Embroidery"],
  }),
  /** Exercises fetcher-side removal of non-sellable rows */
  product({
    uniqueKey: "ST999-001",
    styleNumber: "ST999",
    productTitle: "Legacy Style — Archived Blank",
    brandName: "Sample Brand",
    productDescription: "Row used only to verify discontinued styles never render.",
    status: "Discontinued",
    sanMarCategory: "T-Shirts",
    availableSizes: "N/A",
    colorNames: ["Grey"],
    decorationTypes: ["Screen Print"],
  }),
];
