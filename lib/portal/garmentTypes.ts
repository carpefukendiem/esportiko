/** Allowed garment_type values for portal orders and quote flows. */

export const GARMENT_TYPE_VALUES = [
  "Jerseys",
  "Hoodies",
  "T-Shirts",
  "Polos",
  "Hats",
  "Warm-ups",
  "Spirit Wear",
  "Other",
] as const;

export type GarmentTypeValue = (typeof GARMENT_TYPE_VALUES)[number];
