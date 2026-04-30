import type { Metadata } from "next";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { ContactForm } from "@/components/forms/ContactForm";
import { CTABand } from "@/components/ui/CTABand";
import { buildMetadata } from "@/lib/seo";
import { sitePhone } from "@/lib/data/site";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Contact",
    description:
      "Contact Esportiko for custom screen printing, embroidery, and team apparel — built in Goleta, serving Santa Barbara and the Central Coast.",
    path: "/contact",
  });
}

export default function ContactPage() {
  return (
    <>
      <SectionContainer className="bg-texture-dark">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h1 className="mb-4 font-display text-h1 font-bold uppercase tracking-tight text-white">
              Contact
            </h1>
            <p className="mb-8 text-body text-on-dark-muted">
              Share project context and we will respond with next steps. For
              roster-heavy programs, the team order form often moves faster.
            </p>
            <ContactForm />
          </div>
          <div className="space-y-8">
            <div className="rounded-xl border border-slate bg-navy-mid p-6">
              <h2 className="mb-4 font-display text-lg font-semibold text-white">
                Studio & service area
              </h2>
              <p className="text-body-sm text-gray-soft">
                Based in Goleta, serving Santa Barbara, Isla Vista, Carpinteria, Ventura,
                and surrounding Central Coast communities.
              </p>
            </div>
            <div className="rounded-xl border border-slate bg-navy-mid p-6">
              <h2 className="mb-4 font-display text-lg font-semibold text-white">
                Direct lines
              </h2>
              <p className="mb-2 text-body-sm">
                <a
                  href={sitePhone.telHref}
                  className="text-blue-accent hover:text-blue-light hover:underline"
                >
                  {sitePhone.display}
                </a>
              </p>
              <p className="text-body-sm">
                <a
                  href="mailto:hello@esportikosb.com"
                  className="text-blue-accent hover:text-blue-light hover:underline"
                >
                  hello@esportikosb.com
                </a>
              </p>
            </div>
            <div className="rounded-xl border border-slate bg-navy-mid p-6">
              <h2 className="mb-4 font-display text-lg font-semibold text-white">
                Hours
              </h2>
              <p className="text-body-sm text-gray-soft">
                Monday–Friday, 9:00 a.m.–5:00 p.m. PT (by appointment).
              </p>
            </div>
            <div
              className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-slate bg-navy-light/40 p-6 text-center text-body-sm text-gray-soft"
              role="region"
              aria-label="Map placeholder"
            >
              Map embed coming soon — use the form or call for directions.
            </div>
          </div>
        </div>
      </SectionContainer>
      <CTABand
        headline="Ready for a structured quote instead?"
        primaryHref="/request-a-quote"
        primaryLabel="Request a Quote"
        secondaryHref="/start-team-order"
        secondaryLabel="Start Team Order"
      />
    </>
  );
}
