import type { Metadata } from "next";

const siteUrl = "https://esportikosb.com";

/** Default suffix for document titles site-wide */
export const SITE_TITLE_SUFFIX = "Esportiko — Custom Apparel Santa Barbara";

export function formatPageTitle(pageName: string): string {
  const trimmed = pageName.trim();
  if (trimmed.includes(SITE_TITLE_SUFFIX)) {
    return trimmed;
  }
  return `${trimmed} | ${SITE_TITLE_SUFFIX}`;
}

export function buildMetadata({
  title,
  description,
  path = "",
  type = "website",
}: {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
}): Metadata {
  const url = `${siteUrl}${path}`;
  const fullTitle = formatPageTitle(title);
  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: "Esportiko",
      type,
    },
  };
}
