export interface CustomizeProduct {
  style_number: string;
  product_title: string;
  brand_name: string;
  product_description: string | null;
  sanmar_category: string;
  available_sizes: string | null;
  front_flat_url: string | null;
  back_flat_url: string | null;
  colors: Array<{
    catalog_color: string;
    display_color: string;
    pms_color: string | null;
    swatch_image_url: string | null;
  }>;
  sizes: string[];
}
