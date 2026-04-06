import { NextResponse } from "next/server";
import { teamOrderLeadApiSchema } from "@/lib/schemas/teamOrderSchema";
import type { TeamOrderLead } from "@/lib/types";

// TODO: GoHighLevel Integration
// 1. Create a webhook or contact form in GHL subaccount
// 2. Set GHL_WEBHOOK_URL_TEAM_ORDER in Vercel environment variables
// 3. Replace the console.log below with a fetch() POST to the GHL webhook URL
// 4. Map fields: email → email, phone → phone, teamName → custom field, etc.
// Docs: https://highlevel.stoplight.io/docs/integrations/

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = teamOrderLeadApiSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            parsed.error.issues[0]?.message ??
            "Validation failed. Check required fields.",
        },
        { status: 400 }
      );
    }

    const payload: TeamOrderLead = parsed.data;
    console.log("[lead:team-order]", JSON.stringify(payload, null, 2));

    const webhookUrl = process.env.GHL_WEBHOOK_URL_TEAM_ORDER;
    const apiKey = process.env.GHL_API_KEY;
    void webhookUrl;
    void apiKey;

    return NextResponse.json({
      success: true,
      message: "Team order request received.",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }
}
