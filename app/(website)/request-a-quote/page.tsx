import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { Users, Briefcase, Check } from "lucide-react";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { buildMetadata } from "@/lib/seo";
import { media } from "@/lib/data/media";

const RequestQuoteGarmentPicker = dynamic(
  () => import("@/components/portal/RequestQuoteGarmentPicker"),
  {
    ssr: false,
    loading: () => (
      <div
        className="min-h-[280px] rounded-2xl border border-white/10 bg-navy-light/30"
        aria-hidden
      />
    ),
  }
);

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Get a Quote",
    description:
      "Two streamlined quote funnels — Team/Uniform Orders or Business/Brand Orders. Submit project details and receive a detailed quote from Esportiko.",
    path: "/request-a-quote",
  });
}

const funnels = [
  {
    id: "team",
    icon: Users,
    title: "Team / Uniform Quote",
    kicker: "For coaches, managers, and school programs",
    description:
      "Roster entry, names and numbers, size breakdowns, and organized team apparel packages.",
    bullets: [
      "Roster-aware intake",
      "Names, numbers, sizes",
      "Multi-garment packages",
      "Production timeline guidance",
    ],
    href: "/start-team-order",
    cta: "Start Team Quote",
    image: media.pathCards.team,
  },
  {
    id: "business",
    icon: Briefcase,
    title: "Business / Brand Quote",
    kicker: "For businesses, restaurants, nonprofits, events",
    description:
      "Logo uploads, garment selection, placement previews, and quantity-based pricing for branded programs.",
    bullets: [
      "Logo + art intake",
      "Garment + color selection",
      "Placement guidance",
      "Quantity-based pricing",
    ],
    href: "/start-business-order",
    cta: "Start Business Quote",
    image: media.pathCards.business,
  },
] as const;

export default function RequestAQuotePage() {
  return (
    <SectionContainer className="bg-texture-dark">
      <div className="mx-auto max-w-content">
        <h2 className="text-white font-semibold text-xl mb-6 text-center">
          What are you looking to order?
        </h2>
        <div className="mx-auto mb-14 max-w-4xl">
          <RequestQuoteGarmentPicker />
        </div>

        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <SectionLabel className="mb-4">Get A Free Quote</SectionLabel>
          <h1 className="mb-4 font-display text-h1 font-bold uppercase tracking-tight text-white">
          Pick the path that matches your project.
          </h1>
          <p className="mx-auto max-w-2xl text-body text-off-white/80">
            and we&apos;ll send back a detailed quote — no
            back-and-forth.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {funnels.map((f) => (
            <article
              key={f.id}
              id={f.id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-navy-light via-navy to-navy-mid p-8 shadow-[0_30px_70px_-20px_rgba(8,12,24,0.55)] md:p-10"
            >
              <div
                className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-accent/20 blur-3xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)",
                }}
                aria-hidden
              />

              <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center">
                <div className="flex-1">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-blue-accent/20 text-blue-light shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                    <f.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <p className="mb-2 font-sans text-body-sm font-semibold uppercase tracking-wider text-blue-light">
                    {f.kicker}
                  </p>
                  <h2 className="mb-3 font-display text-2xl font-bold tracking-tight text-white md:text-[1.7rem]">
                    {f.title}
                  </h2>
                  <p className="mb-5 max-w-md text-body text-off-white/75">
                    {f.description}
                  </p>
                  <ul className="mb-7 space-y-2">
                    {f.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-center gap-2 text-body-sm text-off-white/80"
                      >
                        <Check
                          className="h-4 w-4 text-blue-light"
                          aria-hidden
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant="primary" className="w-full sm:w-auto">
                    <Link href={f.href}>{f.cta}</Link>
                  </Button>
                </div>
                <div className="relative hidden aspect-square w-40 shrink-0 md:block lg:w-44">
                  <Image
                    src={f.image}
                    alt=""
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                    sizes="180px"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-body-sm text-off-white/60">
          Not sure which to pick?{" "}
          <Link
            href="/contact"
            className="text-blue-light underline underline-offset-4 hover:text-white"
          >
            Send us a quick message
          </Link>{" "}
          and we&rsquo;ll point you to the right path.
        </p>
      </div>
    </SectionContainer>
  );
}
