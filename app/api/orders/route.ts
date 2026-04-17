import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureAccount } from "@/lib/portal/ensureAccount";
import { createDraftOrder } from "@/lib/actions/portal";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const account = await ensureAccount(
    supabase,
    user.id,
    user.email ?? undefined
  );
  if (!account) {
    return NextResponse.json({ error: "No account" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("account_id", account.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let savedConfigId: string | null = null;
  try {
    const body = (await request.json()) as { savedConfigId?: string };
    savedConfigId = body.savedConfigId ?? null;
  } catch {
    /* empty body */
  }

  try {
    const id = await createDraftOrder(savedConfigId);
    return NextResponse.json({ id });
  } catch {
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }
}
