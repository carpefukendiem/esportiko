"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateAccountProfile } from "@/lib/actions/portal";
import type { AccountRow } from "@/types/portal";

const schema = z.object({
  team_name: z.string().min(1, "Required"),
  sport: z.string().optional(),
  contact_name: z.string().optional(),
  contact_email: z.string().email().optional().or(z.literal("")),
  contact_phone: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export function SettingsForm({
  account,
  onboarding: _onboarding,
}: {
  account: AccountRow;
  onboarding?: boolean;
}) {
  void _onboarding;
  const router = useRouter();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      team_name: account.team_name,
      sport: account.sport ?? "",
      contact_name: account.contact_name ?? "",
      contact_email: account.contact_email ?? "",
      contact_phone: account.contact_phone ?? "",
    },
  });

  const inputClass =
    "w-full rounded-lg border border-[#2A3347] bg-[#1C2333] px-3 py-2.5 font-sans text-sm font-medium text-white placeholder:text-[#8A94A6] focus:border-[#3B7BF8] focus:outline-none focus:ring-1 focus:ring-[#3B7BF8]";

  return (
    <form
      className="space-y-4 rounded-xl border border-[#2A3347] bg-[#1C2333] p-6"
      onSubmit={form.handleSubmit(async (data) => {
        await updateAccountProfile({
          team_name: data.team_name,
          sport: data.sport || null,
          contact_name: data.contact_name || null,
          contact_email: data.contact_email || null,
          contact_phone: data.contact_phone || null,
        });
        router.refresh();
      })}
    >
      <div>
        <label className="mb-1 block font-sans text-sm font-medium text-white">
          Team name
        </label>
        <input className={inputClass} {...form.register("team_name")} />
        {form.formState.errors.team_name && (
          <p className="mt-1 text-sm font-medium text-red-400">
            {form.formState.errors.team_name.message}
          </p>
        )}
      </div>
      <div>
        <label className="mb-1 block font-sans text-sm font-medium text-white">
          Sport
        </label>
        <input className={inputClass} {...form.register("sport")} />
      </div>
      <div>
        <label className="mb-1 block font-sans text-sm font-medium text-white">
          Contact name
        </label>
        <input className={inputClass} {...form.register("contact_name")} />
      </div>
      <div>
        <label className="mb-1 block font-sans text-sm font-medium text-white">
          Contact email
        </label>
        <input className={inputClass} type="email" {...form.register("contact_email")} />
        {form.formState.errors.contact_email && (
          <p className="mt-1 text-sm font-medium text-red-400">
            {form.formState.errors.contact_email.message}
          </p>
        )}
      </div>
      <div>
        <label className="mb-1 block font-sans text-sm font-medium text-white">
          Contact phone
        </label>
        <input className={inputClass} {...form.register("contact_phone")} />
      </div>
      <button
        type="submit"
        className="rounded-lg bg-[#3B7BF8] px-5 py-2.5 font-sans text-sm font-semibold text-white hover:opacity-90"
      >
        Save changes
      </button>
    </form>
  );
}
