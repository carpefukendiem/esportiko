/**
 * SanMar Web Services (SOAP) — implementation stub
 *
 * Do not call from page render. All network I/O belongs in background jobs
 * (Vercel Cron, queue worker) that write to your own datastore; pages read
 * via `lib/catalog/fetcher.ts` only.
 *
 * ---------------------------------------------------------------------------
 * ENVELOPE SHAPE (conceptual)
 * ---------------------------------------------------------------------------
 * Typical pattern: `<arg0>` carries product query parameters (category, style,
 * color, size, etc.) and `<arg1>` carries credentials object:
 *   - sanMarCustomerNumber
 *   - sanMarUserName
 *   - sanMarUserPassword
 * Exact element names follow the published WSDL for SanMarProductInfoService.
 *
 * ---------------------------------------------------------------------------
 * BULK / DELTA — FTP DEPOSIT, NOT IMMEDIATE RESPONSE
 * ---------------------------------------------------------------------------
 * Methods such as `getProductBulkInfo` and `getProductDeltaInfo` initiate
 * server-side generation of a CSV. The SOAP response often acknowledges the
 * request only; the actual file lands on SanMar FTP ~20 minutes later.
 *
 * Cron responsibilities:
 *   1. Call SOAP to request bulk or delta export.
 *   2. Poll FTP until the expected file appears (retry with backoff).
 *   3. Download, parse, transform, strip sensitive columns (see below).
 *   4. Upsert into your database keyed by merge fields from SanMar docs.
 *
 * ---------------------------------------------------------------------------
 * LIVE CATEGORY PULLS — TIMEOUTS
 * ---------------------------------------------------------------------------
 * `getProductInfoByCategory` can time out for very large categories. Plan for:
 *   - Smaller category slices, retries, and circuit breaking.
 *   - Falling back to FTP CSV workflow when live calls are not reliable.
 *
 * ---------------------------------------------------------------------------
 * CSV COLUMNS TO DROP AT INGEST (do not persist or forward to the UI)
 * ---------------------------------------------------------------------------
 * Examples often present on SanMar product files (names vary by export):
 *   - PIECE_PRICE, CASE_PRICE, PIECE_SALE_PRICE, CASE_SALE_PRICE
 *   - DOZEN_PRICE, PRICE_CODE, PRICE_TEXT
 *   - SALE_START_DATE, SALE_END_DATE
 * Your ingest pipeline should delete these keys before storage. The public
 * catalog types in `lib/catalog/types.ts` intentionally omit such fields.
 *
 * ---------------------------------------------------------------------------
 * UPSERT KEYS
 * ---------------------------------------------------------------------------
 * SanMar documentation references composite keys (e.g. inventory key + size
 * index). Use their documented merge key as your database primary/unique
 * constraint when denormalizing to `CatalogProduct` rows.
 *
 * ---------------------------------------------------------------------------
 * ENVIRONMENT
 * ---------------------------------------------------------------------------
 *   SANMAR_CUSTOMER_NUMBER
 *   SANMAR_USERNAME
 *   SANMAR_PASSWORD
 *   SANMAR_FTP_HOST
 *   SANMAR_FTP_USER
 *   SANMAR_FTP_PASS
 *   SANMAR_ENV=test|production
 *
 * ---------------------------------------------------------------------------
 * NEXT STEP FOR IMPLEMENTATION
 * ---------------------------------------------------------------------------
 * 1. Generate a typed SOAP client from the WSDL (or use hand-built fetch +
 *    XML parsing with strict schema validation).
 * 2. Implement FTP polling + idempotent file processing.
 * 3. Map rows → `CatalogProduct` without commercial fields.
 * 4. Point `fetcher.ts` at Supabase/KV queries instead of mock arrays.
 */

export type SanMarSoapStub = {
  readonly status: "not_implemented";
};

export const sanMarSoapClientStub: SanMarSoapStub = {
  status: "not_implemented",
};
