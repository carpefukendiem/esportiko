export const ONBOARDING_SPORTS = [
  "Soccer",
  "Basketball",
  "Baseball",
  "Softball",
  "Football",
  "Volleyball",
  "Lacrosse",
  "Swimming",
  "Track & Field",
  "Wrestling",
  "Cheer",
  "Dance",
  "Other",
] as const;

export type OnboardingSport = (typeof ONBOARDING_SPORTS)[number];

export const HEARD_ABOUT_OPTIONS = [
  "Google Search",
  "Referral from someone",
  "Social media",
  "Returning customer",
  "Other",
] as const;

export type HeardAboutOption = (typeof HEARD_ABOUT_OPTIONS)[number];

export const LIKELY_ORDER_TYPES = [
  "Jerseys",
  "Hoodies",
  "T-Shirts",
  "Polos",
  "Hats",
  "Warm-ups",
  "Spirit wear",
  "Mixed / not sure yet",
] as const;

export type LikelyOrderType = (typeof LIKELY_ORDER_TYPES)[number];
