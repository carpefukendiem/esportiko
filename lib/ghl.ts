/**
 * GoHighLevel webhook integration.
 *
 * Set one of the following env vars in Vercel (or .env.local):
 *   GHL_WEBHOOK_URL_TEAM_ORDER
 *   GHL_WEBHOOK_URL_BUSINESS_ORDER
 *   GHL_WEBHOOK_URL_CONTACT
 *   GHL_WEBHOOK_URL_TEAM_ROSTER_DETAILS (final jersey names/numbers after quote)
 *
 * Each should be an "Inbound Webhook" URL from a GHL Workflow. We POST the
 * parsed lead payload as JSON — map fields inside the GHL workflow trigger.
 *
 * We never throw on failure — the user-facing API still returns success so a
 * transient GHL outage doesn't block the customer. We log the error for
 * observability and you can add Sentry/Logtail later.
 */

type LeadKind =
  | "team-order"
  | "business-order"
  | "contact"
  | "team-roster-details";

const ENV_KEYS: Record<LeadKind, string> = {
  "team-order": "GHL_WEBHOOK_URL_TEAM_ORDER",
  "business-order": "GHL_WEBHOOK_URL_BUSINESS_ORDER",
  contact: "GHL_WEBHOOK_URL_CONTACT",
  "team-roster-details": "GHL_WEBHOOK_URL_TEAM_ROSTER_DETAILS",
};

export async function sendToGHL(
  kind: LeadKind,
  payload: Record<string, unknown>
): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const url = process.env[ENV_KEYS[kind]];
  if (!url) {
    // No webhook configured yet — not an error, just a local/dev run.
    console.log(`[ghl:${kind}] (no webhook configured)`, payload);
    return { ok: true, skipped: true };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "esportiko.com",
        kind,
        submittedAt: new Date().toISOString(),
        ...payload,
      }),
      // Don't hang the API route forever on GHL latency
      signal: AbortSignal.timeout(8_000),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[ghl:${kind}] webhook ${res.status}`, text);
      return { ok: false, error: `ghl ${res.status}` };
    }

    return { ok: true };
  } catch (err) {
    console.error(`[ghl:${kind}] fetch failed`, err);
    return { ok: false, error: String(err) };
  }
}
