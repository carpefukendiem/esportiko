import { NextResponse } from "next/server";
import { contactLeadApiSchema } from "@/lib/schemas/contactSchema";
import type { ContactLead } from "@/lib/types";

// TODO: GoHighLevel Integration
// 1. Create a webhook or contact form in GHL subaccount
// 2. Set GHL_WEBHOOK_URL_CONTACT in Vercel environment variables
// 3. Replace the console.log below with a fetch() POST to the GHL webhook URL
// 4. Map fields: email → email, phone → phone, message → custom field, etc.
// Docs: https://highlevel.stoplight.io/docs/integrations/

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
    console.log("[lead:contact]", JSON.stringify(payload, null, 2));

    const webhookUrl = process.env.GHL_WEBHOOK_URL_CONTACT;
    void webhookUrl;

    return NextResponse.json({
      success: true,
      message: "Contact message received.",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }
}
