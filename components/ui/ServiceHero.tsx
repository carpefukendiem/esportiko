import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ServiceHero({
  backgroundImage,
  heading,
  subheading,
  ctaLabel,
  ctaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  overlayClassName,
}: {
  backgroundImage: string;
  heading: string;
  subheading: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  /** Tailwind gradient or bg-* classes only (layer also has absolute inset-0 z-[1]). */
  overlayClassName?: string;
}) {
  const overlayTint =
    overlayClassName ??
    "bg-gradient-to-b from-[#0F1521]/80 via-[#0F1521]/60 to-[#0F1521]/40";
  return (
    <section className="relative isolate min-h-[min(380px,88vw)] w-full overflow-hidden md:min-h-[440px] lg:min-h-[520px]">
      <Image
        src={backgroundImage}
        alt=""
        fill
        priority
        className="absolute inset-0 z-0 h-full w-full object-cover"
        sizes="100vw"
        aria-hidden
      />
      <div
        className={`absolute inset-0 z-[1] ${overlayTint}`}
        aria-hidden
      />
      <div className="relative z-10 mx-auto flex min-h-[min(380px,88vw)] w-full max-w-content flex-col items-center justify-center px-6 py-16 text-center md:min-h-[440px] md:px-8 md:py-20 lg:min-h-[520px] lg:px-8">
        <h1 className="mb-4 max-w-3xl font-display text-h1 font-bold uppercase tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.85)]">
          {heading}
        </h1>
        <p className="mb-8 max-w-2xl text-body text-off-white drop-shadow-[0_1px_12px_rgba(0,0,0,0.9)]">
          {subheading}
        </p>
        {secondaryCtaLabel && secondaryCtaHref ? (
          <div className="flex w-full max-w-md flex-col gap-3 sm:mx-auto sm:max-w-none sm:flex-row sm:justify-center">
            <Button asChild variant="primary" className="w-full sm:w-auto">
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full sm:w-auto">
              <Link href={secondaryCtaHref}>{secondaryCtaLabel}</Link>
            </Button>
          </div>
        ) : (
          <Button asChild variant="primary" className="mx-auto">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        )}
      </div>
    </section>
  );
}
