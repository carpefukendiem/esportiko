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
import { motion } from "framer-motion";
import {
  businessOrderFormSchema,
  type BusinessOrderFormValues,
} from "@/lib/schemas/businessOrderSchema";
import { captureLeadMeta } from "@/lib/utils/leadMeta";
import { useFormSubmit } from "@/lib/hooks/useFormSubmit";
import { formSubmitErrorMessage } from "@/lib/data/site";

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

const BUSINESS_QUOTE_ERROR = formSubmitErrorMessage;

export function BusinessOrderForm() {
  const pathname = usePathname();
  const [step, setStep] = useState(0);
  const { submit, isLoading, isSuccess, isError } = useFormSubmit();
  const [thanks, setThanks] = useState<{
    contactName: string;
    businessName: string;
  } | null>(null);

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
    const meta = captureLeadMeta(pathname, "business-order");
    const files = values.logoFiles as File[] | File | undefined;
    const fileList = files
      ? Array.isArray(files)
        ? files
        : [files]
      : [];
    const logoUpload = fileList[0]?.name ?? "";

    const notesParts = [
      values.notes?.trim(),
      `Project type: ${values.projectType}`,
      values.projectDescription?.trim(),
      values.deadline?.trim() && `Deadline: ${values.deadline}`,
      `Preferred contact: ${values.preferredContact}`,
      values.isRepeatOrder ? "Repeat order: yes" : null,
      values.needsGarmentSourcing ? "Needs garment sourcing: yes" : null,
    ].filter(Boolean);

    const payload: Record<string, unknown> = {
      ...meta,
      formType: "business-order",
      contactName: values.contactName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      businessName: values.businessName.trim(),
      decorationType: values.decorationType,
      garments: values.garmentsNeeded.trim(),
      quantity: values.estimatedQuantity,
      placement: (values.placementNotes ?? "").trim(),
      logoUpload,
      notes: notesParts.length ? notesParts.join("\n") : "",
    };

    const ok = await submit(payload);
    if (ok) {
      setThanks({
        contactName: values.contactName.trim(),
        businessName: values.businessName.trim(),
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
          received your request for{" "}
          {thanks.businessName} and will be in touch within 1 business day.
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

      {isError ? (
        <p className="text-body-sm text-error" role="alert">
          {BUSINESS_QUOTE_ERROR}
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
          {step === 0 ? (
            <Button type="button" variant="primary" onClick={goNext}>
              Next
            </Button>
          ) : (
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? "Sending..." : "Submit Business Order Request"}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
