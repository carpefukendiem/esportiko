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
    <article className="group relative grid min-h-[280px] overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-[0_24px_60px_-15px_rgba(18,24,38,0.18)] md:min-h-[320px] md:grid-cols-[1fr_minmax(200px,42%)]">
      <div className="relative z-10 order-2 flex flex-col justify-center px-6 py-8 md:order-1 md:px-10 md:py-10">
        <span
          className="mb-4 h-1 w-10 rounded-full bg-blue-accent"
          aria-hidden
        />
        <h3 className="mb-3 font-display text-2xl font-bold tracking-tight text-navy md:text-[1.65rem]">
          {title}
        </h3>
        <p className="mb-7 max-w-md text-body text-gray-muted">{description}</p>
        <Button
          asChild
          variant="primary"
          className="w-full focus-visible:ring-offset-white sm:w-auto"
        >
          <Link href={href}>{ctaLabel}</Link>
        </Button>
      </div>
      <div className="relative order-1 min-h-[200px] md:order-2 md:min-h-full">
        <Image
          src={decorativeSrc}
          alt={decorativeAlt}
          fill
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 38vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-white via-white/75 to-white/30 md:bg-gradient-to-r md:from-white md:via-white/50 md:to-transparent"
          aria-hidden
        />
      </div>
    </article>
  );
}
