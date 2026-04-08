import type { Metadata } from "next";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { CTABand } from "@/components/ui/CTABand";
import { ProcessStep } from "@/components/ui/ProcessStep";
import { ServiceHero } from "@/components/ui/ServiceHero";
import { ServiceTwoCol } from "@/components/ui/ServiceTwoCol";
import { getFaqsByCategoryId } from "@/lib/data/faq";
import { media } from "@/lib/data/media";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Embroidery",
    description:
      "Professional embroidery for hats, polos, jackets, and staff uniforms in Santa Barbara and the Central Coast. Elevated brand presence, stitch by stitch.",
    path: "/embroidery",
  });
}

const faqItems = getFaqsByCategoryId("embroidery");

export default function EmbroideryPage() {
  return (
    <>
      <ServiceHero
        backgroundImage="/images/embroidery-bg1.png"
        heading="Embroidery That Reads Premium Up Close"
        subheading="Dimensional thread work for restaurants, professional services, team sideline gear, and any brand that needs tactile authority on polos, structured caps, and outerwear."
        ctaLabel="Get A Free Quote"
        ctaHref="/request-a-quote"
      />
      <SectionContainer className="border-y border-slate/60 bg-texture-navy-mid">
        <ServiceTwoCol
          heading="When embroidery is the right call"
          image={media.services.embroidery}
          imageAlt="Professional embroidery on hats and apparel for Santa Barbara businesses and teams"
        >
          <p className="mb-4 text-body text-gray-soft">
            Embroidery excels on structured hats, polos, woven shirts, fleece,
            and jackets where you want a refined, permanent mark. It carries
            perceived value on staff uniforms and client-facing apparel.
          </p>
          <p className="text-body text-gray-soft">
            Businesses, restaurants, private schools, and teams seeking an
            elevated sideline look choose embroidery for marks that need to stay
            crisp through daily wear.
          </p>
        </ServiceTwoCol>
      </SectionContainer>
      <SectionContainer className="bg-texture-dark">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-h2 font-semibold text-white">
            Placement examples
          </h2>
          <ul className="space-y-3 text-body text-gray-soft">
            {[
              "Left chest on polos and woven shirts",
              "Cap front panels and sideline hats",
              "Sleeve hits for secondary branding",
              "Back yoke or upper back on jackets",
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
      <SectionContainer className="border-y border-slate/60 bg-texture-navy-mid">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 font-display text-h2 font-semibold text-white">
            Process overview
          </h2>
          <div className="space-y-6">
            <ProcessStep
              step={1}
              title="Digitizing review"
              description="Vector or high-resolution art is mapped to stitch paths with density matched to fabric."
            />
            <ProcessStep
              step={2}
              title="Sew-out proofing"
              description="When programs require it, we align on thread colors and scale before full production."
            />
            <ProcessStep
              step={3}
              title="Hooping & production"
              description="Backing and tension tuned per garment for clean registration and comfortable wear."
            />
            <ProcessStep
              step={4}
              title="Trim & QC"
              description="Loose threads trimmed, marks inspected, and packs prepared for delivery."
            />
          </div>
        </div>
      </SectionContainer>
      <SectionContainer className="bg-texture-dark">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-h2 font-semibold text-white">
            Embroidery FAQs
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
