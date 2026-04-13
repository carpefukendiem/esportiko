import type { Metadata } from "next";
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
      <div className="relative min-h-screen">
        <div
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: "url('/images/faq-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          }}
          aria-hidden
        />
        <div className="fixed inset-0 z-0 bg-navy/80" aria-hidden />
        <div className="fixed inset-0 z-0 bg-black/20" aria-hidden />

        <div className="relative z-10 pt-16 md:pt-20">
          <div className="mx-auto max-w-content px-6 py-14 md:px-8 md:py-20 lg:px-12">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="mb-4 inline-block rounded-full border border-slate bg-navy-light px-3 py-1 font-sans text-label font-semibold uppercase tracking-wider text-gray-soft">
                Quick answers
              </p>
              <h1 className="font-display text-h2 font-semibold uppercase tracking-tight text-white">
                Frequently Asked Questions
              </h1>
              <p className="mt-4 text-body text-gray-soft">
                Everything you need to know about ordering custom apparel with
                Esportiko.
              </p>
            </div>

            <div className="mx-auto max-w-3xl">
              <Tabs defaultValue={defaultTab} className="w-full">
                <div className="overflow-x-auto pb-2">
                  <TabsList className="inline-flex h-auto min-h-11 w-max max-w-full flex-wrap justify-start gap-1 bg-navy/60 backdrop-blur-sm">
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
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageJsonLd),
        }}
      />
    </>
  );
}
