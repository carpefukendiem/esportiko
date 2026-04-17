import { LeadConnectorChatMount } from "@/components/third-party/LeadConnectorChatMount";

/**
 * LeadConnector / HighLevel web chat.
 *
 * Set `GHL_LOCATION_ID` or `NEXT_PUBLIC_GHL_LOCATION_ID` in `.env.local` / Vercel.
 * The client mount injects the widget imperatively so third-party DOM changes do not
 * fight React reconciliation (avoids removeChild crashes on navigation / hydration).
 */
export function LeadConnectorChatEmbed() {
  const locationId =
    process.env.GHL_LOCATION_ID ?? process.env.NEXT_PUBLIC_GHL_LOCATION_ID;

  if (!locationId?.trim()) {
    return null;
  }

  return <LeadConnectorChatMount locationId={locationId.trim()} />;
}
