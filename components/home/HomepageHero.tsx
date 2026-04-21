"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const BANNER = "/images/home/hero-banner.png";
const CARD_AYSO = "/images/home/card-ayso.png";
const CARD_DP = "/images/home/card-dp-football.png";
const CARD_SBSC = "/images/home/card-sbsc.png";

/** PR note: hero-banner.png should be optimized to ~400KB or less for LCP; current asset may be larger until final export. */
export function HomepageHero() {
  const reduceMotion = useReducedMotion();

  const bannerMotion = (delay: number) =>
    reduceMotion
      ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.65, ease: "easeOut" as const, delay },
        };

  const cardMotion = (delay: number) =>
    reduceMotion
      ? {
          initial: { opacity: 1, y: 0 },
          whileInView: { opacity: 1, y: 0 },
        }
      : {
          initial: { opacity: 0, y: 28 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-48px" },
          transition: { duration: 0.55, ease: "easeOut" as const, delay },
        };

  const cards = [
    { src: CARD_AYSO, alt: "Custom AYSO youth soccer jersey with embroidered crest", bg: "bg-navy" as const },
    {
      src: CARD_DP,
      alt: "Custom Dos Pueblos Football embroidered quarter-zip pullover",
      bg: "bg-white" as const,
    },
    { src: CARD_SBSC, alt: "Custom Santa Barbara Soccer Club jersey with team crest", bg: "bg-navy" as const },
  ];

  return (
    <section aria-label="Homepage hero" className="bg-navy">
      {/* Part 1: full-bleed banner */}
      <div className="relative w-full min-h-[500px] h-[70vh] md:h-[75vh] md:min-h-[600px] lg:h-[85vh] lg:min-h-[600px]">
        <Image
          src={BANNER}
          alt="Custom team jerseys, hats, and apparel by Esportiko"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-navy/90 via-navy/60 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-navy/80 to-transparent"
          aria-hidden
        />

        <div className="relative z-[2] mx-auto flex h-full min-h-[inherit] max-w-content flex-col justify-end px-6 pb-12 pt-28 text-center md:px-8 md:pb-16 md:pt-32 md:text-left lg:px-12 lg:pb-20">
          <motion.h1
            className="font-display text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl"
            {...bannerMotion(0)}
          >
            Custom Apparel Built for Your Team.
          </motion.h1>
          <motion.h2
            className="mx-auto mt-4 max-w-2xl font-sans text-lg text-off-white/90 md:mt-6 md:text-xl lg:mx-0 lg:text-2xl"
            {...bannerMotion(reduceMotion ? 0 : 0.1)}
          >
            Screen printing, embroidery, and team uniforms for schools, clubs, and businesses across Santa Barbara and
            the Central Coast.
          </motion.h2>
          <motion.div
            className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 md:mx-0 md:max-w-none md:flex-row md:items-center md:gap-4"
            {...bannerMotion(reduceMotion ? 0 : 0.2)}
          >
            <Button asChild variant="primary" width="full" className="md:w-auto">
              <Link href="/request-a-quote">Request a Quote</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              width="full"
              className="border-white/80 text-white hover:bg-white/10 md:w-auto"
            >
              <Link href="/team-orders">Explore Team Orders</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Part 2: apparel showcase */}
      <div className="mx-auto max-w-content px-6 py-16 md:px-8 md:py-24 lg:px-12">
        {/* Optional eyebrow — remove the following <p> block to hide */}
        <p className="mb-6 text-center font-sans text-label text-blue-accent md:text-left">
          TRUSTED BY LOCAL TEAMS
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-6 lg:gap-8">
          {cards.map((card, i) => (
            <motion.div key={card.src} {...cardMotion(reduceMotion ? 0 : i * 0.12)}>
              <Link
                href="/team-orders"
                className={cn(
                  "group relative block aspect-square overflow-hidden rounded-2xl border border-white/5 shadow-2xl shadow-black/40 ring-1 ring-white/10 transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-accent focus-visible:ring-offset-2 focus-visible:ring-offset-navy",
                  card.bg
                )}
              >
                <Image
                  src={card.src}
                  alt={card.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center brightness-[0.98] transition-[filter] duration-300 group-hover:brightness-105"
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
