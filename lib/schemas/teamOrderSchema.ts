import { z } from "zod";

const rosterRowSchema = z.object({
  id: z.string().min(1),
  playerName: z.string().min(1, "Player name is required"),
  number: z.string().min(1, "Number is required"),
  size: z.string().min(1, "Size is required"),
  quantity: z.preprocess(
    (v) => (typeof v === "string" ? Number(v) : v),
    z.number().int().min(1, "Quantity must be at least 1")
  ),
  notes: z.string().optional(),
});

export const teamOrderFormSchema = z
  .object({
    teamName: z.string().min(1, "Team or organization name is required"),
    sport: z.string().min(1, "Select a sport"),
    season: z.string().min(1, "Select a season"),
    dueDate: z.string().optional(),
    notes: z.string().optional(),
    contactName: z.string().min(1, "Contact name is required"),
    role: z.enum(["coach", "manager", "parent", "admin", "other"]),
    email: z.string().email("Enter a valid email"),
    phone: z
      .string()
      .min(1, "Phone is required")
      .regex(/^[\d\s\-+().]{10,}$/, "Enter a valid phone number"),
    preferredContact: z.enum(["email", "phone", "text"]),
    apparelItems: z.array(z.string()).min(1, "Select at least one apparel type"),
    decorationType: z.string().min(1, "Select a decoration type"),
    estimatedPlayers: z.preprocess(
      (v) => (typeof v === "string" ? Number(v) : v),
      z.number().int().min(1, "Enter at least 1")
    ),
    needsNamesNumbers: z.boolean(),
    needsGarmentSourcing: z.boolean(),
    rosterReady: z.boolean(),
    roster: z.array(rosterRowSchema).optional(),
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
  })
  .superRefine((data, ctx) => {
    if (!data.rosterReady) return;

    const roster = data.roster;
    if (!roster || roster.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Add at least one roster row or choose to skip roster for now.",
        path: ["roster"],
      });
      return;
    }

    roster.forEach((row, index) => {
      const result = rosterRowSchema.safeParse(row);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: ["roster", index, ...(issue.path as (string | number)[])],
          });
        });
      }
    });
  });

export type TeamOrderFormValues = z.infer<typeof teamOrderFormSchema>;

const uploadedAssetSchema = z.object({
  fileName: z.string(),
  fileSize: z.number(),
  fileType: z.string(),
  uploadedAt: z.string(),
  storagePath: z.string().optional(),
});

const rosterRowApiSchema = z.object({
  id: z.string(),
  playerName: z.string(),
  number: z.string(),
  size: z.string(),
  quantity: z.number(),
  notes: z.string().optional(),
});

export const teamOrderLeadApiSchema = z
  .object({
    sourcePage: z.string(),
    formType: z.literal("team-order"),
    utmSource: z.string().optional(),
    utmMedium: z.string().optional(),
    utmCampaign: z.string().optional(),
    landingPage: z.string().optional(),
    submissionTimestamp: z.string(),
    orderType: z.literal("team"),
    teamName: z.string(),
    sport: z.string(),
    season: z.string(),
    contactName: z.string(),
    role: z.enum(["coach", "manager", "parent", "admin", "other"]),
    email: z.string().email(),
    phone: z.string(),
    preferredContact: z.enum(["email", "phone", "text"]),
    dueDate: z.string().optional(),
    apparelItems: z.array(z.string()),
    decorationType: z.string(),
    estimatedPlayers: z.number(),
    needsNamesNumbers: z.boolean(),
    needsGarmentSourcing: z.boolean(),
    rosterReady: z.boolean(),
    roster: z.array(rosterRowApiSchema).optional(),
    notes: z.string().optional(),
    uploadedAssets: z.array(uploadedAssetSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.rosterReady) return;
    const roster = data.roster;
    if (!roster || roster.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Roster is required when roster details are marked ready.",
        path: ["roster"],
      });
    }
  });
