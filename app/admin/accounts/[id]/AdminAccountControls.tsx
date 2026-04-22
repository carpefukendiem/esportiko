"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { adminSetAccountVip } from "@/lib/actions/admin-accounts";
import { sendMessageToCustomer } from "@/lib/actions/admin-messaging";

export function AdminAccountControls(props: {
  accountId: string;
  initialVip: boolean;
  dashboardUrl: string | null;
}) {
  const router = useRouter();
  const [vip, setVip] = useState(props.initialVip);
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("Message from Esportiko");
  const [body, setBody] = useState("");
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap gap-3">
      <label className="flex items-center gap-2 rounded-lg border border-[#1C2333] bg-[#0F1521] px-4 py-2 font-sans text-sm text-white">
        <input
          type="checkbox"
          checked={vip}
          disabled={pending}
          onChange={(e) => {
            const next = e.target.checked;
            setVip(next);
            start(async () => {
              await adminSetAccountVip(props.accountId, next);
              router.refresh();
            });
          }}
        />
        VIP account
      </label>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button
            type="button"
            className="rounded-lg bg-[#3B7BF8] px-4 py-2 font-sans text-sm font-semibold text-white hover:opacity-90"
          >
            Send message to customer
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(100vw-2rem,520px)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[#2A3347] bg-[#0F1521] p-6 shadow-xl">
            <Dialog.Title className="font-sans text-lg font-semibold text-white">
              Email customer
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-[#8A94A6]">
              Logs to admin_messages. Sends via Resend when configured.
            </Dialog.Description>
            <input
              className="mt-4 w-full rounded-lg border border-[#2A3347] bg-[#0A0F1A] px-3 py-2 text-sm text-white"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <textarea
              className="mt-2 min-h-[140px] w-full rounded-lg border border-[#2A3347] bg-[#0A0F1A] px-3 py-2 text-sm text-white"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="rounded-lg border border-[#2A3347] px-4 py-2 text-sm text-[#8A94A6] hover:bg-[#1C2333]"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="button"
                disabled={pending || !body.trim()}
                onClick={() =>
                  start(async () => {
                    setMsg(null);
                    const res = await sendMessageToCustomer({
                      accountId: props.accountId,
                      subject,
                      body,
                    });
                    setMsg(
                      res.emailed
                        ? "Email sent and logged."
                        : res.emailDetail
                          ? `Message logged. Email not sent: ${res.emailDetail}`
                          : "Message logged (email not sent)."
                    );
                    setBody("");
                    setOpen(false);
                    router.refresh();
                  })
                }
                className="rounded-lg bg-[#3B7BF8] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                Send
              </button>
            </div>
            {msg ? <p className="mt-2 text-sm text-emerald-300">{msg}</p> : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {props.dashboardUrl ? (
        <a
          href={props.dashboardUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-[#2A3347] px-4 py-2 font-sans text-sm font-semibold text-[#8A94A6] hover:bg-[#1C2333] hover:text-white"
        >
          View in Supabase
        </a>
      ) : null}
    </div>
  );
}
