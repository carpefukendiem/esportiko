import type { Metadata } from "next";

const siteUrl = "https://esportikosb.com";

/** Default suffix for document titles site-wide */
export const SITE_TITLE_SUFFIX = "Esportiko — Custom Apparel Santa Barbara";

/**
 * Removes trailing ` | SITE_TITLE_SUFFIX` so we can pass a short segment to
 * `app/layout.tsx` `title.template` without doubling the suffix.
 */
export function stripTitleSuffixForTemplate(title: string): string {
  let t = title.trim();
  const suffix = ` | ${SITE_TITLE_SUFFIX}`;
  while (t.endsWith(suffix)) {
    t = t.slice(0, -suffix.length).trim();
  }
  return t;
}

export function formatPageTitle(pageName: string): string {
  const trimmed = stripTitleSuffixForTemplate(pageName);
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
  const segment = stripTitleSuffixForTemplate(title);
  const fullTitle = formatPageTitle(segment);
  return {
    /** Short segment only — root `metadata.title.template` appends the suffix once */
    title: segment,
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
