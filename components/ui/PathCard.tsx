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
    <article className="relative overflow-hidden rounded-xl border border-slate bg-navy-light/90 pl-6 pr-4 pt-8 pb-8 md:pl-8">
      <div
        className="absolute left-0 top-0 h-full w-1 bg-blue-accent"
        aria-hidden
      />
      <div className="relative z-10 max-w-[85%] md:max-w-[70%]">
        <h3 className="mb-3 font-display text-2xl font-semibold text-white">
          {title}
        </h3>
        <p className="mb-6 text-body text-gray-soft">{description}</p>
        <Button asChild variant="primary">
          <Link href={href}>{ctaLabel}</Link>
        </Button>
      </div>
      <div className="pointer-events-none absolute -bottom-6 -right-4 h-48 w-40 opacity-[0.38] md:h-56 md:w-48">
        <Image
          src={decorativeSrc}
          alt={decorativeAlt}
          fill
          className="object-contain object-bottom"
          sizes="200px"
        />
      </div>
    </article>
  );
}
