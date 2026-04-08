import Link from "next/link";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Button } from "@/components/ui/button";

export function CatalogConversionStrip() {
  return (
    <section className="border-y border-slate/60 bg-texture-navy-mid">
      <SectionContainer className="py-12 md:py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-h2 font-bold uppercase tracking-tight text-white">
            See something you want to customize?
          </h2>
          <p className="mt-4 text-body text-gray-soft">
            Tell us what you need. We&apos;ll handle the rest.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild variant="primary">
              <Link href="/request-a-quote">Start a Project</Link>
            </Button>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
