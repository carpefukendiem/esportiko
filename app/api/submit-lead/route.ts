import { NextResponse } from "next/server";

const WEBHOOKS: Record<string, string | undefined> = {
  contact: process.env.GHL_WEBHOOK_URL_CONTACT,
  "team-order": process.env.GHL_WEBHOOK_URL_TEAM_ORDER,
  "business-order": process.env.GHL_WEBHOOK_URL_BUSINESS_ORDER,
  "team-roster-details": process.env.GHL_WEBHOOK_URL_TEAM_ROSTER_DETAILS,
};

/**
 * Public marketing forms POST here. Maps `formType` to the matching GHL webhook env var.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const formType = typeof body.formType === "string" ? body.formType : "";
  const url = WEBHOOKS[formType];

  if (!url) {
    console.warn("submit-lead: no webhook for formType", formType);
    return NextResponse.json(
      {
        success: false,
        error: "Webhook not configured for this form type",
      },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("submit-lead: upstream", res.status, text);
      return NextResponse.json(
        { success: false, error: "Upstream error" },
        { status: 502 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("submit-lead", e);
    return NextResponse.json(
      { success: false, error: "Request failed" },
      { status: 502 }
    );
  }
}
