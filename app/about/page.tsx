import type { Metadata } from "next";
import Link from "next/link";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { CTABand } from "@/components/ui/CTABand";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "About",
    description:
      "Esportiko delivers premium custom apparel with organized team ordering and responsive service for Santa Barbara, Goleta, and the Central Coast.",
    path: "/about",
  });
}

export default function AboutPage() {
  return (
    <>
      <SectionContainer className="bg-texture-dark">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 font-display text-h1 font-bold uppercase tracking-tight text-white">
            Premium Custom Apparel for Teams and Businesses Across the Central
            Coast
          </h1>
          <p className="mb-10 text-body text-gray-soft">
            Esportiko exists to make decorated apparel feel intentional — not
            improvised. We work with coaches, administrators, business owners,
            and organizers who need clear communication, dependable production
            standards, and workflows that respect how real teams and companies
            actually order.
          </p>
          <h2 className="mb-4 font-display text-h2 font-semibold text-white">
            What we stand for
          </h2>
          <p className="mb-6 text-body text-gray-soft">
            Quality decoration that holds up to real wear. Organized intake that
            captures roster detail, garment intent, and deadlines up front.
            Responsive, direct support — no runaround. Garment guidance that
            matches how your brand or program shows up in public.
          </p>
          <h2 className="mb-4 font-display text-h2 font-semibold text-white">
            Service area
          </h2>
          <p className="mb-10 text-body text-gray-soft">
            We regularly support clients in Goleta, Santa Barbara, Isla Vista,
            Carpinteria, Ventura, and neighboring Central Coast communities. If
            you are nearby and unsure, reach out — we will confirm whether your
            timeline and scope are a fit.
          </p>
          <Button asChild variant="primary">
            <Link href="/request-a-quote">Start Your Project</Link>
          </Button>
        </div>
      </SectionContainer>
      <CTABand />
    </>
  );
}
