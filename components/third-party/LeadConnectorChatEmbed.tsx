import { LeadConnectorChatMount } from "@/components/third-party/LeadConnectorChatMount";

/**
 * LeadConnector / HighLevel web chat.
 *
 * Set `GHL_LOCATION_ID` or `NEXT_PUBLIC_GHL_LOCATION_ID` in `.env.local` / Vercel.
 * The client mount injects the widget imperatively so third-party DOM changes do not
 * fight React reconciliation (avoids removeChild crashes on navigation / hydration).
 *
 * **Iframe / embed preflight (e.g. full GHL app on another domain):** before embedding
 * any third-party URL in an `<iframe>`, check the target’s response headers in DevTools:
 * `X-Frame-Options: DENY | SAMEORIGIN` or `Content-Security-Policy: frame-ancestors 'self'`
 * means the embed will be blocked from `esportiko.vercel.app` unless GHL allowlists your
 * origin. This project uses the official widget loader (`widgets.leadconnectorhq.com`), not
 * an iframe of the full GHL web app — if you add an iframe later, run that header check first
 * and default to “open in new tab” when headers disallow embedding.
 */
export function LeadConnectorChatEmbed() {
  const locationId =
    process.env.GHL_LOCATION_ID ?? process.env.NEXT_PUBLIC_GHL_LOCATION_ID;

  if (!locationId?.trim()) {
    return null;
  }

  return <LeadConnectorChatMount locationId={locationId.trim()} />;
}
