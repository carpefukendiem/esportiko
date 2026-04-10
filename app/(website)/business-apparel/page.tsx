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
    title: "Business Apparel",
    description:
      "Branded staff uniforms, restaurant apparel, event merch, and company swag with screen print or embroidery for Central Coast businesses.",
    path: "/business-apparel",
  });
}

const faqItems = [
  ...getFaqsByCategoryId("general").slice(0, 2),
  ...getFaqsByCategoryId("minimums-pricing").slice(0, 2),
  ...getFaqsByCategoryId("artwork-files").slice(0, 2),
];

export default function BusinessApparelPage() {
  return (
    <>
      <SectionContainer className="bg-texture-dark">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 font-display text-h1 font-bold uppercase tracking-tight text-white">
            Your Brand, On the Right Garment.
          </h1>
          <p className="mb-8 text-body text-gray-soft">
            From front-of-house uniforms to launch merch, we align decoration
            method, garment selection, and quantity so your team looks cohesive
            in the wild.
          </p>
          <Button asChild variant="primary">
            <Link href="/start-business-order">Start Business Order</Link>
          </Button>
        </div>
      </SectionContainer>
      <SectionContainer className="bg-texture-navy-mid border-y border-slate/60">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-h2 font-semibold text-white">
            Who we outfit
          </h2>
          <ul className="grid gap-3 text-body text-gray-soft sm:grid-cols-2">
            {[
              "Business owners refreshing staff uniforms",
              "Restaurant and hospitality teams",
              "Event organizers needing dated merch",
              "Nonprofits running fundraisers",
              "School departments and admin staff",
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
          <h2 className="mb-4 font-display text-h2 font-semibold text-white">
            Screen printing vs embroidery
          </h2>
          <p className="mb-4 text-body text-gray-soft">
            <span className="font-semibold text-off-white">Screen printing</span>{" "}
            shines on event tees, promo runs, and bold graphics where color
            impact matters.{" "}
            <span className="font-semibold text-off-white">Embroidery</span>{" "}
            elevates polos, structured hats, and outerwear where you want a
            premium, tactile finish.
          </p>
          <p className="text-body text-gray-soft">
            Not sure? Tell us how the pieces will be worn — we will recommend a
            direction before quoting.
          </p>
        </div>
      </SectionContainer>
      <SectionContainer className="bg-texture-navy-mid border-y border-slate/60">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-h2 font-semibold text-white">
            Garment types
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              "Polos",
              "Tees",
              "Hoodies",
              "Hats",
              "Jackets",
              "Aprons",
              "Vests",
            ].map((g) => (
              <span
                key={g}
                className="rounded-full border border-slate bg-navy-light px-3 py-1 font-sans text-body-sm text-off-white"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      </SectionContainer>
      <SectionContainer className="bg-texture-dark">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 font-display text-h2 font-semibold text-white">
            Project examples
          </h2>
          <ul className="space-y-3 text-body text-gray-soft">
            {[
              "Staff uniforms with role color cues",
              "Event merch tied to ticket packages",
              "Company swag for onboarding kits",
              "Nonprofit fundraiser apparel with sponsor locks",
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
      <SectionContainer className="bg-texture-navy-mid border-y border-slate/60">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 font-display text-h2 font-semibold text-white">
            How we onboard business programs
          </h2>
          <div className="space-y-6">
            <ProcessStep
              step={1}
              title="Scope & garments"
              description="Quantities, wear context, and budget guardrails."
            />
            <ProcessStep
              step={2}
              title="Decoration plan"
              description="Screen print, embroidery, or hybrid — with placement clarity."
            />
            <ProcessStep
              step={3}
              title="Art & proofing"
              description="Vector review, color alignment, and approvals documented."
            />
            <ProcessStep
              step={4}
              title="Production & delivery"
              description="QC, packouts, and scheduled handoff."
            />
          </div>
        </div>
      </SectionContainer>
      <SectionContainer className="bg-texture-dark">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-h2 font-semibold text-white">
            FAQs
          </h2>
          <FAQAccordion items={faqItems} />
        </div>
      </SectionContainer>
      <CTABand />
    </>
  );
}
