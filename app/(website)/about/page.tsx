import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CTABand } from "@/components/ui/CTABand";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "About",
    description:
      "Esportiko is a local custom apparel shop in Goleta and Santa Barbara serving teams and businesses on the Central Coast.",
    path: "/about",
  });
}

const SERVICES = [
  {
    title: "Screen Printing",
    description:
      "High-quality, durable prints on tees, hoodies, and jerseys. Tight color separation and ink that holds up to actual seasons of wear.",
  },
  {
    title: "Embroidery",
    description:
      "Clean, premium stitching for polos, hats, jackets, and structured apparel. Logos that look as sharp on day one as they do at season's end.",
  },
  {
    title: "Team Uniforms",
    description:
      "Full uniform programs for clubs, schools, and leagues. Names, numbers, and rosters — handled in an organized intake, not a chaotic email thread.",
  },
  {
    title: "Spirit Wear & Fan Gear",
    description:
      "Custom apparel for booster clubs, parents, alumni, and supporters. Builds team identity beyond the field.",
  },
  {
    title: "Business & Brand Apparel",
    description:
      "Branded gear for restaurants, contractors, nonprofits, and local businesses. Looks professional, wears well, represents you the way you want.",
  },
  {
    title: "Custom Hats & Headwear",
    description:
      "Embroidered and screen-printed caps, beanies, and visors for teams and brands. Done right with proper backing and tension.",
  },
];

const DIFFERENTIATORS = [
  {
    title: "Local, Hands-On, Accountable",
    description:
      "We're not a faceless online portal. Every order goes through real people in our Santa Barbara shop, and you can reach us directly when something needs attention.",
  },
  {
    title: "Built for Team Orders",
    description:
      "Roster intake, name and number management, deadline tracking — we treat team programs as a real workflow, not a generic contact form. Less back-and-forth, fewer mistakes.",
  },
  {
    title: "Quality That Holds Up",
    description:
      "We use the right substrates, the right inks, and the right techniques for each job. Our work survives wash cycles, full seasons, and rough use — because it has to.",
  },
  {
    title: "Premium Without the Runaround",
    description:
      "Clear quotes. Clear timelines. Clear communication. We respect your time, especially when deadlines are tight or stakes are real.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ============================================================ */}
      {/* 1. CINEMATIC HERO — full-bleed, above the fold                */}
      {/* ============================================================ */}
      <section className="relative min-h-[88vh] overflow-hidden bg-navy md:min-h-[92vh]">
        <Image
          src="/images/about/expert-screenprint-techs.webp"
          alt="Esportiko's local screen printing team at work in our Santa Barbara shop"
          fill
          sizes="100vw"
          quality={85}
          priority
          className="object-cover object-center"
        />

        {/* Layered overlays for legibility */}
        <div className="absolute inset-0 bg-navy/55" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/75 to-navy/30 md:from-navy/90 md:via-navy/55 md:to-navy/10"
          aria-hidden
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy via-navy/60 to-transparent"
          aria-hidden
        />

        {/* Hero content */}
        <div className="relative flex min-h-[88vh] items-center pt-20 md:min-h-[92vh] md:pt-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="mb-5 font-display text-sm uppercase tracking-[0.2em] text-blue-light">
                Built in Santa Barbara
              </p>
              <h1 className="mb-6 font-display text-h1 font-semibold uppercase leading-[1.05] tracking-tight text-white drop-shadow-lg">
                Real craft. Real people.
                <br />
                Real Santa Barbara.
              </h1>
              <p className="mb-10 max-w-xl text-lg font-medium leading-relaxed text-white drop-shadow-lg md:text-xl">
                We&apos;re a local apparel shop built for teams, schools, and businesses who want
                their gear to look like it actually belongs to them.
              </p>
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Button asChild width="full" className="sm:w-auto">
                  <Link href="/request-a-quote">Start a Project</Link>
                </Button>
                <Button asChild variant="secondary" width="full" className="sm:w-auto">
                  <Link href="/our-work">See Our Work</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. STORY / MISSION — light section                            */}
      {/* ============================================================ */}
      <section className="relative bg-[#f5f7fa] py-20 md:py-28">
        <NoiseOverlay opacity={0.04} />
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 font-display text-sm uppercase tracking-[0.2em] text-blue-accent">
              Who We Are
            </p>
            <h2 className="mb-8 font-display text-h2 font-semibold uppercase tracking-tight text-navy">
              A local shop that takes your project seriously.
            </h2>
            <div className="space-y-6 text-lg leading-relaxed">
              <p className="text-slate-800">
                Esportiko is a Santa Barbara-based custom apparel shop serving teams, schools,
                and businesses across Goleta, Santa Barbara, and the Central Coast. We handle
                screen printing, embroidery, and full team uniform programs — start to finish,
                right here.
              </p>
              <p className="text-slate-800">
                We started Esportiko because too many local teams and businesses were stuck
                choosing between online vendors that don&apos;t really know them and order mills
                that treat every job the same. We built something different: a hands-on shop with
                real craft, real communication, and real accountability.
              </p>
              <p className="text-slate-800">
                Whether you&apos;re a coach ordering jerseys for the season or a business owner
                refreshing your branded apparel, we make the process feel organized, premium, and
                easy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. SERVICES — dark section                                    */}
      {/* ============================================================ */}
      <section className="relative bg-navy-mid py-20 md:py-28">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-4 font-display text-sm uppercase tracking-[0.2em] text-blue-light">
              What We Do
            </p>
            <h2 className="font-display text-h2 font-semibold uppercase tracking-tight text-white">
              Built for teams and businesses, end to end.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <article
                key={service.title}
                className="rounded-2xl border border-white/10 bg-navy-light/40 p-7 transition-colors hover:border-blue-light/40"
              >
                <h3 className="mb-3 font-display text-xl font-semibold uppercase tracking-tight text-white">
                  {service.title}
                </h3>
                <p className="text-base leading-relaxed text-slate-200">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. TRUST / DIFFERENTIATORS — light section                    */}
      {/* ============================================================ */}
      <section className="relative bg-white py-20 md:py-28">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-4 font-display text-sm uppercase tracking-[0.2em] text-blue-accent">
              Why Esportiko
            </p>
            <h2 className="font-display text-h2 font-semibold uppercase tracking-tight text-navy">
              The difference is in how we work.
            </h2>
          </div>

          <div className="grid gap-10 md:grid-cols-2 lg:gap-12">
            {DIFFERENTIATORS.map((item) => (
              <div key={item.title}>
                <h3 className="mb-3 font-display text-xl font-semibold uppercase tracking-tight text-navy">
                  {item.title}
                </h3>
                <p className="text-base leading-relaxed text-slate-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. FINAL CTA                                                  */}
      {/* ============================================================ */}
      <CTABand
        headline={"Let's Build Your Next Apparel Order"}
        primaryHref="/request-a-quote"
        primaryLabel="Start Your Project"
        secondaryHref="/our-work"
        secondaryLabel="See Our Work"
      />
    </>
  );
}
