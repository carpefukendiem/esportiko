"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/forms/fields/TextField";
import { EmailField } from "@/components/forms/fields/EmailField";
import { PhoneField } from "@/components/forms/fields/PhoneField";
import { TextareaField } from "@/components/forms/fields/TextareaField";
import { SelectField } from "@/components/forms/fields/SelectField";
import { FormSuccess } from "@/components/forms/FormSuccess";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/schemas/contactSchema";
import { captureLeadMeta } from "@/lib/utils/leadMeta";
import type { ContactLead } from "@/lib/types";

const SERVICE_INTEREST = [
  { value: "general", label: "General inquiry" },
  { value: "Screen Printing", label: "Screen Printing" },
  { value: "Embroidery", label: "Embroidery" },
  { value: "Team Orders", label: "Team Orders" },
  { value: "Business Apparel", label: "Business Apparel" },
];

export function ContactForm() {
  const pathname = usePathname();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

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
    setSubmitError(null);
    setSending(true);
    const meta = captureLeadMeta(pathname, "contact");

    const payload: ContactLead = {
      ...meta,
      name: values.name,
      email: values.email,
      phone: values.phone?.trim() ? values.phone.trim() : undefined,
      subject: values.subject,
      message: values.message,
      serviceInterest:
        values.serviceInterest === "general"
          ? undefined
          : values.serviceInterest,
    };

    try {
      const res = await fetch("/api/lead/contact", {
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
      className="space-y-6 rounded-xl border border-slate bg-navy-mid/80 p-6 md:p-8"
      noValidate
    >
      <TextField name="name" label="Name" control={control} />
      <EmailField name="email" label="Email" control={control} />
      <PhoneField
        name="phone"
        label="Phone"
        control={control}
        description="Optional — include if you prefer a call or text."
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
      {submitError ? (
        <p className="text-body-sm text-error" role="alert">
          {submitError}
        </p>
      ) : null}
      <Button type="submit" variant="primary" width="full" disabled={sending}>
        {sending ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
