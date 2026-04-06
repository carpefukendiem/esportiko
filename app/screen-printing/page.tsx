import type { Metadata } from "next";
import Link from "next/link";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { CTABand } from "@/components/ui/CTABand";
import { ProcessStep } from "@/components/ui/ProcessStep";
import { Button } from "@/components/ui/button";
import { getFaqsByCategoryId } from "@/lib/data/faq";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Screen Printing",
    description:
      "Durable screen printing for team apparel, events, and business merch in Santa Barbara and the Central Coast. Request a quote for your next run.",
    path: "/screen-printing",
  });
}

const faqItems = getFaqsByCategoryId("screen-printing");

export default function ScreenPrintingPage() {
  return (
    <>
      <SectionContainer className="bg-texture-dark">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 font-display text-h1 font-bold uppercase tracking-tight text-white">
            Screen Printing Built for Real Wear
          </h1>
          <p className="mb-8 text-body text-gray-soft">
            Bold color, consistent coverage, and production discipline for team
            sets, school programs, fundraisers, and business merch across the
            Central Coast.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="primary">
              <Link href="/start-business-order">Start Business Order</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/request-a-quote">Request a Quote</Link>
            </Button>
          </div>
        </div>
      </SectionContainer>
      <SectionContainer className="bg-texture-navy-mid border-y border-slate/60">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 font-display text-h2 font-semibold text-white">
            What screen printing is — and when it wins
          </h2>
          <p className="mb-4 text-body text-gray-soft">
            Screen printing pushes ink through mesh screens to lay down solid,
            vibrant graphics on apparel and select accessories. It is the default
            choice for many team jerseys, event tees, and high-impact fronts on
            hoodies when you want color that reads from a distance.
          </p>
          <p className="text-body text-gray-soft">
            Ideal for larger runs, bold spot-color art, school spirit wear, and
            programs where repeat reordering is likely — we keep separations and
            production notes organized so the second run matches the first.
          </p>
        </div>
      </SectionContainer>
      <SectionContainer className="bg-texture-dark">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 font-display text-h2 font-semibold text-white">
            Quality you can trust in the wash cycle
          </h2>
          <p className="text-body text-gray-soft">
            We match ink systems and curing to the garment so prints stay
            flexible, not brittle. Follow care instructions, wash inside out on
            cool settings, and avoid aggressive heat on decorated areas. We will
            call out any fabric or art combination that needs a different
            approach before production.
          </p>
        </div>
      </SectionContainer>
      <SectionContainer className="bg-texture-navy-mid border-y border-slate/60">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-h2 font-semibold text-white">
            Garments we print most often
          </h2>
          <ul className="grid gap-3 text-body text-gray-soft sm:grid-cols-2">
            {[
              "Cotton and cotton-blend tees",
              "Fleece hoodies and crew sweats",
              "Jerseys and performance blends (art-dependent)",
              "Totes and select promo accessories",
            ].map((item) => (
              <li
                key={item}
                className="rounded-lg border border-slate bg-navy-light/50 px-4 py-3"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </SectionContainer>
      <SectionContainer className="bg-texture-dark">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 font-display text-h2 font-semibold text-white">
            How a typical project moves
          </h2>
          <div className="space-y-6">
            <ProcessStep
              step={1}
              title="Intake & garments"
              description="Share quantities, sizes, timeline, and art. We confirm garment direction."
            />
            <ProcessStep
              step={2}
              title="Art review"
              description="Separations, underbases, and color calls are finalized with your approval."
            />
            <ProcessStep
              step={3}
              title="Production"
              description="Controlled runs with registration checks through the stack."
            />
            <ProcessStep
              step={4}
              title="QC & delivery"
              description="Finished goods reviewed before pickup or coordinated delivery."
            />
          </div>
        </div>
      </SectionContainer>
      <SectionContainer className="bg-texture-navy-mid border-y border-slate/60">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-h2 font-semibold text-white">
            Screen printing FAQs
          </h2>
          <FAQAccordion items={faqItems} />
        </div>
      </SectionContainer>
      <CTABand
        primaryHref="/start-business-order"
        primaryLabel="Start Business Order"
        secondaryHref="/request-a-quote"
        secondaryLabel="Request a Quote"
      />
    </>
  );
}
