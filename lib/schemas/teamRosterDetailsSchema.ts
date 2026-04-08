import { z } from "zod";

const jerseyRowSchema = z.object({
  id: z.string().min(1),
  number: z.string().min(1, "Jersey number is required"),
  lastName: z.string().min(1, "Last name is required"),
  size: z.string().min(1, "Size is required"),
  quantity: z.preprocess(
    (v) => (typeof v === "string" ? Number(v) : v),
    z.number().int().min(1, "Quantity must be at least 1")
  ),
});

export const teamRosterDetailsFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^[\d\s\-+().]{10,}$/, "Enter a valid phone number"),
  teamName: z.string().min(1, "Team or school name is required"),
  sport: z.string().min(1, "Select a sport"),
  season: z.string().min(1, "Select a season"),
  deadline: z.string().optional(),
  garments: z.string().min(1, "Describe garments for this roster"),
  quantity: z.string().min(1, "Quantity or size summary is required"),
  quoteReference: z.string().optional(),
  roleOrTitle: z.string().optional(),
  artworkNotes: z.string().optional(),
  additionalNotes: z.string().optional(),
  roster: z.array(jerseyRowSchema).min(1, "Add at least one player row"),
});

export type TeamRosterDetailsFormValues = z.infer<
  typeof teamRosterDetailsFormSchema
>;

