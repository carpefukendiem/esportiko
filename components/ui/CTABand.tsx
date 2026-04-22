import Link from "next/link";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Button } from "@/components/ui/button";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { cn } from "@/lib/utils/cn";

export function CTABand({
  headline = "Let's Build Your Next Apparel Order",
  primaryHref = "/request-a-quote",
  primaryLabel = "Start Your Project",
  secondaryHref = "/request-a-quote",
  secondaryLabel = "Request a Quote",
  /** `light` — warm gradient + noise; navy CTAs (home final band). `dark` — existing textured band. */
  variant = "dark",
}: {
  headline?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  variant?: "dark" | "light";
}) {
  if (variant === "light") {
    return (
      <section className="relative overflow-hidden border-y border-navy/10 py-16 pb-24 md:py-20 md:pb-24">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-white to-[#eef1f6]" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,255,255,0.55),transparent_50%)]"
          aria-hidden
        />
        <NoiseOverlay opacity={0.04} />
        <SectionContainer as="div" className="relative z-10 py-0 md:py-0">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 font-display text-h2 font-semibold uppercase tracking-tight text-navy">
              {headline}
            </h2>
            <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center sm:justify-center">
              <Button asChild variant="navy" width="full" className="sm:w-auto focus-visible:ring-offset-white">
                <Link href={primaryHref}>{primaryLabel}</Link>
              </Button>
              <Button
                asChild
                variant="navyOutline"
                width="full"
                className="sm:w-auto focus-visible:ring-offset-white"
              >
                <Link href={secondaryHref}>{secondaryLabel}</Link>
              </Button>
            </div>
          </div>
        </SectionContainer>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "border-y border-blue-muted/40 bg-blue-muted/25 bg-texture-dark py-16 pb-24 md:py-20 md:pb-24"
      )}
    >
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
