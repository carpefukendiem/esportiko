import { NextResponse } from "next/server";
import {
  type SubmitLeadFormType,
  submitLeadRequestSchema,
} from "@/lib/schemas/submitLeadSchema";

const WEBHOOK_ENV_KEYS: Record<SubmitLeadFormType, string> = {
  "team-order": "GHL_WEBHOOK_URL_TEAM_ORDER",
  "business-order": "GHL_WEBHOOK_URL_BUSINESS_ORDER",
  contact: "GHL_WEBHOOK_URL_CONTACT",
  "team-roster": "GHL_WEBHOOK_URL_TEAM_ROSTER_DETAILS",
};

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = submitLeadRequestSchema.safeParse(body);
    if (!parsed.success) {
      const msg =
        parsed.error.issues[0]?.message ??
        "Validation failed. Check required fields.";
      return NextResponse.json({ success: false, error: msg }, { status: 400 });
    }

    const payload = parsed.data as Record<string, unknown>;
    const formType = payload.formType as SubmitLeadFormType;
    const envKey = WEBHOOK_ENV_KEYS[formType];
    const url = process.env[envKey];

    if (!url) {
      console.log(`[submit-lead:${formType}] (no webhook configured)`, payload);
      return NextResponse.json({ success: true });
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "esportiko.com",
          kind: formType,
          submittedAt: new Date().toISOString(),
          ...payload,
        }),
        signal: AbortSignal.timeout(8_000),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error(`[submit-lead:${formType}] webhook ${res.status}`, text);
        return NextResponse.json(
          {
            success: false,
            error:
              "We could not complete your request. Please try again or call us.",
          },
          { status: 502 }
        );
      }
    } catch (err) {
      console.error(`[submit-lead:${formType}] fetch failed`, err);
      return NextResponse.json(
        {
          success: false,
          error:
            "We could not complete your request. Please try again or call us.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }
}
