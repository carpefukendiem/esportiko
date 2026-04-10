import { z } from "zod";
import {
  HEARD_ABOUT_OPTIONS,
  LIKELY_ORDER_TYPES,
  ONBOARDING_SPORTS,
} from "@/lib/portal/onboardingOptions";

const sportField = z
  .string()
  .min(1, "Select a sport")
  .refine(
    (s) => (ONBOARDING_SPORTS as readonly string[]).includes(s),
    "Select a sport"
  );

const heardField = z
  .string()
  .min(1, "Tell us how you heard about us")
  .refine(
    (s) => (HEARD_ABOUT_OPTIONS as readonly string[]).includes(s),
    "Tell us how you heard about us"
  );

export const onboardingWizardSchema = z.object({
  team_name: z.string().min(1, "Team name is required"),
  contact_name: z.string().min(1, "Your name is required"),
  sport: sportField,
  league_or_school: z.string().optional(),
  contact_phone: z.string().optional(),
  heard_about_us: heardField,
  likely_order_types: z
    .array(z.enum(LIKELY_ORDER_TYPES))
    .min(1, "Choose at least one option"),
  onboarding_notes: z.string().optional(),
});

export type OnboardingWizardValues = z.infer<typeof onboardingWizardSchema>;

export const onboardingStep1Schema = onboardingWizardSchema.pick({
  team_name: true,
  contact_name: true,
  sport: true,
  league_or_school: true,
  contact_phone: true,
});

export const onboardingStep2Schema = onboardingWizardSchema.pick({
  heard_about_us: true,
  likely_order_types: true,
  onboarding_notes: true,
});
