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
import { cn } from "@/lib/utils/cn";

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

const lightFieldDescendants =
  "[&_label]:!text-navy/85 [&_legend]:!text-navy/80 [&_input]:!border-navy/20 [&_input]:!bg-white [&_input]:!text-navy [&_input]:placeholder:!text-slate-400 [&_textarea]:!border-navy/20 [&_textarea]:!bg-white [&_textarea]:!text-navy [&_textarea]:placeholder:!text-slate-400 [&_button[role=combobox]]:!border-navy/20 [&_button[role=combobox]]:!bg-white [&_button[role=combobox]]:!text-navy [&_fieldset>p.text-body-sm]:!text-slate-600 [&_label~p.text-body-sm]:!text-slate-600 [&_fieldset_label.flex]:!border-navy/15 [&_fieldset_label.flex]:!bg-[#f5f7fa] [&_fieldset_label_span]:!text-navy";

export function ContactForm({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const pathname = usePathname();
  const { submit, isLoading, isSuccess, isError, errorMessage } = useFormSubmit();
  const [thanksName, setThanksName] = useState<string | null>(null);
  const light = tone === "light";

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
        className={cn(
          "rounded-xl px-6 py-10 text-center md:px-8",
          light
            ? "border border-navy/15 bg-white text-navy shadow-sm"
            : "border border-slate bg-navy-mid/80 text-off-white"
        )}
        role="status"
      >
        <p className={cn("text-body leading-relaxed", light ? "text-navy/90" : "text-off-white")}>
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
      className={cn(
        "space-y-6 rounded-xl border p-6 md:p-8",
        light
          ? cn("border-navy/15 bg-white shadow-sm", lightFieldDescendants)
          : "border-slate bg-navy-mid/80"
      )}
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
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-md border px-3 py-3",
                    light ? "border-navy/15 bg-[#f5f7fa]" : "border-slate bg-navy-light"
                  )}
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
                  <span
                    className={cn(
                      "text-body-sm",
                      light ? "text-navy" : "text-off-white"
                    )}
                  >
                    {opt}
                  </span>
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
          {errorMessage?.trim() ? errorMessage : CONTACT_ERROR}
        </p>
      ) : null}
      <Button
        type="submit"
        variant={light ? "navy" : "primary"}
        width="full"
        disabled={isLoading}
        className={light ? "focus-visible:ring-offset-white" : undefined}
      >
        {isLoading ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
