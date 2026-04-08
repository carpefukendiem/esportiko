"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useForm, useFieldArray, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, UserCircle2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TextField } from "@/components/forms/fields/TextField";
import { EmailField } from "@/components/forms/fields/EmailField";
import { PhoneField } from "@/components/forms/fields/PhoneField";
import { TextareaField } from "@/components/forms/fields/TextareaField";
import { FormSuccess } from "@/components/forms/FormSuccess";
import {
  teamRosterDetailsFormSchema,
  type TeamRosterDetailsFormValues,
} from "@/lib/schemas/teamRosterDetailsSchema";
import { captureLeadMeta } from "@/lib/utils/leadMeta";
import type { TeamRosterDetailsLead } from "@/lib/types";

function newRow(): TeamRosterDetailsFormValues["roster"][number] {
  return {
    id: crypto.randomUUID(),
    number: "",
    lastName: "",
    size: "",
    quantity: 1,
  };
}

export function TeamRosterDetailsForm() {
  const pathname = usePathname();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const form = useForm<TeamRosterDetailsFormValues>({
    resolver: zodResolver(
      teamRosterDetailsFormSchema
    ) as Resolver<TeamRosterDetailsFormValues>,
    defaultValues: {
      contactName: "",
      email: "",
      phone: "",
      teamName: "",
      quoteReference: "",
      roleOrTitle: "",
      additionalNotes: "",
      roster: [newRow()],
    },
    mode: "onTouched",
  });

  const { control, register, handleSubmit, formState } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "roster",
  });
  const { errors } = formState;

  const onSubmit = async (values: TeamRosterDetailsFormValues) => {
    setSubmitError(null);
    setSending(true);
    const meta = captureLeadMeta(pathname, "team-roster-details");

    const payload: TeamRosterDetailsLead = {
      ...meta,
      formType: "team-roster-details",
      contactName: values.contactName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      teamName: values.teamName.trim(),
      quoteReference: values.quoteReference?.trim() || undefined,
      roleOrTitle: values.roleOrTitle?.trim() || undefined,
      additionalNotes: values.additionalNotes?.trim() || undefined,
      roster: values.roster.map((r) => ({
        id: r.id,
        number: r.number.trim(),
        lastName: r.lastName.trim(),
        size: r.size.trim(),
        quantity: r.quantity,
      })),
    };

    try {
      const res = await fetch("/api/lead/team-roster-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setSubmitError(
          data.error ??
            "Something went wrong. Please try again or email us directly."
        );
        setSending(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError(
        "Something went wrong. Please try again or email us directly."
      );
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <FormSuccess
        title="Roster details received."
        body="We have your jersey numbers, names, sizes, and quantities. Our team will match this to your approved quote and follow up if anything needs clarification."
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-10"
      noValidate
    >
      {submitError ? (
        <p className="rounded-lg border border-error/50 bg-error/10 px-4 py-3 text-body-sm text-error">
          {submitError}
        </p>
      ) : null}

      <section className="rounded-2xl border border-slate bg-navy-mid/90 p-6 md:p-8">
        <div className="mb-6 flex items-start gap-3">
          <UserCircle2
            className="mt-0.5 h-8 w-8 shrink-0 text-blue-accent"
            aria-hidden
          />
          <div>
            <h2 className="font-display text-xl font-semibold text-white md:text-2xl">
              Your contact details
            </h2>
            <p className="mt-1 text-body-sm text-gray-soft">
              Who we should reach if we have questions about this roster.
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <TextField
            control={control}
            name="contactName"
            label="Full name"
            placeholder="Jordan Smith"
          />
          <TextField
            control={control}
            name="roleOrTitle"
            label="Role (optional)"
            placeholder="Coach, club admin, team parent…"
          />
          <EmailField control={control} name="email" label="Email" />
          <PhoneField control={control} name="phone" label="Phone" />
          <div className="md:col-span-2">
            <TextField
              control={control}
              name="teamName"
              label="Team / school / organization name"
              placeholder="e.g. Dos Pueblos JV Baseball"
            />
          </div>
          <div className="md:col-span-2">
            <TextField
              control={control}
              name="quoteReference"
              label="Quote or order reference (optional)"
              placeholder="Invoice #, email subject, or “March 2026 reorder”"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate bg-navy-mid/90 p-6 md:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <Users
              className="mt-0.5 h-8 w-8 shrink-0 text-blue-accent"
              aria-hidden
            />
            <div>
              <h2 className="font-display text-xl font-semibold text-white md:text-2xl">
                Jersey &amp; garment line-up
              </h2>
              <p className="mt-1 max-w-2xl text-body-sm text-gray-soft">
                One row per player (or per size if you bundle the same name on
                multiple pieces). Use the <strong className="text-off-white">last name</strong>{" "}
                that should appear on the jersey. Add a row for each number/size/qty
                combination you need.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="shrink-0 self-start"
            onClick={() => append(newRow())}
          >
            <Plus className="mr-2 h-4 w-4" aria-hidden />
            Add row
          </Button>
        </div>

        {errors.roster && typeof errors.roster.message === "string" ? (
          <p className="mb-4 text-body-sm text-error" role="alert">
            {errors.roster.message}
          </p>
        ) : null}

        <div className="hidden rounded-lg border border-slate/60 bg-navy-light/30 px-3 py-2 md:grid md:grid-cols-12 md:gap-3 md:text-label md:font-semibold md:uppercase md:tracking-wider text-gray-soft">
          <span className="col-span-2">#</span>
          <span className="col-span-3">Last name</span>
          <span className="col-span-2">Size</span>
          <span className="col-span-2">Qty</span>
          <span className="col-span-2 sr-only">Remove</span>
        </div>

        <AnimatePresence initial={false}>
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-3 rounded-xl border border-slate bg-navy-light/40 p-4 md:border-0 md:bg-transparent md:p-0"
            >
              <div className="mb-2 flex items-center justify-between md:hidden">
                <span className="font-sans text-label font-medium uppercase tracking-wider text-gray-soft">
                  Row {index + 1}
                </span>
                {fields.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-error hover:text-error"
                    aria-label={`Remove row ${index + 1}`}
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                ) : null}
              </div>

              <div className="hidden md:grid md:grid-cols-12 md:items-end md:gap-3">
                <div className="col-span-2">
                  <Label htmlFor={`num-${index}`} className="sr-only md:not-sr-only">
                    Jersey #
                  </Label>
                  <Input
                    id={`num-${index}`}
                    className="mt-1"
                    placeholder="12"
                    {...register(`roster.${index}.number` as const)}
                    error={!!errors.roster?.[index]?.number}
                  />
                  {errors.roster?.[index]?.number ? (
                    <p className="mt-1 text-body-sm text-error">
                      {errors.roster[index]?.number?.message as string}
                    </p>
                  ) : null}
                </div>
                <div className="col-span-3">
                  <Label htmlFor={`ln-${index}`} className="sr-only md:not-sr-only">
                    Last name
                  </Label>
                  <Input
                    id={`ln-${index}`}
                    className="mt-1"
                    placeholder="Rivera"
                    {...register(`roster.${index}.lastName` as const)}
                    error={!!errors.roster?.[index]?.lastName}
                  />
                  {errors.roster?.[index]?.lastName ? (
                    <p className="mt-1 text-body-sm text-error">
                      {errors.roster[index]?.lastName?.message as string}
                    </p>
                  ) : null}
                </div>
                <div className="col-span-2">
                  <Label htmlFor={`sz-${index}`} className="sr-only md:not-sr-only">
                    Size
                  </Label>
                  <Input
                    id={`sz-${index}`}
                    className="mt-1"
                    placeholder="Adult M"
                    {...register(`roster.${index}.size` as const)}
                    error={!!errors.roster?.[index]?.size}
                  />
                  {errors.roster?.[index]?.size ? (
                    <p className="mt-1 text-body-sm text-error">
                      {errors.roster[index]?.size?.message as string}
                    </p>
                  ) : null}
                </div>
                <div className="col-span-2">
                  <Label htmlFor={`qty-${index}`} className="sr-only md:not-sr-only">
                    Qty
                  </Label>
                  <Input
                    id={`qty-${index}`}
                    type="number"
                    min={1}
                    className="mt-1"
                    {...register(`roster.${index}.quantity` as const, {
                      valueAsNumber: true,
                    })}
                    error={!!errors.roster?.[index]?.quantity}
                  />
                  {errors.roster?.[index]?.quantity ? (
                    <p className="mt-1 text-body-sm text-error">
                      {errors.roster[index]?.quantity?.message as string}
                    </p>
                  ) : null}
                </div>
                <div className="col-span-3 flex justify-end pb-1">
                  {fields.length > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-error hover:text-error"
                      aria-label={`Remove row ${index + 1}`}
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  ) : null}
                </div>
              </div>

              <div className="space-y-3 md:hidden">
                <div>
                  <Label htmlFor={`m-num-${index}`}>Jersey #</Label>
                  <Input
                    id={`m-num-${index}`}
                    className="mt-1"
                    {...register(`roster.${index}.number` as const)}
                    error={!!errors.roster?.[index]?.number}
                  />
                </div>
                <div>
                  <Label htmlFor={`m-ln-${index}`}>Last name on jersey</Label>
                  <Input
                    id={`m-ln-${index}`}
                    className="mt-1"
                    {...register(`roster.${index}.lastName` as const)}
                    error={!!errors.roster?.[index]?.lastName}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`m-sz-${index}`}>Size</Label>
                    <Input
                      id={`m-sz-${index}`}
                      className="mt-1"
                      {...register(`roster.${index}.size` as const)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`m-qty-${index}`}>Qty</Label>
                    <Input
                      id={`m-qty-${index}`}
                      type="number"
                      min={1}
                      className="mt-1"
                      {...register(`roster.${index}.quantity` as const, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </section>

      <section className="rounded-2xl border border-slate bg-navy-mid/90 p-6 md:p-8">
        <TextareaField
          control={control}
          name="additionalNotes"
          label="Anything else we should know?"
          placeholder="e.g. Two jerseys per player, captain patches, alternate spelling…"
          rows={4}
        />
      </section>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-body-sm text-gray-soft">
          Submitting confirms the details above match your approved quote. We may
          reach out to confirm totals before production.
        </p>
        <Button type="submit" variant="primary" disabled={sending} className="min-w-[200px]">
          {sending ? "Sending…" : "Submit roster"}
        </Button>
      </div>
    </form>
  );
}
