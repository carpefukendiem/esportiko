/**
 * Brands SanMar prohibits on Amazon, eBay, Etsy, Craigslist, or
 * "any other third party or direct to consumer websites"
 * (FTP Integration Guide v23.4, Brand Restrictions section).
 *
 * Esportiko is a B2B custom-apparel decorator, not a reseller — but confirm
 * in writing with sanmarintegrations@sanmar.com before adding these brands
 * to CURATED_STYLES_BY_CATEGORY. If in doubt, omit.
 */
export const RESTRICTED_BRANDS: ReadonlySet<string> = new Set([
  "Brooks Brothers",
  "Carhartt",
  "Cotopaxi",
  "Eddie Bauer",
  "New Era",
  "Nike",
  "OGIO",
  "Outdoor Research",
  "Stanley/Stella",
  "tentree",
  "The North Face",
  "Tommy Bahama",
  "Travis Mathew",
]);
