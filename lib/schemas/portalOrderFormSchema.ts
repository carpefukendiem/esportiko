import { z } from "zod";

export const rosterRowPortalSchema = z.object({
  id: z.string(),
  player_name: z.string().optional(),
  player_number: z.string().optional(),
  size: z.string().optional(),
  quantity: z.coerce.number().int().min(1).default(1),
});

export const portalOrderFormSchema = z.object({
  team_name: z.string().min(1, "Team name is required"),
  sport: z.string().optional(),
  season: z.string().min(1, "Select a season"),
  deadline: z.string().optional(),
  garment_type: z
    .array(z.string())
    .min(1, "Select at least one garment type to continue"),
  decoration_method: z.string().min(1, "Select a decoration method"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  color_notes: z.string().optional(),
  roster: z.array(rosterRowPortalSchema).default([]),
  roster_skip: z.boolean().default(false),
  artwork_url: z.string().optional(),
  artwork_deferred: z.boolean().default(false),
  notes: z.string().optional(),
});

export type PortalOrderFormValues = z.infer<typeof portalOrderFormSchema>;

export const step1Schema = portalOrderFormSchema.pick({
  team_name: true,
  sport: true,
  season: true,
  deadline: true,
  garment_type: true,
  decoration_method: true,
  quantity: true,
  color_notes: true,
});

export const step2Schema = z
  .object({
    roster: z.array(rosterRowPortalSchema),
    roster_skip: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.roster_skip && data.roster.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Add at least one player or check “I'll add this later”",
        path: ["roster"],
      });
    }
  });

export const step3Schema = z
  .object({
    artwork_url: z.string().optional(),
    artwork_deferred: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.artwork_deferred && !data.artwork_url) {
      ctx.addIssue({
        code: "custom",
        message: "Upload artwork, pick an existing file, or check “I'll send artwork separately”",
        path: ["artwork_url"],
      });
    }
  });
