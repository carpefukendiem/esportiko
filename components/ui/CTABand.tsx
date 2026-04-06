import Link from "next/link";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Button } from "@/components/ui/button";

export function CTABand({
  headline = "Let's Build Your Next Apparel Order",
  primaryHref = "/request-a-quote",
  primaryLabel = "Start Your Project",
  secondaryHref = "/request-a-quote",
  secondaryLabel = "Request a Quote",
}: {
  headline?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="border-y border-blue-muted/40 bg-blue-muted/25 bg-texture-dark py-16 md:py-20">
      <SectionContainer as="div" className="py-0 md:py-0">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-h2 font-semibold uppercase tracking-tight text-white">
            {headline}
          </h2>
          <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center sm:justify-center">
            <Button asChild variant="primary" width="full" className="sm:w-auto">
              <Link href={primaryHref}>{primaryLabel}</Link>
            </Button>
            <Button asChild variant="secondary" width="full" className="sm:w-auto">
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
