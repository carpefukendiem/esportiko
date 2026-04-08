import { z } from "zod";
import {
  hasValidLeadEmail,
  hasValidLeadPhone,
} from "@/lib/schemas/submitLeadSchema";

export const contactFormSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string(),
    phone: z.string(),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(10, "Please add a bit more detail (10+ characters)"),
    serviceInterest: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const email = data.email.trim();
    const phone = data.phone.trim();
    if (email && !z.string().email().safeParse(email).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid email",
        path: ["email"],
      });
    }
    if (phone && !/^[\d\s\-+().]{10,}$/.test(phone)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Use digits and common separators; at least 10 characters.",
        path: ["phone"],
      });
    }
    if (!hasValidLeadEmail(email) && !hasValidLeadPhone(phone)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid email or phone number",
        path: ["email"],
      });
    }
  });

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const contactLeadApiSchema = z.object({
  sourcePage: z.string(),
  formType: z.literal("contact"),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  landingPage: z.string().optional(),
  submissionTimestamp: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.preprocess(
    (v) =>
      v === "" || v === null || v === undefined ? undefined : v,
    z
      .string()
      .regex(/^[\d\s\-+().]{10,}$/, "Invalid phone format")
      .optional()
  ),
  subject: z.string(),
  message: z.string(),
  serviceInterest: z.string().optional(),
});
