import type { Metadata } from "next";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { ServiceHero } from "@/components/ui/ServiceHero";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { faqCategories } from "@/lib/data/faq";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils/cn";

/*
 * SECTION RHYTHM:
 * 1. Hero (compact)   — DARK (ServiceHero)
 * 2. FAQ accordion   — LIGHT white + noise (readability)
 */
export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "FAQ",
    description:
      "Answers on team orders, screen printing, embroidery, artwork files, turnaround, and pricing for custom apparel buyers on the Central Coast.",
    path: "/faq",
  });
}

const faqPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqCategories.flatMap((cat) =>
    cat.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    }))
  ),
};

const tabsListLight =
  "inline-flex h-auto min-h-11 w-max max-w-full flex-wrap justify-start gap-1 rounded-lg border border-navy/15 bg-slate-100 p-1 text-slate-700";

const tabsTriggerLight =
  "min-h-11 whitespace-normal px-3 text-left text-body-sm focus-visible:ring-offset-white data-[state=active]:bg-navy data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-slate-600 sm:px-4";

export default function FaqPage() {
  const defaultTab = faqCategories[0]?.id ?? "general";

  return (
    <>
      <ServiceHero
        backgroundImage="/images/faq-bg.png"
        heading="Frequently Asked Questions"
        subheading="Practical answers for coaches, business owners, and event organizers planning custom apparel."
      />
      <section className="relative overflow-hidden border-y border-navy/10 bg-white">
        <NoiseOverlay opacity={0.03} />
        <SectionContainer className="relative z-10">
          <div className="mx-auto max-w-3xl">
            <Tabs defaultValue={defaultTab} className="w-full">
              <div className="overflow-x-auto pb-2">
                <TabsList className={cn(tabsListLight)}>
                  {faqCategories.map((cat) => (
                    <TabsTrigger
                      key={cat.id}
                      value={cat.id}
                      className={cn(tabsTriggerLight)}
                    >
                      {cat.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              {faqCategories.map((cat) => (
                <TabsContent key={cat.id} value={cat.id} className="mt-8">
                  <FAQAccordion items={cat.items} tone="light" />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </SectionContainer>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageJsonLd),
        }}
      />
    </>
  );
}
