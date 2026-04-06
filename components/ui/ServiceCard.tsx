import Image from "next/image";
import Link from "next/link";
import { Check, Printer, Shirt, Users, Briefcase } from "lucide-react";
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
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate bg-navy-light/80">
      <div className="relative aspect-[4/3] w-full bg-navy">
        <Image
          src={service.image}
          alt={`${service.name} custom apparel example for Santa Barbara area clients`}
          fill
          className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
          sizes="(max-width: 768px) 100vw, 25vw"
          loading="lazy"
        />
        <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-blue-accent text-white shadow-lg ring-2 ring-white/25">
          <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden />
        </div>
        <div className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-lg bg-navy/85 text-blue-light ring-1 ring-white/15">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 font-display text-xl font-bold text-white">
          {service.name}
        </h3>
        <p className="mb-6 flex-1 text-body-sm text-gray-soft">
          {service.shortDescription}
        </p>
        <Link
          href={service.ctaHref}
          className="font-sans text-cta font-semibold text-blue-accent transition-colors hover:text-blue-light hover:underline"
        >
          {service.ctaLabel}
        </Link>
      </div>
    </article>
  );
}
