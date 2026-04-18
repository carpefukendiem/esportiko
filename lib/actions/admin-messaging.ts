"use server";

import { requireAdmin } from "@/lib/auth/admin";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

type SendArgs = {
  accountId: string;
  subject: string;
  body: string;
  orderId?: string | null;
};

/**
 * Logs an admin message and optionally sends email via Resend when
 * `RESEND_API_KEY` and `RESEND_FROM_EMAIL` are configured.
 */
export async function sendMessageToCustomer(args: SendArgs): Promise<{
  ok: true;
  emailed: boolean;
}> {
  const user = await requireAdmin();
  const admin = getSupabaseAdmin();

  const { data: account, error: accErr } = await admin
    .from("accounts")
    .select("id, contact_email, team_name")
    .eq("id", args.accountId)
    .single();

  if (accErr || !account?.contact_email) {
    throw new Error("Account or contact email not found");
  }

  const to = String(account.contact_email).trim();
  const { error: insErr } = await admin.from("admin_messages").insert({
    account_id: args.accountId,
    order_id: args.orderId ?? null,
    sender_email: user.email ?? "admin@esportiko",
    subject: args.subject.trim(),
    body: args.body.trim(),
  });

  if (insErr) {
    console.error("sendMessageToCustomer insert", insErr);
    throw new Error("Could not log message");
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  let emailed = false;

  if (apiKey && from) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: args.subject.trim(),
        text: args.body.trim(),
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      console.error("Resend error", res.status, t);
    } else {
      emailed = true;
    }
  }

  return { ok: true, emailed };
}
