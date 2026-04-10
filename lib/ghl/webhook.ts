import type { AccountRow, OrderRow } from "@/types/portal";

type GhlOrderPayload = {
  team_name: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  garment_type: string | null;
  decoration_method: string | null;
  quantity: number | null;
  deadline: string | null;
  notes: string | null;
  artwork_url: string | null;
  order_id: string;
  portal_link: string;
  season: string | null;
  status: string;
};

/**
 * POSTs portal order summary to GoHighLevel (or any) webhook.
 */
export async function sendOrderToGHL(
  order: OrderRow,
  account: AccountRow
): Promise<boolean> {
  const url = process.env.GHL_WEBHOOK_URL;
  if (!url) {
    console.warn("sendOrderToGHL: GHL_WEBHOOK_URL is not set");
    return false;
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";
  const portal_link = site
    ? `${site}/portal/orders/${order.id}`
    : `/portal/orders/${order.id}`;

  const payload: GhlOrderPayload = {
    team_name: account.team_name,
    contact_name: account.contact_name,
    contact_email: account.contact_email,
    contact_phone: account.contact_phone,
    garment_type: order.garment_type,
    decoration_method: order.decoration_method,
    quantity: order.quantity,
    deadline: order.deadline,
    notes: order.notes,
    artwork_url: order.artwork_url,
    order_id: order.id,
    portal_link,
    season: order.season,
    status: order.status,
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error("sendOrderToGHL: HTTP", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("sendOrderToGHL: fetch failed", e);
    return false;
  }
}
