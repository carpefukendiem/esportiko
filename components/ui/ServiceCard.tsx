import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Printer, Shirt, Users, Briefcase } from "lucide-react";
import type { Service } from "@/lib/data/services";

const icons = {
  print: Printer,
  needle: Shirt,
  users: Users,
  briefcase: Briefcase,
} as const;

export function ServiceCard({ service }: { service: Service }) {
  const Icon = icons[service.icon];
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-navy-light/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-light/40 hover:shadow-[0_24px_60px_-20px_rgba(30,64,175,0.5)]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-navy">
        <Image
          src={service.image}
          alt={`${service.name} custom apparel example`}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 25vw"
          loading="lazy"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/15 to-transparent"
          aria-hidden
        />
        <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-blue-accent text-white shadow-lg ring-2 ring-white/25">
          <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden />
        </div>
        <div className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-navy/85 text-blue-light">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 font-display text-xl font-bold text-white">
          {service.name}
        </h3>
        <p className="mb-5 flex-1 text-body-sm leading-relaxed text-off-white/70">
          {service.shortDescription}
        </p>
        <Link
          href={service.ctaHref}
          className="inline-flex items-center gap-1.5 font-sans text-cta font-semibold text-blue-light transition-colors hover:text-white"
        >
          {service.ctaLabel}
          <ArrowUpRight
            className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </article>
  );
}
