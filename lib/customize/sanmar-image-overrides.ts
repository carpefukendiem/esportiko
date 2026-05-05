/**
 * Manual overrides for SanMar product images.
 *
 * SanMar's EPDD CSV does NOT include true flat-lay image URLs (the
 * cdnp.sanmar.com/medias/sys_master/... ones that show a clean
 * un-folded garment with no model). Those URLs require unique hashes
 * we can't construct.
 *
 * For SKUs/colors where we want true flat-lay quality on /customize,
 * paste the URLs here. The parser checks this map first, then falls
 * back to constructed COLOR_PRODUCT_IMAGE URLs (folded shots).
 *
 * URL pattern (for reference when curating):
 *   https://cdnp.sanmar.com/medias/sys_master/images/[hash1]/[hash2]/[id]/...FlatFront.jpg
 *
 * To add an override:
 *   1. Visit https://www.sanmar.com/p/[catalogNum]_[Color]
 *      (e.g., https://www.sanmar.com/p/63184_LightBlue)
 *   2. Right-click the front image, Copy Image Address
 *   3. Paste below under the matching style + color + "front"
 *   4. Repeat for back if available
 *
 * Keys are normalized: style_number is uppercase, catalog_color uses
 * SanMar's exact case from the URL (e.g., "LightBlue", "MilGreen").
 */
export type SanMarImageOverride = {
  front?: string;
  back?: string;
};

export const SANMAR_IMAGE_OVERRIDES: Record<
  string,
  Record<string, SanMarImageOverride>
> = {
  // Example seed data — A4N3402 verified working URLs:
  A4N3402: {
    Black: {
      front:
        "https://cdnp.sanmar.com/medias/sys_master/images/h05/h5b/30948401283102/624Wx724H_63184_Black-12-A4N3402BlackFlatFront/624Wx724H-63184-Black-12-A4N3402BlackFlatFront.jpg",
      back:
        "https://cdnp.sanmar.com/medias/sys_master/images/h03/h5e/30948401348638/624Wx724H_63184_Black-13-A4N3402BlackFlatBack/624Wx724H-63184-Black-13-A4N3402BlackFlatBack.jpg",
    },
    LightBlue: {
      front:
        "https://cdnp.sanmar.com/medias/sys_master/images/hd4/h64/30948401545246/624Wx724H_63184_LightBlue-12-A4N3402LightBlueFlatFront/624Wx724H-63184-LightBlue-12-A4N3402LightBlueFlatFront.jpg",
      back:
        "https://cdnp.sanmar.com/medias/sys_master/images/he4/h67/30948401610782/624Wx724H_63184_LightBlue-13-A4N3402LightBlueFlatBack/624Wx724H-63184-LightBlue-13-A4N3402LightBlueFlatBack.jpg",
    },
    Navy: {
      front:
        "https://cdnp.sanmar.com/medias/sys_master/images/h93/h68/30948401676318/624Wx724H_63184_Navy-12-A4N3402NavyFlatFront/624Wx724H-63184-Navy-12-A4N3402NavyFlatFront.jpg",
      back:
        "https://cdnp.sanmar.com/medias/sys_master/images/ha3/h6b/30948401741854/624Wx724H_63184_Navy-13-A4N3402NavyFlatBack/624Wx724H-63184-Navy-13-A4N3402NavyFlatBack.jpg",
    },
    Royal: {
      front:
        "https://cdnp.sanmar.com/medias/sys_master/images/ha2/h6e/30948401807390/624Wx724H_63184_Royal-12-A4N3402RoyalFlatFront/624Wx724H-63184-Royal-12-A4N3402RoyalFlatFront.jpg",
      back:
        "https://cdnp.sanmar.com/medias/sys_master/images/h63/h6f/30948401872926/624Wx724H_63184_Royal-13-A4N3402RoyalFlatBack/624Wx724H-63184-Royal-13-A4N3402RoyalFlatBack.jpg",
    },
    Scarlet: {
      front:
        "https://cdnp.sanmar.com/medias/sys_master/images/h61/h72/30948401938462/624Wx724H_63184_Scarlet-12-A4N3402ScarletFlatFront/624Wx724H-63184-Scarlet-12-A4N3402ScarletFlatFront.jpg",
      back:
        "https://cdnp.sanmar.com/medias/sys_master/images/h1d/hbd/30948402003998/624Wx724H_63184_Scarlet-13-A4N3402ScarletFlatBack/624Wx724H-63184-Scarlet-13-A4N3402ScarletFlatBack.jpg",
    },
    White: {
      front:
        "https://cdnp.sanmar.com/medias/sys_master/images/h36/h3b/30948395810846/624Wx724H_63184_White-12-A4N3402WhiteFlatFront/624Wx724H-63184-White-12-A4N3402WhiteFlatFront.jpg",
      back:
        "https://cdnp.sanmar.com/medias/sys_master/images/h4c/h3f/30948395974686/624Wx724H_63184_White-13-A4N3402WhiteFlatBack/624Wx724H-63184-White-13-A4N3402WhiteFlatBack.jpg",
    },
    Graphite: {
      front:
        "https://cdnp.sanmar.com/medias/sys_master/images/h14/h61/30948401414174/624Wx724H_63184_Graphite-12-A4N3402GraphiteFlatFront/624Wx724H-63184-Graphite-12-A4N3402GraphiteFlatFront.jpg",
      back:
        "https://cdnp.sanmar.com/medias/sys_master/images/hc2/h61/30948401479710/624Wx724H_63184_Graphite-13-A4N3402GraphiteFlatBack/624Wx724H-63184-Graphite-13-A4N3402GraphiteFlatBack.jpg",
    },
    Silver: {
      front:
        "https://cdnp.sanmar.com/medias/sys_master/images/hee/hc3/30948402200606/624Wx724H_63184_Silver-12-A4N3402SilverFlatFront/624Wx724H-63184-Silver-12-A4N3402SilverFlatFront.jpg",
      back:
        "https://cdnp.sanmar.com/medias/sys_master/images/h9c/hc4/30948402266142/624Wx724H_63184_Silver-13-A4N3402SilverFlatBack/624Wx724H-63184-Silver-13-A4N3402SilverFlatBack.jpg",
    },
    SftyYellow: {
      front:
        "https://cdnp.sanmar.com/medias/sys_master/images/hcc/hbd/30948402069534/624Wx724H_63184_SftyYellow-12-A4N3402SftyYellowFlatFront/624Wx724H-63184-SftyYellow-12-A4N3402SftyYellowFlatFront.jpg",
      back:
        "https://cdnp.sanmar.com/medias/sys_master/images/hdd/hc0/30948402135070/624Wx724H_63184_SftyYellow-13-A4N3402SftyYellowFlatBack/624Wx724H-63184-SftyYellow-13-A4N3402SftyYellowFlatBack.jpg",
    },
  },
  // NL6010, NL3600, DT6200, etc.: add curated flat-lays here when available.
};

/**
 * Look up an override for a given style + color combination.
 * Returns null if no override exists.
 */
export function getImageOverride(
  styleNumber: string,
  catalogColor: string
): SanMarImageOverride | null {
  const styleKey = styleNumber.trim().toUpperCase();
  const colorKey = catalogColor.trim();

  const styleEntry = SANMAR_IMAGE_OVERRIDES[styleKey];
  if (!styleEntry) return null;

  if (styleEntry[colorKey]) return styleEntry[colorKey];

  const matchedKey = Object.keys(styleEntry).find(
    (k) => k.toLowerCase() === colorKey.toLowerCase()
  );
  return matchedKey ? styleEntry[matchedKey] : null;
}
