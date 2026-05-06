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
import {
  customInquirySchema,
  type CustomInquiryValues,
} from "@/lib/schemas/customInquirySchema";
import { captureLeadMeta } from "@/lib/utils/leadMeta";
import { useFormSubmit } from "@/lib/hooks/useFormSubmit";
import { formSubmitErrorMessage, sitePhone } from "@/lib/data/site";

export function CustomInquiryForm() {
  const pathname = usePathname();
  const { submit, isLoading, isSuccess, isError, errorMessage } = useFormSubmit();
  const [thanksName, setThanksName] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<CustomInquiryValues>({
    resolver: zodResolver(customInquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: CustomInquiryValues) => {
    const meta = captureLeadMeta(pathname, "custom-inquiry");
    const payload: Record<string, unknown> = {
      ...meta,
      formType: "custom-inquiry",
      name: values.name.trim(),
      message: values.message.trim(),
      email: values.email.trim(),
    };
    const p = (values.phone ?? "").trim();
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
        className="rounded-xl border border-slate bg-navy-mid/80 px-5 py-8 text-center md:px-6"
        role="status"
      >
        <p className="text-body text-off-white">
          Thanks {thanksName.split(/\s+/)[0] ?? thanksName} — we got your inquiry and will follow up
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
      className="space-y-4 rounded-xl border border-white/10 bg-gradient-to-br from-navy-light/80 via-navy to-navy-mid p-5 shadow-[0_20px_50px_-24px_rgba(8,12,24,0.5)] md:p-6"
      noValidate
    >
      <div className="text-left">
        <h2 className="font-display text-lg font-bold tracking-tight text-white md:text-xl">
          Something else?
        </h2>
        <p className="mt-1 text-body-sm text-off-white/70">
          Special projects, one-off requests, partnerships, or anything not covered above.
        </p>
      </div>

      {isError ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {errorMessage ?? formSubmitErrorMessage}
        </p>
      ) : null}

      <TextField name="name" label="Name" control={control} placeholder="Your name" />
      <EmailField name="email" label="Email" control={control} />
      <PhoneField name="phone" label="Phone (optional)" control={control} />

      <TextareaField
        name="message"
        label="How can we help?"
        control={control}
        placeholder="Tell us what you need..."
        rows={4}
      />

      <Button
        type="submit"
        variant="secondary"
        width="full"
        disabled={isLoading}
        className="mt-2"
      >
        {isLoading ? "Sending…" : "Send Inquiry"}
      </Button>
    </form>
  );
}
