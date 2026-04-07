import { NextResponse } from "next/server";
import { contactLeadApiSchema } from "@/lib/schemas/contactSchema";
import type { ContactLead } from "@/lib/types";
import { sendToGHL } from "@/lib/ghl";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = contactLeadApiSchema.safeParse(body);
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

    const payload: ContactLead = parsed.data;
    await sendToGHL("contact", payload as unknown as Record<string, unknown>);

    return NextResponse.json({
      success: true,
      message: "Contact message received. We'll reply soon.",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }
}
