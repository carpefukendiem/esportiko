import { NextResponse } from "next/server";
import { cloneOrderToDraft } from "@/lib/actions/portal";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = await cloneOrderToDraft(params.id);
    return NextResponse.json({ id });
  } catch {
    return NextResponse.json({ error: "Could not clone order" }, { status: 500 });
  }
}
