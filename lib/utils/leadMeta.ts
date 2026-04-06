import type { LeadSourceMeta } from "@/lib/types";

export function captureLeadMeta(
  pathname: string,
  formType: LeadSourceMeta["formType"]
): Pick<
  LeadSourceMeta,
  | "sourcePage"
  | "formType"
  | "utmSource"
  | "utmMedium"
  | "utmCampaign"
  | "landingPage"
  | "submissionTimestamp"
> {
  const params =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : undefined;

  return {
    sourcePage: pathname,
    formType,
    utmSource: params?.get("utm_source") ?? undefined,
    utmMedium: params?.get("utm_medium") ?? undefined,
    utmCampaign: params?.get("utm_campaign") ?? undefined,
    landingPage:
      typeof window !== "undefined" ? window.location.href : undefined,
    submissionTimestamp: new Date().toISOString(),
  };
}
