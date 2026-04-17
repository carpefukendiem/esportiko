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
      <CTABand />
    </>
  );
}
