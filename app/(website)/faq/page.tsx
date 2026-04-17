import type { Metadata } from "next";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { faqCategories } from "@/lib/data/faq";
import { buildMetadata } from "@/lib/seo";

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

export default function FaqPage() {
  const defaultTab = faqCategories[0]?.id ?? "general";

  return (
    <>
      <SectionContainer className="bg-texture-dark">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h1 className="mb-4 font-display text-h1 font-bold uppercase tracking-tight text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-body text-gray-soft">
            Practical answers for coaches, business owners, and event organizers
            planning custom apparel.
          </p>
        </div>
        <div className="mx-auto max-w-3xl">
          <Tabs defaultValue={defaultTab} className="w-full">
            <div className="overflow-x-auto pb-2">
              <TabsList className="inline-flex h-auto min-h-11 w-max max-w-full flex-wrap justify-start gap-1">
                {faqCategories.map((cat) => (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id}
                    className="min-h-11 whitespace-normal px-3 text-left text-body-sm sm:px-4"
                  >
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            {faqCategories.map((cat) => (
              <TabsContent key={cat.id} value={cat.id} className="mt-8">
                <FAQAccordion items={cat.items} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </SectionContainer>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageJsonLd),
        }}
      />
    </>
  );
}
