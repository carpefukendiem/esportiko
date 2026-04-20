/**
 * Catalog domain types — browse-only, quote conversion.
 * Commercial terms are intentionally omitted from this layer.
 */

export type SanMarCategory =
  | "Activewear"
  | "Accessories"
  | "Bags"
  | "Bottoms"
  | "Caps"
  | "Infant & Toddler"
  | "Juniors & Young Men"
  | "Outerwear"
  | "Personal Protection"
  | "Polos/Knits"
  | "Sweatshirts/Fleece"
  | "T-Shirts"
  | "Tall"
  | "Women's"
  | "Workwear"
  | "Woven Shirts"
  | "Youth";

export type ProductStatus =
  | "Active"
  | "New"
  | "Coming Soon"
  | "Discontinued"
  | "Regular";

export type ProductColor = {
  catalogColor: string;
  displayColor: string;
  swatchImageUrl: string;
  modelImageUrl: string;
  flatImageUrl?: string;
  backFlatImageUrl?: string;
};

export type CatalogProduct = {
  uniqueKey: string;
  styleNumber: string;
  productTitle: string;
  brandName: string;
  productDescription: string;
  status: ProductStatus;
  sanMarCategory: SanMarCategory;
  availableSizes: string;
  colors: ProductColor[];
  images: {
    productImageUrl: string;
    thumbnailUrl: string;
    frontModelUrl?: string;
    backModelUrl?: string;
    frontFlatUrl?: string;
    backFlatUrl?: string;
    specSheetUrl?: string;
  };
  decorationTypes: string[];
};

export type DisplayCategory = {
  slug: string;
  label: string;
  description: string;
  icon: string;
  sanMarCategories: SanMarCategory[];
};
