import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function PathCard({
  title,
  description,
  href,
  ctaLabel,
  decorativeSrc,
  decorativeAlt,
}: {
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  decorativeSrc: string;
  decorativeAlt: string;
}) {
  return (
    <article className="group grid min-h-[300px] overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-[0_24px_60px_-20px_rgba(18,24,38,0.18)] transition-shadow duration-300 hover:shadow-[0_28px_70px_-18px_rgba(18,24,38,0.22)] md:min-h-[min(440px,54vw)] md:grid-cols-[minmax(0,1fr)_minmax(280px,54%)] lg:min-h-[min(480px,48vh)]">
      <div className="relative z-10 order-2 flex flex-col justify-center px-6 py-8 md:order-1 md:px-8 md:py-10 lg:px-10">
        <span
          className="mb-4 block h-1 w-11 rounded-full bg-blue-accent"
          aria-hidden
        />
          <h3 className="font-display text-2xl font-bold tracking-tight text-on-light-strong md:text-[1.65rem]">
          {title}
        </h3>
        <p className="mt-3 text-body text-on-light-muted">{description}</p>
        <Button
          asChild
          variant="primary"
          className="mt-7 w-full focus-visible:ring-offset-white sm:w-auto"
        >
          <Link href={href}>{ctaLabel}</Link>
        </Button>
      </div>
      <div className="relative order-1 min-h-[220px] md:order-2 md:min-h-0">
        <Image
          src={decorativeSrc}
          alt={decorativeAlt}
          fill
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={false}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/85 via-white/35 to-transparent md:bg-gradient-to-r md:from-white md:via-white/45 md:to-transparent"
          aria-hidden
        />
      </div>
    </article>
  );
}
