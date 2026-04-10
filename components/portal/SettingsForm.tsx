"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMemo } from "react";
import { updateAccountProfile } from "@/lib/actions/portal";
import type { AccountRow } from "@/types/portal";

const baseSchema = z.object({
  team_name: z.string().min(1, "Required"),
  sport: z.string().optional(),
  contact_name: z.string().optional(),
  contact_email: z.string().email().optional().or(z.literal("")),
  contact_phone: z.string().optional(),
});

const onboardingSchema = baseSchema.extend({
  sport: z.string().min(1, "Required"),
  contact_name: z.string().min(1, "Required"),
});

type Values = z.infer<typeof baseSchema>;

export function SettingsForm({
  account,
  onboarding = false,
}: {
  account: AccountRow;
  onboarding?: boolean;
}) {
  const router = useRouter();
  const schema = onboarding ? onboardingSchema : baseSchema;

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

  const fieldOrder = useMemo(() => {
    if (onboarding) {
      return [
        "team_name",
        "contact_name",
        "sport",
        "contact_phone",
        "contact_email",
      ] as const;
    }
    return [
      "team_name",
      "sport",
      "contact_name",
      "contact_email",
      "contact_phone",
    ] as const;
  }, [onboarding]);

  const labels: Record<(typeof fieldOrder)[number], string> = {
    team_name: "Team name",
    contact_name: "Contact name",
    sport: "Sport",
    contact_phone: "Contact phone",
    contact_email: "Contact email",
  };

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
        if (onboarding) {
          router.replace("/portal/dashboard");
        } else {
          router.refresh();
        }
      })}
    >
      {fieldOrder.map((name) => (
        <div key={name}>
          <label className="mb-1 block font-sans text-sm font-medium text-white">
            {labels[name]}
          </label>
          <input
            className={inputClass}
            type={name === "contact_email" ? "email" : "text"}
            autoComplete={
              name === "contact_email"
                ? "email"
                : name === "contact_phone"
                  ? "tel"
                  : name === "contact_name"
                    ? "name"
                    : undefined
            }
            {...form.register(name)}
          />
          {form.formState.errors[name] && (
            <p className="mt-1 text-sm font-medium text-red-400">
              {form.formState.errors[name]?.message as string}
            </p>
          )}
        </div>
      ))}
      <button
        type="submit"
        className="rounded-lg bg-[#3B7BF8] px-5 py-2.5 font-sans text-sm font-semibold text-white hover:opacity-90"
      >
        {onboarding ? "Continue to dashboard" : "Save changes"}
      </button>
    </form>
  );
}
