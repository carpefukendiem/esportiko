"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
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
