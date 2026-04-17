import { NextResponse } from "next/server";
import { cloneOrderToDraft } from "@/lib/actions/portal";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await context.params;
    const newId = await cloneOrderToDraft(orderId);
    return NextResponse.json({ id: newId });
  } catch {
    return NextResponse.json({ error: "Could not clone order" }, { status: 500 });
  }
}
