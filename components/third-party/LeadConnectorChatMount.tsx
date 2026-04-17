"use client";

import { useEffect } from "react";

/** From Sites → Chat Widget → Get Code. */
const WIDGET_ID = "67d459ca5f21d141b510ed11";

const MOUNT_ATTR = "data-esportiko-ghl-chat";

/**
 * Injects the LeadConnector mount + loader outside React-managed siblings so the
 * widget can reparent DOM nodes without triggering React removeChild errors.
 */
export function LeadConnectorChatMount({
  locationId,
}: {
  locationId: string;
}) {
  useEffect(() => {
    const id = locationId.trim();
    if (!id) return;

    if (document.getElementById("leadconnector-chat-loader")) {
      return;
    }

    const div = document.createElement("div");
    div.setAttribute(MOUNT_ATTR, "");
    div.setAttribute("data-chat-widget", "");
    div.setAttribute("data-widget-id", WIDGET_ID);
    div.setAttribute("data-location-id", id);
    document.body.appendChild(div);

    const script = document.createElement("script");
    script.id = "leadconnector-chat-loader";
    script.src = "https://widgets.leadconnectorhq.com/loader.js";
    script.async = true;
    script.setAttribute(
      "data-resources-url",
      "https://widgets.leadconnectorhq.com/chat-widget/loader.js"
    );
    script.setAttribute("data-widget-id", WIDGET_ID);
    script.setAttribute("data-location-id", id);
    document.body.appendChild(script);

    return () => {
      try {
        document.querySelectorAll(`[${MOUNT_ATTR}]`).forEach((el) => {
          el.remove();
        });
      } catch {
        /* GHL may have moved nodes */
      }
      try {
        document.getElementById("leadconnector-chat-loader")?.remove();
      } catch {
        /* ignore */
      }
    };
  }, [locationId]);

  return null;
}
