/** Shared select options for team intake forms (order + roster). */

export const SPORT_OPTIONS = [
  { value: "baseball", label: "Baseball" },
  { value: "softball", label: "Softball" },
  { value: "basketball", label: "Basketball" },
  { value: "football", label: "Football" },
  { value: "soccer", label: "Soccer" },
  { value: "volleyball", label: "Volleyball" },
  { value: "lacrosse", label: "Lacrosse" },
  { value: "hockey", label: "Hockey" },
  { value: "other", label: "Other" },
];

const y = new Date().getFullYear();
export const SEASON_OPTIONS = [
  { value: `spring-${y}`, label: `Spring ${y}` },
  { value: `summer-${y}`, label: `Summer ${y}` },
  { value: `fall-${y}`, label: `Fall ${y}` },
  { value: `winter-${y}`, label: `Winter ${y}` },
  { value: `spring-${y + 1}`, label: `Spring ${y + 1}` },
  { value: `summer-${y + 1}`, label: `Summer ${y + 1}` },
  { value: `fall-${y + 1}`, label: `Fall ${y + 1}` },
  { value: `winter-${y + 1}`, label: `Winter ${y + 1}` },
];
