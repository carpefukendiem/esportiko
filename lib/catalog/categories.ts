import type { DisplayCategory } from "@/lib/catalog/types";

export const DISPLAY_CATEGORIES: DisplayCategory[] = [
  {
    slug: "tshirts",
    label: "T-Shirts",
    description:
      "Core tees and performance knits for teams, events, and everyday wear.",
    icon: "Shirt",
    sanMarCategories: ["T-Shirts", "Activewear"],
  },
  {
    slug: "hoodies-sweatshirts",
    label: "Hoodies & Sweatshirts",
    description:
      "Fleece layers, hoodies, and crews built for decoration and repeat wear.",
    icon: "Layers",
    sanMarCategories: ["Sweatshirts/Fleece"],
  },
  {
    slug: "polos",
    label: "Polos",
    description:
      "Knit polos for staff uniforms, golf outings, and polished casual programs.",
    icon: "CircleDot",
    sanMarCategories: ["Polos/Knits"],
  },
  {
    slug: "jerseys-uniforms",
    label: "Jerseys & Uniforms",
    description:
      "Athletic cuts and uniform bases we decorate for league and school play.",
    icon: "Trophy",
    sanMarCategories: ["Activewear"],
  },
  {
    slug: "hats",
    label: "Hats & Headwear",
    description:
      "Structured and relaxed caps for sideline, retail, and promo programs.",
    icon: "Circle",
    sanMarCategories: ["Caps"],
  },
  {
    slug: "jackets-outerwear",
    label: "Jackets & Outerwear",
    description:
      "Shells, soft shells, and insulated layers for crews and fan wear.",
    icon: "Wind",
    sanMarCategories: ["Outerwear"],
  },
  {
    slug: "bottoms",
    label: "Pants & Shorts",
    description:
      "Shorts, joggers, and work bottoms that pair with decorated tops.",
    icon: "Footprints",
    sanMarCategories: ["Bottoms"],
  },
  {
    slug: "bags-accessories",
    label: "Bags & Accessories",
    description:
      "Totes, packs, and add-ons that carry your brand off the garment rack.",
    icon: "ShoppingBag",
    sanMarCategories: ["Bags", "Accessories"],
  },
];
