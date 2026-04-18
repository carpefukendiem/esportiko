"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TextField } from "@/components/forms/fields/TextField";
import { EmailField } from "@/components/forms/fields/EmailField";
import { PhoneField } from "@/components/forms/fields/PhoneField";
import { TextareaField } from "@/components/forms/fields/TextareaField";
import { SelectField } from "@/components/forms/fields/SelectField";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/schemas/contactSchema";
import { captureLeadMeta } from "@/lib/utils/leadMeta";
import { useFormSubmit } from "@/lib/hooks/useFormSubmit";
import { formSubmitErrorMessage, sitePhone } from "@/lib/data/site";

const SERVICE_INTEREST = [
  { value: "general", label: "General inquiry" },
  { value: "Screen Printing", label: "Screen Printing" },
  { value: "Embroidery", label: "Embroidery" },
  { value: "Team Orders", label: "Team Orders" },
  { value: "Business Apparel", label: "Business Apparel" },
];

const APPAREL_OPTIONS = [
  "Jerseys",
  "Hoodies",
  "T-Shirts",
  "Polos",
  "Hats",
  "Bags / totes",
  "Other",
];

const CONTACT_ERROR = formSubmitErrorMessage;

export function ContactForm() {
  const pathname = usePathname();
  const { submit, isLoading, isSuccess, isError } = useFormSubmit();
  const [thanksName, setThanksName] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      serviceInterest: "general",
      garmentInterests: [],
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: ContactFormValues) => {
    let message = values.message.trim();
    if (
      values.serviceInterest &&
      values.serviceInterest !== "general"
    ) {
      message += `\n\nService interest: ${values.serviceInterest}`;
    }

    const meta = captureLeadMeta(pathname, "contact");
    const payload: Record<string, unknown> = {
      ...meta,
      formType: "contact",
      name: values.name.trim(),
      subject: values.subject.trim(),
      message,
    };
    const e = values.email.trim();
    const p = (values.phone ?? "").trim();
    if (e) payload.email = e;
    if (p) payload.phone = p;
    if (values.garmentInterests?.length) {
      payload.garment_types = values.garmentInterests;
    }

    const ok = await submit(payload);
    if (ok) setThanksName(values.name.trim());
  };

  if (isSuccess && thanksName) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="rounded-xl border border-slate bg-navy-mid/80 px-6 py-10 text-center md:px-8"
        role="status"
      >
        <p className="text-body text-off-white">
          Thanks {thanksName.split(/\s+/)[0] ?? thanksName} — we got your
          message and will follow up
          within 1 business day. Need something faster? Call or text us at{" "}
          <a
            href={sitePhone.telHref}
            className="font-semibold text-blue-accent hover:text-blue-light hover:underline"
          >
            {sitePhone.display}
          </a>
          .
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-xl border border-slate bg-navy-mid/80 p-6 md:p-8"
      noValidate
    >
      <TextField name="name" label="Name" control={control} />
      <EmailField
        name="email"
        label="Email"
        control={control}
        description="Provide email and/or phone so we can reach you."
      />
      <PhoneField
        name="phone"
        label="Phone"
        control={control}
        description="Optional if you prefer email — include for call or text."
      />
      <TextField name="subject" label="Subject" control={control} />
      <SelectField
        name="serviceInterest"
        label="Service interest"
        control={control}
        options={SERVICE_INTEREST}
        placeholder="Select"
      />
      <Controller
        name="garmentInterests"
        control={control}
        render={({ field, fieldState }) => (
          <fieldset className="space-y-3">
            <legend className="font-sans text-label font-medium uppercase tracking-wider text-gray-soft">
              Apparel you have in mind (optional)
            </legend>
            <p className="text-body-sm text-gray-soft">
              Helps us route your message and pre-fill quote details when we set
              up your portal.
            </p>
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
                  <span className="text-body-sm text-off-white">{opt}</span>
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
      <TextareaField
        name="message"
        label="Message"
        control={control}
        rows={6}
        placeholder="Tell us what you are trying to produce, quantities, and timeline."
      />
      {isError ? (
        <p className="text-body-sm text-error" role="alert">
          {CONTACT_ERROR}
        </p>
      ) : null}
      <Button type="submit" variant="primary" width="full" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
