import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { processQuoteWebhook } from "@/lib/actions/quote-webhook";

const SECRET_HEADER = "x-ghl-webhook-secret";

function unauthorized() {
  return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
}

export async function POST(request: Request) {
  const expected = process.env.GHL_WEBHOOK_SECRET;
  if (!expected) {
    console.error("GHL_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { success: false, error: "Server misconfiguration" },
      { status: 500 }
    );
  }

  const provided = request.headers.get(SECRET_HEADER);
  if (!provided || provided !== expected) {
    return unauthorized();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const result = await processQuoteWebhook(body);
    return NextResponse.json({
      success: true,
      user_id: result.user_id,
      account_id: result.account_id,
      order_id: result.order_id,
    });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid payload", details: e.flatten() },
        { status: 400 }
      );
    }
    const message = e instanceof Error ? e.message : String(e);
    console.error("ghl-quote webhook", e);
    return NextResponse.json(
      { success: false, error: "Internal error", details: message },
      { status: 500 }
    );
  }
}
