import { NextResponse } from "next/server";
import { teamOrderLeadApiSchema } from "@/lib/schemas/teamOrderSchema";
import type { TeamOrderLead } from "@/lib/types";
import { sendToGHL } from "@/lib/ghl";

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
    await sendToGHL(
      "team-order",
      payload as unknown as Record<string, unknown>
    );

    return NextResponse.json({
      success: true,
      message: "Team quote request received. We'll be in touch shortly.",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }
}
