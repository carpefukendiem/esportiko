"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { FormSuccess } from "@/components/forms/FormSuccess";
import {
  businessOrderFormSchema,
  type BusinessOrderFormValues,
} from "@/lib/schemas/businessOrderSchema";
import { filesToAssetMetaList } from "@/lib/utils/formatPayload";
import { captureLeadMeta } from "@/lib/utils/leadMeta";
import type { BusinessOrderLead } from "@/lib/types";

const PROJECT_TYPES = [
  { value: "Staff Uniforms", label: "Staff Uniforms" },
  { value: "Event Merch", label: "Event Merch" },
  { value: "Company Swag", label: "Company Swag" },
  { value: "Branded Merchandise", label: "Branded Merchandise" },
  { value: "Restaurant Uniforms", label: "Restaurant Uniforms" },
  { value: "Nonprofit/Fundraiser", label: "Nonprofit / Fundraiser" },
  { value: "Other", label: "Other" },
];

const DECORATION_OPTIONS = [
  { value: "Screen Printing", label: "Screen Printing" },
  { value: "Embroidery", label: "Embroidery" },
  { value: "Both", label: "Both" },
  { value: "Not Sure", label: "Not Sure" },
];

const STEP_LABELS = ["Project details", "Contact"];

const stepFieldGroups: (keyof BusinessOrderFormValues)[][] = [
  [
    "businessName",
    "projectType",
    "garmentsNeeded",
    "decorationType",
    "estimatedQuantity",
  ],
  ["contactName", "email", "phone", "preferredContact"],
];

export function BusinessOrderForm() {
  const pathname = usePathname();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const form = useForm<BusinessOrderFormValues>({
    resolver: zodResolver(
      businessOrderFormSchema
    ) as Resolver<BusinessOrderFormValues>,
    defaultValues: {
      businessName: "",
      projectType: "",
      garmentsNeeded: "",
      decorationType: "",
      estimatedQuantity: 1,
      deadline: "",
      projectDescription: "",
      placementNotes: "",
      contactName: "",
      email: "",
      phone: "",
      preferredContact: "email",
      isRepeatOrder: false,
      needsGarmentSourcing: false,
      notes: "",
      logoFiles: undefined,
    },
    mode: "onTouched",
  });

  const { control, handleSubmit, trigger } = form;

  const goNext = async () => {
    const ok = await trigger(stepFieldGroups[step]);
    if (!ok) return;
    setStep(1);
  };

  const goBack = () => setStep(0);

  const onSubmit = async (values: BusinessOrderFormValues) => {
    setSubmitError(null);
    setSending(true);
    const meta = captureLeadMeta(pathname, "business-order");
    const files = values.logoFiles as File[] | File | undefined;
    const fileList = files
      ? Array.isArray(files)
        ? files
        : [files]
      : [];
    const uploadedAssets = filesToAssetMetaList(fileList);

    const payload: BusinessOrderLead = {
      ...meta,
      orderType: "business",
      businessName: values.businessName,
      contactName: values.contactName,
      email: values.email,
      phone: values.phone,
      projectType: values.projectType,
      garmentsNeeded: values.garmentsNeeded,
      decorationType: values.decorationType,
      estimatedQuantity: values.estimatedQuantity,
      deadline: values.deadline || undefined,
      projectDescription: values.projectDescription || undefined,
      placementNotes: values.placementNotes || undefined,
      preferredContact: values.preferredContact,
      isRepeatOrder: values.isRepeatOrder,
      needsGarmentSourcing: values.needsGarmentSourcing,
      notes: values.notes || undefined,
      uploadedAssets: uploadedAssets.length ? uploadedAssets : undefined,
    };

    try {
      const res = await fetch("/api/lead/business-order", {
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
          Business order request
        </p>
        <h1 className="font-display text-2xl font-semibold uppercase tracking-tight text-white md:text-3xl">
          Start your business order
        </h1>
        <p className="text-body-sm text-gray-soft">
          Share project context now so we can respond with clear next steps.
        </p>
      </div>

      <StepIndicator current={step + 1} total={2} labels={STEP_LABELS} />

      {step === 0 ? (
        <div className="space-y-6">
          <p className="font-sans text-label font-semibold uppercase tracking-wider text-gray-soft">
            Project information
          </p>
          <TextField
            name="businessName"
            label="Business / organization name"
            control={control}
          />
          <SelectField
            name="projectType"
            label="Project type"
            control={control}
            options={PROJECT_TYPES}
          />
          <TextareaField
            name="garmentsNeeded"
            label="Garments needed"
            control={control}
            placeholder="Polos, tees, hats, jackets, aprons — styles, colors, and quantities if known."
          />
          <RadioGroupField
            name="decorationType"
            label="Decoration type"
            control={control}
            options={DECORATION_OPTIONS}
          />
          <TextField
            name="estimatedQuantity"
            label="Estimated quantity"
            control={control}
            type="number"
          />
          <TextField
            name="deadline"
            label="Deadline / in-hands date"
            control={control}
            type="date"
            description="We'll use this to confirm feasibility."
          />
          <UploadField
            name="logoFiles"
            label="Upload logo / artwork"
            control={control}
          />
          <TextareaField
            name="projectDescription"
            label="Project description"
            control={control}
            placeholder="How the pieces will be used, brand standards, event details."
          />
          <TextareaField
            name="placementNotes"
            label="Placement notes"
            control={control}
            description="Optional — chest, sleeve, back, etc."
          />
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-6">
          <p className="font-sans text-label font-semibold uppercase tracking-wider text-gray-soft">
            Contact
          </p>
          <TextField
            name="contactName"
            label="Contact name"
            control={control}
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
          <SwitchField
            name="isRepeatOrder"
            label="Repeat order?"
            control={control}
            description="Let us know if we have produced this program before."
          />
          <SwitchField
            name="needsGarmentSourcing"
            label="Need help sourcing garments?"
            control={control}
          />
          <TextareaField
            name="notes"
            label="Additional notes"
            control={control}
            description="Optional"
          />
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
          {step === 0 ? (
            <Button type="button" variant="primary" onClick={goNext}>
              Next
            </Button>
          ) : (
            <Button type="submit" variant="primary" disabled={sending}>
              {sending ? "Sending..." : "Submit Business Order Request"}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
