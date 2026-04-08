import { z } from "zod";

export const SUBMIT_LEAD_FORM_TYPES = [
  "team-order",
  "business-order",
  "contact",
  "team-roster",
] as const;

export type SubmitLeadFormType = (typeof SUBMIT_LEAD_FORM_TYPES)[number];

const PHONE_RE = /^[\d\s\-+().]{10,}$/;

export function hasValidLeadEmail(email: unknown): boolean {
  if (typeof email !== "string") return false;
  const t = email.trim();
  if (!t) return false;
  return z.string().email().safeParse(t).success;
}

export function hasValidLeadPhone(phone: unknown): boolean {
  if (typeof phone !== "string") return false;
  const t = phone.trim();
  if (!t) return false;
  return PHONE_RE.test(t);
}

const rosterEntrySchema = z.object({
  playerName: z.string().min(1),
  number: z.string().min(1),
  size: z.string().min(1),
});

/**
 * Server-side validation for POST /api/submit-lead.
 * Requires a valid email and/or phone, plus fields appropriate to formType.
 * Unknown keys (e.g. UTM meta) are preserved via passthrough for GHL.
 */
export const submitLeadRequestSchema = z
  .object({
    formType: z.enum(SUBMIT_LEAD_FORM_TYPES),
    email: z.string().optional(),
    phone: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    subject: z.string().optional(),
    message: z.string().optional(),
    businessName: z.string().optional(),
    decorationType: z.string().optional(),
    garments: z.string().optional(),
    quantity: z.union([z.string(), z.number()]).optional(),
    placement: z.string().optional(),
    logoUpload: z.string().optional(),
    notes: z.string().optional(),
    teamName: z.string().optional(),
    sport: z.string().optional(),
    season: z.string().optional(),
    deadline: z.string().optional(),
    rosterEntries: z.array(rosterEntrySchema).optional(),
    artworkNotes: z.string().optional(),
  })
  .passthrough()
  .superRefine((data, ctx) => {
    if (!hasValidLeadEmail(data.email) && !hasValidLeadPhone(data.phone)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide a valid email or phone number",
        path: ["email"],
      });
    }

    const req = (path: string, message: string) => {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: [path],
      });
    };

    switch (data.formType) {
      case "contact": {
        if (!data.firstName?.trim()) req("firstName", "First name is required");
        if (!data.lastName?.trim()) req("lastName", "Last name is required");
        if (!data.subject?.trim()) req("subject", "Subject is required");
        if (!data.message?.trim()) req("message", "Message is required");
        break;
      }
      case "business-order": {
        if (!data.firstName?.trim()) req("firstName", "First name is required");
        if (!data.lastName?.trim()) req("lastName", "Last name is required");
        if (!data.businessName?.trim())
          req("businessName", "Business name is required");
        if (!data.decorationType?.trim())
          req("decorationType", "Decoration type is required");
        if (!data.garments?.trim()) req("garments", "Garments are required");
        const q = data.quantity;
        const qOk =
          (typeof q === "number" && Number.isFinite(q) && q >= 1) ||
          (typeof q === "string" && q.trim().length > 0);
        if (!qOk) req("quantity", "Quantity is required");
        break;
      }
      case "team-order": {
        if (!data.firstName?.trim()) req("firstName", "First name is required");
        if (!data.lastName?.trim()) req("lastName", "Last name is required");
        if (!data.teamName?.trim()) req("teamName", "Team name is required");
        if (!data.sport?.trim()) req("sport", "Sport is required");
        if (!data.season?.trim()) req("season", "Season is required");
        if (!data.garments?.trim()) req("garments", "Garments are required");
        const q = data.quantity;
        const qOk =
          (typeof q === "number" && Number.isFinite(q) && q >= 1) ||
          (typeof q === "string" && q.trim().length > 0);
        if (!qOk) req("quantity", "Quantity is required");
        break;
      }
      case "team-roster": {
        if (!data.firstName?.trim()) req("firstName", "First name is required");
        if (!data.lastName?.trim()) req("lastName", "Last name is required");
        if (!data.teamName?.trim()) req("teamName", "Team name is required");
        if (!data.sport?.trim()) req("sport", "Sport is required");
        if (!data.season?.trim()) req("season", "Season is required");
        if (!data.garments?.trim()) req("garments", "Garments are required");
        const q = data.quantity;
        const qOk =
          (typeof q === "number" && Number.isFinite(q) && q >= 1) ||
          (typeof q === "string" && q.trim().length > 0);
        if (!qOk) req("quantity", "Quantity is required");
        const entries = data.rosterEntries;
        if (!entries || !Array.isArray(entries) || entries.length < 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Add at least one roster entry",
            path: ["rosterEntries"],
          });
        } else {
          entries.forEach((row, i) => {
            const r = rosterEntrySchema.safeParse(row);
            if (!r.success) {
              r.error.issues.forEach((issue) => {
                ctx.addIssue({
                  ...issue,
                  path: ["rosterEntries", i, ...(issue.path as string[])],
                });
              });
            }
          });
        }
        break;
      }
      default:
        break;
    }
  });

export type SubmitLeadRequest = z.infer<typeof submitLeadRequestSchema>;
