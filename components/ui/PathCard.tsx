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
    <article className="group relative grid min-h-[300px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-navy-light via-navy to-navy-mid shadow-[0_30px_70px_-20px_rgba(8,12,24,0.55)] md:min-h-[340px] md:grid-cols-[1.1fr_minmax(220px,44%)]">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-accent/20 blur-3xl transition-opacity duration-500 group-hover:opacity-90"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 order-2 flex flex-col justify-center px-6 py-8 md:order-1 md:px-10 md:py-10">
        <span className="mb-5 block h-1 w-12 rounded-full bg-blue-light" aria-hidden />
        <h3 className="mb-4 font-display text-2xl font-bold tracking-tight text-white md:text-[1.7rem]">
          {title}
        </h3>
        <p className="mb-8 max-w-md text-body text-off-white/75">{description}</p>
        <Button asChild variant="primary" className="w-full sm:w-auto">
          <Link href={href}>{ctaLabel}</Link>
        </Button>
      </div>

      {decorativeSrc ? (
        <div className="relative order-1 min-h-[220px] md:order-2 md:min-h-full">
          <Image
            src={decorativeSrc}
            alt={decorativeAlt ?? ""}
            fill
            className="object-contain object-center p-6 transition-transform duration-500 ease-out group-hover:scale-[1.05] md:p-8"
            sizes="(max-width: 768px) 100vw, 44vw"
          />
        </div>
      ) : null}
    </article>
  );
}
