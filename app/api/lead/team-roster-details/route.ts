import { NextResponse } from "next/server";
import { teamRosterDetailsApiSchema } from "@/lib/schemas/teamRosterDetailsSchema";
import type { TeamRosterDetailsLead } from "@/lib/types";
import { sendToGHL } from "@/lib/ghl";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = teamRosterDetailsApiSchema.safeParse(body);
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

    const payload: TeamRosterDetailsLead = parsed.data;
    await sendToGHL(
      "team-roster-details",
      payload as unknown as Record<string, unknown>
    );

    return NextResponse.json({
      success: true,
      message: "Team roster details received. We'll confirm with you shortly.",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }
}
