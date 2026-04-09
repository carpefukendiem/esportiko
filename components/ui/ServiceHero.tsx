import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ServiceHero({
  backgroundImage,
  heading,
  subheading,
  ctaLabel,
  ctaHref,
}: {
  backgroundImage: string;
  heading: string;
  subheading: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <section className="relative min-h-[min(380px,88vw)] w-full md:min-h-[440px] lg:min-h-[480px]">
      <Image
        src={backgroundImage}
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/60" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/55"
        aria-hidden
      />
      <div className="relative z-10 mx-auto flex min-h-[min(380px,88vw)] w-full max-w-content flex-col items-center justify-center px-6 py-16 text-center md:min-h-[440px] md:px-8 md:py-20 lg:min-h-[480px] lg:px-8">
        <h1 className="mb-4 max-w-3xl font-display text-h1 font-bold uppercase tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.85)]">
          {heading}
        </h1>
        <p className="mb-8 max-w-2xl text-body text-off-white drop-shadow-[0_1px_12px_rgba(0,0,0,0.9)]">
          {subheading}
        </p>
        <Button asChild variant="primary" className="mx-auto">
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      </div>
    </section>
  );
}
