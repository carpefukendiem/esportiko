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
import {
  teamRosterDetailsFormSchema,
  type TeamRosterDetailsFormValues,
} from "@/lib/schemas/teamRosterDetailsSchema";
import { captureLeadMeta } from "@/lib/utils/leadMeta";
import { useFormSubmit } from "@/lib/hooks/useFormSubmit";
import { SelectField } from "@/components/forms/fields/SelectField";
import {
  SPORT_OPTIONS,
  SEASON_OPTIONS,
} from "@/lib/data/teamIntakeOptions";

function newRow(): TeamRosterDetailsFormValues["roster"][number] {
  return {
    id: crypto.randomUUID(),
    number: "",
    lastName: "",
    size: "",
    quantity: 1,
  };
}

const ROSTER_ERROR =
  "Something went wrong. Please try again or call us at (805) 335-2239.";

export function TeamRosterDetailsForm() {
  const pathname = usePathname();
  const { submit, isLoading, isSuccess, isError } = useFormSubmit();
  const [thanks, setThanks] = useState<{
    firstName: string;
    teamName: string;
  } | null>(null);

  const form = useForm<TeamRosterDetailsFormValues>({
    resolver: zodResolver(
      teamRosterDetailsFormSchema
    ) as Resolver<TeamRosterDetailsFormValues>,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      teamName: "",
      sport: "",
      season: "",
      deadline: "",
      garments: "",
      quantity: "",
      quoteReference: "",
      roleOrTitle: "",
      artworkNotes: "",
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
    const meta = captureLeadMeta(pathname, "team-roster");

    const rosterQtyLines = values.roster
      .map(
        (r) =>
          `${r.lastName.trim()} / #${r.number.trim()} / ${r.size.trim()} / qty ${r.quantity}`
      )
      .join("\n");

    const artworkNotes = [
      values.artworkNotes?.trim(),
      `Per-row quantities:\n${rosterQtyLines}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    const notes = [
      values.roleOrTitle?.trim() && `Role: ${values.roleOrTitle.trim()}`,
      values.quoteReference?.trim() &&
        `Quote ref: ${values.quoteReference.trim()}`,
      values.additionalNotes?.trim(),
    ]
      .filter(Boolean)
      .join("\n");

    const payload: Record<string, unknown> = {
      ...meta,
      formType: "team-roster",
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      teamName: values.teamName.trim(),
      sport: values.sport,
      season: values.season,
      deadline: values.deadline?.trim() ?? "",
      garments: values.garments.trim(),
      quantity: values.quantity.trim(),
      rosterEntries: values.roster.map((r) => ({
        playerName: r.lastName.trim(),
        number: r.number.trim(),
        size: r.size.trim(),
      })),
      artworkNotes,
      notes,
    };

    const ok = await submit(payload);
    if (ok) {
      setThanks({
        firstName: values.firstName.trim(),
        teamName: values.teamName.trim(),
      });
    }
  };

  if (isSuccess && thanks) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="rounded-xl border border-slate bg-navy-mid/80 px-6 py-10 text-center md:px-8"
        role="status"
      >
        <p className="text-body text-off-white">
          Thanks {thanks.firstName} — we received the roster for {thanks.teamName}.
          We&apos;ll review everything and follow up before anything goes to
          production.
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-10"
      noValidate
    >
      {isError ? (
        <p
          className="rounded-lg border border-error/50 bg-error/10 px-4 py-3 text-body-sm text-error"
          role="alert"
        >
          {ROSTER_ERROR}
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
            name="firstName"
            label="First name"
            placeholder="Jordan"
          />
          <TextField
            control={control}
            name="lastName"
            label="Last name"
            placeholder="Smith"
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
        <h2 className="mb-6 font-display text-xl font-semibold text-white md:text-2xl">
          Program &amp; order summary
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <SelectField
            control={control}
            name="sport"
            label="Sport"
            options={[...SPORT_OPTIONS]}
            placeholder="Select"
          />
          <SelectField
            control={control}
            name="season"
            label="Season"
            options={[...SEASON_OPTIONS]}
            placeholder="Select"
          />
          <TextField
            control={control}
            name="deadline"
            label="In-hands deadline (optional)"
            type="date"
            description="Approximate is fine."
          />
          <TextField
            control={control}
            name="quantity"
            label="Overall quantity / size summary"
            placeholder="e.g. 24 jerseys, mixed sizes Adult S–XL"
          />
          <div className="md:col-span-2">
            <TextareaField
              control={control}
              name="garments"
              label="Garments for this roster"
              placeholder="Jersey style, hoodies, hats — what this roster line-up applies to."
              rows={3}
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
          name="artworkNotes"
          label="Artwork &amp; decoration notes"
          placeholder="Logo placement, name font, two-sided prints, etc."
          rows={3}
        />
      </section>

      <section className="rounded-2xl border border-slate bg-navy-mid/90 p-6 md:p-8">
        <TextareaField
          control={control}
          name="additionalNotes"
          label="Anything else we should know?"
          placeholder="e.g. Captain patches, alternate spelling, shipping split…"
          rows={4}
        />
      </section>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-body-sm text-gray-soft">
          Submitting confirms the details above match your approved quote. We may
          reach out to confirm totals before production.
        </p>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className="min-w-[200px]"
        >
          {isLoading ? "Sending..." : "Submit roster"}
        </Button>
      </div>
    </form>
  );
}
