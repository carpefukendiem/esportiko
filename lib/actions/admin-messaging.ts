"use server";

import { headers } from "next/headers";
import { loadResendEnv, postResendEmail } from "@/lib/email/resend-config";
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
 * `RESEND_API_KEY` and `RESEND_FROM_EMAIL` (or `RESEND_FROM`) are configured.
 */
export async function sendMessageToCustomer(args: SendArgs): Promise<{
  ok: true;
  emailed: boolean;
  emailDetail?: string;
}> {
  void headers().get("host");
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

  const cfg = loadResendEnv();
  let emailed = false;
  let emailDetail: string | undefined;

  if (!cfg.ok) {
    emailDetail = cfg.reason;
  } else {
    const sent = await postResendEmail({
      apiKey: cfg.apiKey,
      from: cfg.from,
      to,
      subject: args.subject.trim(),
      text: args.body.trim(),
    });
    if (!sent.ok) {
      emailDetail = sent.message;
    } else {
      emailed = true;
    }
  }

  return { ok: true, emailed, emailDetail };
}
