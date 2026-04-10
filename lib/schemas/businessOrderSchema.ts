import { z } from "zod";

export const businessOrderFormSchema = z.object({
  businessName: z.string().min(1, "Business or organization name is required"),
  projectType: z.string().min(1, "Select a project type"),
  garmentsNeeded: z.string().min(1, "Describe the garments you need"),
  decorationType: z.string().min(1, "Select a decoration type"),
  estimatedQuantity: z.preprocess(
    (v) => (typeof v === "string" ? Number(v) : v),
    z.number().int().min(1, "Enter at least 1")
  ),
  deadline: z.string().optional(),
  projectDescription: z.string().optional(),
  placementNotes: z.string().optional(),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^[\d\s\-+().]{10,}$/, "Enter a valid phone number"),
  preferredContact: z.enum(["email", "phone", "text"]),
  isRepeatOrder: z.boolean(),
  needsGarmentSourcing: z.boolean(),
  notes: z.string().optional(),
  uploadedAssets: z
    .array(
      z.object({
        fileName: z.string(),
        fileSize: z.number(),
        fileType: z.string(),
        uploadedAt: z.string(),
        storagePath: z.string().optional(),
      })
    )
    .optional(),
  logoFiles: z.any().optional(),
});

export type BusinessOrderFormValues = z.infer<typeof businessOrderFormSchema>;

const uploadedAssetSchema = z.object({
  fileName: z.string(),
  fileSize: z.number(),
  fileType: z.string(),
  uploadedAt: z.string(),
  storagePath: z.string().optional(),
});

export const businessOrderLeadApiSchema = z.object({
  sourcePage: z.string(),
  formType: z.literal("business-order"),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  landingPage: z.string().optional(),
  submissionTimestamp: z.string(),
  orderType: z.literal("business"),
  businessName: z.string(),
  contactName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  projectType: z.string(),
  garmentsNeeded: z.string(),
  decorationType: z.string(),
  estimatedQuantity: z.number(),
  deadline: z.string().optional(),
  projectDescription: z.string().optional(),
  placementNotes: z.string().optional(),
  preferredContact: z.enum(["email", "phone", "text"]),
  isRepeatOrder: z.boolean().optional(),
  needsGarmentSourcing: z.boolean().optional(),
  notes: z.string().optional(),
  uploadedAssets: z.array(uploadedAssetSchema).optional(),
});
