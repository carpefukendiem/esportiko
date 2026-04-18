import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { processQuoteWebhook } from "@/lib/actions/quote-webhook";

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
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
    console.error("ghl-quote test", e);
    return NextResponse.json(
      { success: false, error: "Internal error", details: message },
      { status: 500 }
    );
  }
}
