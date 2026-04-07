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
  decorativeSrc?: string;
  decorativeAlt?: string;
}) {
  return (
    <article className="group relative min-h-[300px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-navy-light via-navy to-navy-mid shadow-[0_30px_70px_-20px_rgba(8,12,24,0.55)] md:min-h-[320px]">
      {/* Blue glow */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-accent/25 blur-3xl transition-opacity duration-500 group-hover:opacity-90"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 55%)",
        }}
        aria-hidden
      />

      {/* Decorative apparel image — bleeds off the right edge */}
      {decorativeSrc ? (
        <div className="pointer-events-none absolute right-[-4%] top-1/2 z-[1] h-[115%] w-[58%] -translate-y-1/2 md:right-[-2%] md:w-[52%]">
          <Image
            src={decorativeSrc}
            alt={decorativeAlt ?? ""}
            fill
            sizes="(max-width: 768px) 60vw, 300px"
            className="object-contain object-right drop-shadow-[0_25px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        </div>
      ) : null}

      {/* Text + CTA column (left ~55%) */}
      <div className="relative z-10 flex flex-col justify-center px-7 py-9 md:max-w-[55%] md:px-10 md:py-11">
        <span className="mb-5 block h-1 w-12 rounded-full bg-blue-light" aria-hidden />
        <h3 className="mb-3 font-display text-2xl font-bold tracking-tight text-white md:text-[1.7rem]">
          {title}
        </h3>
        <p className="mb-7 text-body text-off-white/75">{description}</p>
        <Button asChild variant="primary" className="w-full sm:w-auto">
          <Link href={href}>{ctaLabel}</Link>
        </Button>
      </div>
    </article>
  );
}
