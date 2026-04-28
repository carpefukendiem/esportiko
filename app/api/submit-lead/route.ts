import { NextResponse } from "next/server";
import {
  buildWebhookPayload,
  type FormType,
} from "@/lib/forms/buildWebhookPayload";

const WEBHOOKS: Record<string, string | undefined> = {
  contact: process.env.GHL_WEBHOOK_URL_CONTACT,
  "team-order": process.env.GHL_WEBHOOK_URL_TEAM_ORDER,
  "business-order": process.env.GHL_WEBHOOK_URL_BUSINESS_ORDER,
  "team-roster-details": process.env.GHL_WEBHOOK_URL_TEAM_ROSTER_DETAILS,
};

const FORM_TYPES = new Set<FormType>([
  "contact",
  "team-order",
  "business-order",
  "team-roster-details",
]);

/**
 * Single POST handler for all public marketing lead forms (`/api/submit-lead`).
 *
 * | formType (body)            | Env var                              | Previous payload        | Logging                          |
 * |----------------------------|--------------------------------------|---------------------------|----------------------------------|
 * | `contact`                  | `GHL_WEBHOOK_URL_CONTACT`            | Raw JSON body as-is     | `submit-lead: upstream` on error |
 * | `team-order`               | `GHL_WEBHOOK_URL_TEAM_ORDER`        | Raw JSON body as-is     | same                             |
 * | `business-order`           | `GHL_WEBHOOK_URL_BUSINESS_ORDER`    | Raw JSON body as-is     | same                             |
 * | `team-roster-details`      | `GHL_WEBHOOK_URL_TEAM_ROSTER_DETAILS` | Raw JSON body as-is   | same                             |
 *
 * After this change: each request is validated for `formType` + `email`, then
 * forwarded with `buildWebhookPayload()` — flattened custom fields, standard
 * contact keys (`firstName`, `lastName`, `name`, `email`, `phone`), plus
 * `formSummary` for GHL email templates. Logs full outbound payload per form.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const formTypeRaw = typeof body.formType === "string" ? body.formType : "";
  if (!FORM_TYPES.has(formTypeRaw as FormType)) {
    console.warn("submit-lead: unknown or missing formType", formTypeRaw);
    return NextResponse.json(
      {
        success: false,
        error: "Invalid form type",
      },
      { status: 400 }
    );
  }

  const formType = formTypeRaw as FormType;
  const email = body.email;
  if (typeof email !== "string" || !email.trim() || !email.includes("@")) {
    return NextResponse.json(
      { success: false, error: "Valid email is required" },
      { status: 400 }
    );
  }

  const url = WEBHOOKS[formType];

  if (!url) {
    console.error(`submit-lead: env not set for formType "${formType}"`);
    return NextResponse.json(
      {
        success: false,
        error: "Webhook not configured for this form type",
      },
      { status: 503 }
    );
  }

  const pageUrl =
    request.headers.get("referer") ?? request.headers.get("referrer") ?? "";

  const payload = buildWebhookPayload(formType, body, {
    pageUrl: pageUrl || undefined,
  });

  console.log(`[submit-lead:${formType}] payload:`, JSON.stringify(payload, null, 2));

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
