/**
 * Catalog data fetcher — abstraction seam
 *
 * CURRENT: returns mock rows from `lib/catalog/data.ts` shaped for the UI.
 *
 * FUTURE (when SanMar SOAP API access is approved):
 *
 * Architecture:
 *   SanMar SOAP API / FTP
 *     ↓ scheduled Vercel Cron (daily delta, monthly full rebuild)
 *   Parse CSV/XML, strip commercial columns at ingest
 *     ↓
 *   Upsert to database (Supabase or Vercel KV) keyed on unique_key
 *     ↓
 *   These fetcher functions query YOUR database — not the SOAP API directly
 *
 * Never call the SanMar SOAP API during page render.
 *
 * SanMar API reference:
 *   WSDL: https://ws.sanmar.com:8080/SanMarWebService/SanMarProductInfoServicePort?wsdl
 *   Auth: sanMarCustomerNumber + sanMarUserName + sanMarUserPassword in <arg1>
 *   Key methods: getProductBulkInfo (monthly FTP CSV), getProductDeltaInfo
 *     (daily FTP CSV), getProductInfoByCategory, getProductInfoByStyleColorSize
 *   Env vars needed: SANMAR_CUSTOMER_NUMBER, SANMAR_USERNAME, SANMAR_PASSWORD,
 *     SANMAR_FTP_HOST, SANMAR_FTP_USER, SANMAR_FTP_PASS, SANMAR_ENV=test|production
 *
 * Pages import ONLY from this file. Never import from data.ts in page components.
 */

import { DISPLAY_CATEGORIES } from "@/lib/catalog/categories";
import {
  MOCK_CATALOG_PRODUCTS,
  MOCK_STYLE_NUMBERS_BY_DISPLAY_SLUG,
} from "@/lib/catalog/data";
import type { CatalogProduct, DisplayCategory } from "@/lib/catalog/types";

function stripDiscontinued(products: CatalogProduct[]): CatalogProduct[] {
  return products.filter((p) => p.status !== "Discontinued");
}

export async function getDisplayCategories(): Promise<DisplayCategory[]> {
  return DISPLAY_CATEGORIES;
}

export async function getDisplayCategoryBySlug(
  slug: string
): Promise<DisplayCategory | null> {
  return DISPLAY_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export async function getProductsByDisplayCategory(
  slug: string
): Promise<CatalogProduct[]> {
  const styleOrder = MOCK_STYLE_NUMBERS_BY_DISPLAY_SLUG[slug];
  if (!styleOrder?.length) {
    return [];
  }
  const pool = stripDiscontinued(MOCK_CATALOG_PRODUCTS);
  const byStyle = new Map(
    pool.map((p) => [p.styleNumber.toUpperCase(), p] as const)
  );
  return styleOrder
    .map((s) => byStyle.get(s.toUpperCase()))
    .filter((p): p is CatalogProduct => Boolean(p));
}

export async function getProductByStyle(
  styleNumber: string
): Promise<CatalogProduct | null> {
  const key = styleNumber.trim().toUpperCase();
  const found = MOCK_CATALOG_PRODUCTS.find(
    (p) => p.styleNumber.toUpperCase() === key
  );
  if (!found || found.status === "Discontinued") {
    return null;
  }
  return found;
}

export async function getRelatedProducts(
  slug: string,
  excludeStyleNumber: string
): Promise<CatalogProduct[]> {
  const all = await getProductsByDisplayCategory(slug);
  const ex = excludeStyleNumber.trim().toUpperCase();
  return all.filter((p) => p.styleNumber.toUpperCase() !== ex).slice(0, 4);
}

/** Resolves a style for a category URL segment, or null if not in that bucket. */
export async function getProductInDisplayCategory(
  categorySlug: string,
  styleNumber: string
): Promise<CatalogProduct | null> {
  const product = await getProductByStyle(styleNumber);
  if (!product) {
    return null;
  }
  const inCategory = await getProductsByDisplayCategory(categorySlug);
  const match = inCategory.some(
    (p) =>
      p.styleNumber.toUpperCase() === product.styleNumber.toUpperCase()
  );
  return match ? product : null;
}
