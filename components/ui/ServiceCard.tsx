import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/lib/data/services";

export function ServiceCard({ service }: { service: Service }) {
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
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 font-display text-xl font-semibold text-white">
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
