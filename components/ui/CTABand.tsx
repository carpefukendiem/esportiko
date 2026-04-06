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
    <section className="relative overflow-hidden border-y border-white/10 bg-blue-accent py-16 md:py-20">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(255,255,255,0.18),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12] geometric-bg"
        aria-hidden
      />
      <SectionContainer as="div" className="relative py-0 md:py-0">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-h2 font-bold uppercase tracking-tight text-white drop-shadow-sm">
            {headline}
          </h2>
          <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center sm:justify-center">
            <Button
              asChild
              variant="secondary"
              width="full"
              className="sm:w-auto border-white bg-white text-navy hover:bg-off-white hover:text-navy"
            >
              <Link href={primaryHref}>{primaryLabel}</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              width="full"
              className="sm:w-auto border-white/90 bg-transparent text-white hover:bg-white/10"
            >
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
