import Script from "next/script";

/** From Sites → Chat Widget → Get Code. */
const WIDGET_ID = "67d459ca5f21d141b510ed11";

/**
 * LeadConnector / HighLevel web chat.
 *
 * The official loader (`loader.js`) validates **location-id**; without it you get
 * "Error: location-id is missing" in the console and no bubble. Set `GHL_LOCATION_ID` in
 * `.env.local` / Vercel (same value as your sub-account / webhooks).
 *
 * GHL’s GTM-style embed uses a mount `div` plus the script with matching ids; `next/script`
 * with `afterInteractive` runs on the client after the mount exists (reliable in App Router).
 */
export function LeadConnectorChatEmbed() {
  const locationId =
    process.env.GHL_LOCATION_ID ?? process.env.NEXT_PUBLIC_GHL_LOCATION_ID;

  if (!locationId?.trim()) {
    return null;
  }

  return (
    <>
      <div
        data-chat-widget
        data-widget-id={WIDGET_ID}
        data-location-id={locationId}
      />
      <Script
        id="leadconnector-chat-loader"
        strategy="afterInteractive"
        src="https://widgets.leadconnectorhq.com/loader.js"
        data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
        data-widget-id={WIDGET_ID}
        data-location-id={locationId}
      />
    </>
  );
}
