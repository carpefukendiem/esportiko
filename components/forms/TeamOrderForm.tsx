"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
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
import { motion } from "framer-motion";
import {
  teamOrderFormSchema,
  type TeamOrderFormValues,
} from "@/lib/schemas/teamOrderSchema";
import { captureLeadMeta } from "@/lib/utils/leadMeta";
import { useFormSubmit } from "@/lib/hooks/useFormSubmit";
import { formSubmitErrorMessage } from "@/lib/data/site";
import { parseGarmentsQueryParam } from "@/lib/utils/garmentsQuery";
import {
  SPORT_OPTIONS,
  SEASON_OPTIONS,
} from "@/lib/data/teamIntakeOptions";

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

const TEAM_QUOTE_ERROR = formSubmitErrorMessage;

export function TeamOrderForm() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const garmentsFromUrlApplied = useRef(false);
  const [step, setStep] = useState(0);
  const { submit, isLoading, isSuccess, isError, errorMessage } = useFormSubmit();
  const [thanks, setThanks] = useState<{
    contactName: string;
    teamName: string;
  } | null>(null);

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
    setValue,
    watch,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (garmentsFromUrlApplied.current) return;
    const list = parseGarmentsQueryParam(searchParams.get("garments"));
    if (list.length === 0) return;
    garmentsFromUrlApplied.current = true;
    const matched = list.filter((g) =>
      (APPAREL_OPTIONS as readonly string[]).includes(g)
    );
    if (matched.length > 0) {
      setValue("apparelItems", matched, { shouldDirty: true, shouldValidate: true });
    }
  }, [searchParams, setValue]);

  const rosterReady = watch("rosterReady");

  const goNext = async () => {
    const fields = stepFieldGroups[step];
    const ok = await trigger(fields);
    if (!ok) return;
    setStep((s) => Math.min(s + 1, 3));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (values: TeamOrderFormValues) => {
    const meta = captureLeadMeta(pathname, "team-order");
    const files = values.logoFiles as File[] | File | undefined;
    const fileList = files
      ? Array.isArray(files)
        ? files
        : [files]
      : [];
    const logoUpload = fileList[0]?.name ?? "";

    const garments = values.apparelItems.join(", ");
    const rosterLines =
      values.rosterReady && values.roster?.length
        ? values.roster
            .map(
              (r) =>
                `${r.playerName} #${r.number} ${r.size} ×${r.quantity}`
            )
            .join("; ")
        : "";
    const notesParts = [
      values.notes?.trim(),
      `Role: ${values.role}`,
      `Preferred contact: ${values.preferredContact}`,
      `Decoration: ${values.decorationType}`,
      values.needsNamesNumbers ? "Needs names & numbers: yes" : null,
      values.needsGarmentSourcing ? "Needs garment sourcing: yes" : null,
      values.rosterReady
        ? `Roster provided (${values.roster?.length ?? 0} rows): ${rosterLines}`
        : "Roster: to follow / not attached",
    ].filter(Boolean);

    const payload: Record<string, unknown> = {
      ...meta,
      formType: "team-order",
      contactName: values.contactName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      teamName: values.teamName.trim(),
      sport: values.sport,
      season: values.season,
      deadline: values.dueDate?.trim() ?? "",
      garments,
      quantity: values.estimatedPlayers,
      logoUpload,
      notes: notesParts.length ? notesParts.join("\n") : "",
    };

    const ok = await submit(payload);
    if (ok) {
      setThanks({
        contactName: values.contactName.trim(),
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
        className="mx-auto max-w-3xl rounded-xl border border-slate bg-navy-mid/80 px-6 py-10 text-center md:px-10"
        role="status"
      >
        <p className="text-body text-off-white">
          Thanks {thanks.contactName.split(/\s+/)[0] ?? thanks.contactName} — we
          got your team order request for{" "}
          {thanks.teamName} and will follow up within 1 business day.
        </p>
      </motion.div>
    );
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
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField
              name="contactName"
              label="Contact name"
              control={control}
            />
          </div>
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

      {isError ? (
        <p className="text-body-sm text-error" role="alert">
          {errorMessage?.trim() ? errorMessage : TEAM_QUOTE_ERROR}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 border-t border-slate pt-6 sm:flex-row sm:justify-between">
        {step > 0 ? (
          <Button
            type="button"
            variant="secondary"
            onClick={goBack}
            disabled={isLoading}
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
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? "Sending..." : "Submit Team Order Request"}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
