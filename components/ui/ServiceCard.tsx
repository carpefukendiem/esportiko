import Link from "next/link";
import { ArrowUpRight, Printer, Shirt, Users, Briefcase } from "lucide-react";
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
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-navy-light/80 via-navy/70 to-navy-mid/80 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-light/40 hover:shadow-[0_24px_60px_-20px_rgba(30,64,175,0.5)]">
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-accent/15 blur-2xl transition-opacity duration-500 group-hover:bg-blue-accent/25"
        aria-hidden
      />
      <div className="relative z-10 mb-5 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-blue-accent/20 text-blue-light shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      </div>
      <h3 className="relative z-10 mb-3 font-display text-xl font-bold text-white">
        {service.name}
      </h3>
      <p className="relative z-10 mb-6 flex-1 text-body-sm leading-relaxed text-off-white/70">
        {service.shortDescription}
      </p>
      <Link
        href={service.ctaHref}
        className="relative z-10 inline-flex items-center gap-1.5 font-sans text-cta font-semibold text-blue-light transition-colors hover:text-white"
      >
        {service.ctaLabel}
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
      </Link>
    </article>
  );
}
