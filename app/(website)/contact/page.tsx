import type { Metadata } from "next";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { ContactForm } from "@/components/forms/ContactForm";
import { CTABand } from "@/components/ui/CTABand";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { buildMetadata } from "@/lib/seo";
import { sitePhone } from "@/lib/data/site";

/*
 * SECTION RHYTHM:
 * 1. Hero (compact) — DARK (bg-texture-dark)
 * 2. Form + aside    — LIGHT (white + noise) / form crisp white; cards mid navy on right
 * 3. CTA band        — DARK
 */
export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Contact",
    description:
      "Contact Esportiko for custom screen printing, embroidery, and team apparel in Santa Barbara, Goleta, and the Central Coast.",
    path: "/contact",
  });
}

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-slate/60 bg-texture-dark py-10 md:py-14">
        <SectionContainer>
          <h1 className="mb-3 font-display text-h1 font-bold uppercase tracking-tight text-white">
            Contact
          </h1>
          <p className="max-w-2xl text-body leading-relaxed text-gray-soft">
            Share project context and we will respond with next steps. For
            roster-heavy programs, the team order form often moves faster.
          </p>
        </SectionContainer>
      </section>

      <section className="relative overflow-hidden border-b border-navy/10 bg-white">
        <NoiseOverlay opacity={0.03} />
        <SectionContainer className="relative z-10 py-12 md:py-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <ContactForm tone="light" />
            </div>
            <div className="space-y-8">
              <div className="rounded-xl border border-slate bg-navy-mid p-6">
                <h2 className="mb-4 font-display text-lg font-semibold text-white">
                  Studio & service area
                </h2>
                <p className="text-body-sm leading-relaxed text-gray-soft">
                  Based in the Goleta / Santa Barbara area, serving Isla Vista,
                  Carpinteria, Ventura, and surrounding Central Coast communities.
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
                <p className="text-body-sm leading-relaxed text-gray-soft">
                  Monday–Friday, 9:00 a.m.–5:00 p.m. PT (by appointment).
                </p>
              </div>
              <div
                className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-slate bg-navy-light/40 p-6 text-center text-body-sm leading-relaxed text-gray-soft"
                role="region"
                aria-label="Map placeholder"
              >
                Map embed coming soon — use the form or call for directions.
              </div>
            </div>
          </div>
        </SectionContainer>
      </section>

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
