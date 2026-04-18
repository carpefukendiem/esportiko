import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length === 0 || /^[\d\s\-+().]{10,}$/.test(val),
      { message: "Use digits and common separators; at least 10 characters." }
    ),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Please add a bit more detail (10+ characters)"),
  serviceInterest: z.string().optional(),
  garmentInterests: z.array(z.string()).optional(),
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
  garment_types: z.array(z.string()).optional(),
});
