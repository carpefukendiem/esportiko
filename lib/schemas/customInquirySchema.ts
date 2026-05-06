import { z } from "zod";

export const customInquirySchema = z.object({
  name: z.string().min(2, "Enter at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length === 0 || /^[\d\s\-+().]{10,}$/.test(val),
      { message: "Use digits and common separators; at least 10 characters." }
    ),
  message: z
    .string()
    .min(10, "Please add a bit more detail (10+ characters)")
    .max(2000, "Please keep your message under 2000 characters"),
});

export type CustomInquiryValues = z.infer<typeof customInquirySchema>;
