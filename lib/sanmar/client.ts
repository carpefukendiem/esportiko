/**
 * SanMar product data client (SOAP + media) — **stub implementation**.
 *
 * Production will call SanMar Web Services (WSDL) and/or consume FTP deposits
 * documented in the SanMar Integration Guide. This module centralizes access
 * so pages never import transport details directly.
 *
 * Planned integration surface (examples):
 * - `getProductBulkInfo` → monthly full catalog / `getProductBulkInfo` SOAP
 * - `getProductDeltaInfo` → daily deltas for changed styles
 * - `fetchProductImages` → garment + flat + model URLs per style/color
 *
 * @see https://ws.sanmar.com — SanMarProductInfoService (when enabled)
 */

import type { SanMarSeedProduct } from "@/lib/data/sanmar-seed";
import { SANMAR_SEED_PRODUCTS } from "@/lib/data/sanmar-seed";

/**
 * Bulk catalog snapshot (monthly full rebuild).
 * TODO: Call SOAP `getProductBulkInfo` with SanMar credentials; map response rows
 * into `SanMarSeedProduct` (or a shared domain type), strip pricing fields.
 */
export async function getProductBulkInfo(): Promise<SanMarSeedProduct[]> {
  return SANMAR_SEED_PRODUCTS;
}

/**
 * Incremental catalog changes (nightly delta).
 * TODO: Call SOAP `getProductDeltaInfo` or ingest `SanMar_EPDD.csv` delta; merge
 * into cache/database and return updated subset.
 */
export async function getProductDeltaInfo(): Promise<SanMarSeedProduct[]> {
  // TODO: wire delta endpoint / FTP delta file; for now return full seed.
  return SANMAR_SEED_PRODUCTS;
}

export type SanMarProductImages = {
  style_number: string;
  main?: string;
  thumbnail?: string;
};

/**
 * Resolve hero / thumbnail imagery for a style (and optionally color).
 * TODO: Call SanMar media or derived CDN URLs from SOAP/FTP payload.
 */
export async function fetchProductImages(
  styleNumber: string
): Promise<SanMarProductImages | null> {
  // TODO: SOAP or REST image bundle per style; cache by style_number.
  const row = SANMAR_SEED_PRODUCTS.find(
    (p) => p.style_number.toUpperCase() === styleNumber.trim().toUpperCase()
  );
  if (!row) return null;
  const url = row.image_url?.trim();
  if (!url) return { style_number: row.style_number };
  return { style_number: row.style_number, main: url, thumbnail: url };
}
