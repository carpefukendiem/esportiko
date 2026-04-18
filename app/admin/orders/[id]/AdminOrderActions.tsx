"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { OrderStatus } from "@/types/portal";
import {
  adminSaveOrderNotes,
  adminUpdateOrderStatus,
} from "@/lib/actions/admin-orders";
import { sendMessageToCustomer } from "@/lib/actions/admin-messaging";

const STATUSES: OrderStatus[] = [
  "draft",
  "submitted",
  "in_review",
  "in_production",
  "complete",
  "cancelled",
];

export function AdminOrderActions(props: {
  orderId: string;
  accountId: string;
  initialStatus: OrderStatus;
  initialAdminNotes: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(props.initialStatus);
  const [notes, setNotes] = useState(props.initialAdminNotes);
  const [subject, setSubject] = useState("Update on your Esportiko order");
  const [body, setBody] = useState("");
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="space-y-6 rounded-xl border border-[#1C2333] bg-[#0F1521] p-6">
      <h2 className="font-sans text-lg font-semibold text-white">Admin actions</h2>

      <label className="block font-sans text-sm font-medium text-[#8A94A6]">
        Change status
        <select
          className="mt-1 w-full max-w-md rounded-lg border border-[#2A3347] bg-[#0A0F1A] px-3 py-2 text-white"
          value={status}
          disabled={pending}
          onChange={(e) => {
            const next = e.target.value as OrderStatus;
            setStatus(next);
            start(async () => {
              setMsg(null);
              await adminUpdateOrderStatus(props.orderId, next);
              setMsg("Status updated.");
              router.refresh();
            });
          }}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </label>

      <div>
        <label className="block font-sans text-sm font-medium text-[#8A94A6]">
          Internal admin notes
        </label>
        <textarea
          className="mt-1 min-h-[100px] w-full rounded-lg border border-[#2A3347] bg-[#0A0F1A] px-3 py-2 text-sm text-white"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              setMsg(null);
              await adminSaveOrderNotes(props.orderId, notes);
              setMsg("Notes saved.");
              router.refresh();
            })
          }
          className="mt-2 rounded-lg bg-[#3B7BF8] px-4 py-2 font-sans text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          Save notes
        </button>
      </div>

      <div className="border-t border-[#1C2333] pt-6">
        <h3 className="font-sans text-sm font-semibold text-white">Email customer</h3>
        <p className="mt-1 text-xs text-[#8A94A6]">
          Sends via Resend when <code className="text-white">RESEND_API_KEY</code> and{" "}
          <code className="text-white">RESEND_FROM_EMAIL</code> are set; otherwise the message is
          only logged in <code className="text-white">admin_messages</code>.
        </p>
        <input
          className="mt-3 w-full rounded-lg border border-[#2A3347] bg-[#0A0F1A] px-3 py-2 text-sm text-white"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <textarea
          className="mt-2 min-h-[120px] w-full rounded-lg border border-[#2A3347] bg-[#0A0F1A] px-3 py-2 text-sm text-white"
          placeholder="Message body…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button
          type="button"
          disabled={pending || !body.trim()}
          onClick={() =>
            start(async () => {
              setMsg(null);
              const res = await sendMessageToCustomer({
                accountId: props.accountId,
                orderId: props.orderId,
                subject,
                body,
              });
              setMsg(res.emailed ? "Email sent and logged." : "Message logged (email not sent — configure Resend).");
              setBody("");
              router.refresh();
            })
          }
          className="mt-2 rounded-lg border border-[#2A3347] px-4 py-2 font-sans text-sm font-semibold text-white hover:bg-[#1C2333] disabled:opacity-50"
        >
          Send update to customer
        </button>
      </div>

      {msg ? <p className="text-sm text-emerald-300">{msg}</p> : null}
    </div>
  );
}
