import type { Metadata } from "next";
import Link from "next/link";
import { Shirt, Briefcase, MessageCircle } from "lucide-react";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Request a Quote",
    description:
      "Choose team uniforms, business apparel, or a general inquiry to start your custom quote with Esportiko on the Central Coast.",
    path: "/request-a-quote",
  });
}

const cards = [
  {
    title: "Team / Uniform Order",
    description:
      "Roster-aware programs with names, numbers, and organized garment packages.",
    href: "/start-team-order",
    cta: "Start Team Order",
    icon: Shirt,
  },
  {
    title: "Business / Brand Order",
    description:
      "Staff uniforms, event merch, and branded apparel with clear project intake.",
    href: "/start-business-order",
    cta: "Start Business Order",
    icon: Briefcase,
  },
  {
    title: "Not Sure Yet / General Inquiry",
    description:
      "Tell us what you are exploring and we will point you to the right path.",
    href: "/contact",
    cta: "Contact Us",
    icon: MessageCircle,
  },
] as const;

export default function RequestAQuotePage() {
  return (
    <SectionContainer className="bg-texture-dark">
      <div className="mx-auto max-w-content text-center">
        <h1 className="mb-4 font-display text-h1 font-bold uppercase tracking-tight text-white">
          Request a Quote
        </h1>
        <p className="mx-auto mb-14 max-w-2xl text-body text-gray-soft">
          Select the path that best matches your project. Each option opens a
          structured intake so we can respond with clarity — not guesswork.
        </p>
        <div className="grid gap-6 lg:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.title}
              className="flex flex-col rounded-xl border border-slate bg-navy-light/80 p-8 text-left transition-colors hover:border-blue-accent/40"
            >
              <card.icon
                className="mb-6 h-10 w-10 text-blue-accent"
                aria-hidden
              />
              <h2 className="mb-3 font-display text-xl font-semibold text-white">
                {card.title}
              </h2>
              <p className="mb-8 flex-1 text-body-sm text-gray-soft">
                {card.description}
              </p>
              <Button asChild variant="primary" width="full">
                <Link href={card.href}>{card.cta}</Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
