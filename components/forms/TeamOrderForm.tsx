"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { TextField } from "@/components/forms/fields/TextField";
import { EmailField } from "@/components/forms/fields/EmailField";
import { PhoneField } from "@/components/forms/fields/PhoneField";
import { TextareaField } from "@/components/forms/fields/TextareaField";
import { SelectField } from "@/components/forms/fields/SelectField";
import { RadioGroupField } from "@/components/forms/fields/RadioGroupField";
import { SwitchField } from "@/components/forms/fields/SwitchField";
import { UploadField } from "@/components/forms/fields/UploadField";
import { RosterTable } from "@/components/forms/RosterTable";
import { FormSuccess } from "@/components/forms/FormSuccess";
import {
  teamOrderFormSchema,
  type TeamOrderFormValues,
} from "@/lib/schemas/teamOrderSchema";
import { filesToAssetMetaList } from "@/lib/utils/formatPayload";
import { captureLeadMeta } from "@/lib/utils/leadMeta";
import type { TeamOrderLead } from "@/lib/types";

const SPORT_OPTIONS = [
  { value: "Football", label: "Football" },
  { value: "Baseball", label: "Baseball" },
  { value: "Softball", label: "Softball" },
  { value: "Basketball", label: "Basketball" },
  { value: "Soccer", label: "Soccer" },
  { value: "Volleyball", label: "Volleyball" },
  { value: "Wrestling", label: "Wrestling" },
  { value: "Track & Field", label: "Track & Field" },
  { value: "Cheer", label: "Cheer" },
  { value: "Lacrosse", label: "Lacrosse" },
  { value: "Hockey", label: "Hockey" },
  { value: "Other", label: "Other" },
];

const SEASON_OPTIONS = [
  { value: "Spring 2026", label: "Spring 2026" },
  { value: "Summer 2026", label: "Summer 2026" },
  { value: "Fall 2026", label: "Fall 2026" },
  { value: "Winter 2026/27", label: "Winter 2026/27" },
  { value: "Other", label: "Other" },
];

const ROLE_OPTIONS = [
  { value: "coach", label: "Coach" },
  { value: "manager", label: "Team Manager" },
  { value: "parent", label: "Parent" },
  { value: "admin", label: "Athletic Director / Club Admin" },
  { value: "other", label: "Other" },
];

const APPAREL_OPTIONS = [
  "Jerseys",
  "Shorts/Pants",
  "Hoodies",
  "T-Shirts",
  "Hats",
  "Warmup Jackets",
  "Polos",
  "Other",
];

const DECORATION_OPTIONS = [
  { value: "Screen Printing", label: "Screen Printing" },
  { value: "Embroidery", label: "Embroidery" },
  { value: "Both", label: "Both" },
  { value: "Not Sure", label: "Not Sure" },
];

const STEP_LABELS = [
  "Team details",
  "Contact",
  "Apparel & decoration",
  "Roster",
];

const stepFieldGroups: (keyof TeamOrderFormValues)[][] = [
  ["teamName", "sport", "season"],
  ["contactName", "role", "email", "phone", "preferredContact"],
  ["apparelItems", "decorationType", "estimatedPlayers"],
];

export function TeamOrderForm() {
  const pathname = usePathname();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const form = useForm<TeamOrderFormValues>({
    resolver: zodResolver(teamOrderFormSchema) as Resolver<TeamOrderFormValues>,
    defaultValues: {
      teamName: "",
      sport: "",
      season: "",
      dueDate: "",
      notes: "",
      contactName: "",
      role: "coach",
      email: "",
      phone: "",
      preferredContact: "email",
      apparelItems: [],
      decorationType: "",
      estimatedPlayers: 1,
      needsNamesNumbers: false,
      needsGarmentSourcing: false,
      rosterReady: false,
      roster: [],
      logoFiles: undefined,
    },
    mode: "onTouched",
  });

  const {
    control,
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = form;

  const rosterReady = watch("rosterReady");

  const goNext = async () => {
    const fields = stepFieldGroups[step];
    const ok = await trigger(fields);
    if (!ok) return;
    setStep((s) => Math.min(s + 1, 3));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (values: TeamOrderFormValues) => {
    setSubmitError(null);
    setSending(true);
    const meta = captureLeadMeta(pathname, "team-order");
    const files = values.logoFiles as File[] | File | undefined;
    const fileList = files
      ? Array.isArray(files)
        ? files
        : [files]
      : [];
    const uploadedAssets = filesToAssetMetaList(fileList);

    const payload: TeamOrderLead = {
      ...meta,
      orderType: "team",
      teamName: values.teamName,
      sport: values.sport,
      season: values.season,
      contactName: values.contactName,
      role: values.role,
      email: values.email,
      phone: values.phone,
      preferredContact: values.preferredContact,
      dueDate: values.dueDate || undefined,
      apparelItems: values.apparelItems,
      decorationType: values.decorationType,
      estimatedPlayers: values.estimatedPlayers,
      needsNamesNumbers: values.needsNamesNumbers,
      needsGarmentSourcing: values.needsGarmentSourcing,
      rosterReady: values.rosterReady,
      roster:
        values.rosterReady && values.roster?.length
          ? values.roster
          : undefined,
      notes: values.notes || undefined,
      uploadedAssets: uploadedAssets.length ? uploadedAssets : undefined,
    };

    try {
      const res = await fetch("/api/lead/team-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setSubmitError(
          data.error ??
            "Something went wrong. Please try again or contact us directly."
        );
        setSending(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError(
        "Something went wrong. Please try again or contact us directly."
      );
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return <FormSuccess />;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-3xl space-y-10 rounded-xl border border-slate bg-navy-mid/80 p-6 md:p-10"
      noValidate
    >
      <div className="space-y-2">
        <p className="font-sans text-label font-semibold uppercase tracking-wider text-blue-accent">
          Team order request
        </p>
        <h1 className="font-display text-2xl font-semibold uppercase tracking-tight text-white md:text-3xl">
          Start your team order
        </h1>
        <p className="text-body-sm text-gray-soft">
          Clear answers here reduce back-and-forth. We will confirm timeline and
          next steps directly.
        </p>
      </div>

      <StepIndicator current={step + 1} total={4} labels={STEP_LABELS} />

      {step === 0 ? (
        <div className="space-y-6">
          <p className="font-sans text-label font-semibold uppercase tracking-wider text-gray-soft">
            Tell us about your team
          </p>
          <TextField
            name="teamName"
            label="Team / organization name"
            control={control}
            placeholder="e.g., Goleta Youth Baseball"
          />
          <SelectField
            name="sport"
            label="Sport"
            control={control}
            options={SPORT_OPTIONS}
          />
          <SelectField
            name="season"
            label="Season"
            control={control}
            options={SEASON_OPTIONS}
            description="We'll use this to confirm your timeline."
          />
          <TextField
            name="dueDate"
            label="In-hands / due date"
            control={control}
            type="date"
            description="Optional — approximate is fine if you're still scheduling."
          />
          <TextareaField
            name="notes"
            label="Notes / design direction"
            control={control}
            placeholder="League requirements, color preferences, sponsor logos, etc."
          />
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-6">
          <p className="font-sans text-label font-semibold uppercase tracking-wider text-gray-soft">
            Primary contact
          </p>
          <TextField
            name="contactName"
            label="Contact name"
            control={control}
          />
          <SelectField
            name="role"
            label="Your role"
            control={control}
            options={ROLE_OPTIONS}
          />
          <EmailField name="email" label="Email" control={control} />
          <PhoneField name="phone" label="Phone" control={control} />
          <RadioGroupField
            name="preferredContact"
            label="Preferred contact method"
            control={control}
            options={[
              { value: "email", label: "Email" },
              { value: "phone", label: "Phone" },
              { value: "text", label: "Text" },
            ]}
          />
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-8">
          <p className="font-sans text-label font-semibold uppercase tracking-wider text-gray-soft">
            Apparel & decoration
          </p>
          <Controller
            name="apparelItems"
            control={control}
            render={({ field, fieldState }) => (
              <fieldset className="space-y-3">
                <legend className="font-sans text-label font-medium uppercase tracking-wider text-gray-soft">
                  Apparel items needed
                </legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {APPAREL_OPTIONS.map((opt) => (
                    <label
                      key={opt}
                      className="flex cursor-pointer items-center gap-3 rounded-md border border-slate bg-navy-light px-3 py-3"
                    >
                      <Checkbox
                        checked={field.value?.includes(opt)}
                        onCheckedChange={(checked) => {
                          const cur = field.value ?? [];
                          field.onChange(
                            checked
                              ? [...cur, opt]
                              : cur.filter((x: string) => x !== opt)
                          );
                        }}
                      />
                      <span className="text-body text-off-white">{opt}</span>
                    </label>
                  ))}
                </div>
                {fieldState.error ? (
                  <p className="text-body-sm text-error" role="alert">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </fieldset>
            )}
          />
          <RadioGroupField
            name="decorationType"
            label="Decoration type"
            control={control}
            options={DECORATION_OPTIONS}
          />
          <TextField
            name="estimatedPlayers"
            label="Estimated number of players / staff"
            control={control}
            type="number"
          />
          <SwitchField
            name="needsNamesNumbers"
            label="Need names & numbers?"
            control={control}
            description="We coordinate assignments with your roster details."
          />
          <SwitchField
            name="needsGarmentSourcing"
            label="Need help sourcing garments?"
            control={control}
            description="We can recommend styles that fit your budget and timeline."
          />
          <UploadField
            name="logoFiles"
            label="Upload logo / artwork"
            control={control}
          />
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-8">
          <p className="font-sans text-label font-semibold uppercase tracking-wider text-gray-soft">
            Roster (optional now)
          </p>
          <SwitchField
            name="rosterReady"
            label="Do you have roster details ready?"
            control={control}
            description='Turn on to enter players now. Leave off if you prefer to follow up later — you can still request a quote.'
          />
          {rosterReady ? (
            <RosterTable
              control={control}
              register={register}
              errors={errors}
            />
          ) : (
            <div className="rounded-xl border border-slate bg-navy-light/50 p-6 text-body-sm text-gray-soft">
              No problem — you can still request a quote now. We will follow up to
              collect roster details before production begins.
            </div>
          )}
        </div>
      ) : null}

      {submitError ? (
        <p className="text-body-sm text-error" role="alert">
          {submitError}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 border-t border-slate pt-6 sm:flex-row sm:justify-between">
        {step > 0 ? (
          <Button
            type="button"
            variant="secondary"
            onClick={goBack}
            disabled={sending}
          >
            Back
          </Button>
        ) : (
          <span className="hidden sm:block" />
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          {step < 3 ? (
            <Button type="button" variant="primary" onClick={goNext}>
              Next
            </Button>
          ) : (
            <Button type="submit" variant="primary" disabled={sending}>
              {sending ? "Sending..." : "Submit Team Order Request"}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
