import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { CTABand } from "@/components/ui/CTABand";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "About",
    description:
      "Esportiko is a local custom apparel shop in Goleta and Santa Barbara serving teams and businesses on the Central Coast.",
    path: "/about",
  });
}

const services = [
  "Screen printing",
  "Embroidery",
  "Team uniforms",
  "Spirit wear",
  "Branded apparel",
];

export default function AboutPage() {
  return (
    <>
      <SectionContainer className="bg-texture-dark">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 font-display text-h1 font-bold uppercase tracking-tight text-white">
            Built for teams and businesses on the Central Coast
          </h1>
          <p className="mb-10 text-body text-gray-soft">
            Esportiko is a local custom apparel shop based in Goleta and Santa Barbara. We
            partner with schools, teams, and businesses to deliver decorated apparel that
            looks sharp and holds up in the real world — from uniforms and spirit wear to
            branded merch for your company or event.
          </p>
          <h2 className="mb-4 font-display text-h2 font-semibold text-white">What we offer</h2>
          <ul className="mb-10 list-disc space-y-2 pl-6 text-body text-gray-soft">
            {services.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <Button asChild variant="primary">
            <Link href="/request-a-quote">Start a project</Link>
          </Button>
        </div>
      </SectionContainer>

      <section className="relative min-h-[70vh] overflow-hidden bg-navy md:min-h-[80vh]">
        {/* Background image — full bleed, full coverage */}
        <Image
          src="/images/about/expert-screenprint-techs.webp"
          alt="Esportiko&apos;s local screen printing team at work in our Santa Barbara shop"
          fill
          sizes="100vw"
          quality={85}
          priority
          className="object-cover object-center"
        />

        {/* Layered overlays for text legibility */}
        {/* Base darkening — universal contrast floor */}
        <div className="absolute inset-0 bg-navy/40" aria-hidden />

        {/* Directional gradient — heavier on left where text sits */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/55 to-navy/20 md:from-navy/80 md:via-navy/40 md:to-transparent"
          aria-hidden
        />

        {/* Subtle vignette at bottom to ground the section into the next */}
        <div
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-navy to-transparent"
          aria-hidden
        />

        {/* Content — properly contained, vertically centered, left-aligned */}
        <div className="relative flex min-h-[70vh] items-center md:min-h-[80vh]">
          <div className="container">
            <div className="max-w-xl">
              <p className="mb-4 font-display text-sm uppercase tracking-[0.2em] text-blue-light">
                Built in Santa Barbara
              </p>
              <h2 className="mb-6 font-display text-h2 font-semibold uppercase tracking-tight text-white drop-shadow-lg">
                Hands-on craft. Every order.
              </h2>
              <p className="text-lg leading-relaxed text-slate-100 drop-shadow">
                Every shirt that leaves our shop has been touched by a real person who cares
                how it turned out. We&apos;re a local team that treats screen printing as a
                craft — not a checkbox — and our customers feel the difference.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
