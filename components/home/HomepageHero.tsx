"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { homePageInView } from "@/lib/utils/motion";

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
          viewport: homePageInView,
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
      {/* Part 1: full-bleed banner — overflow clips bottom ~30px; image scaled so jerseys read larger */}
      <div className="relative h-[calc(70vh-30px)] min-h-[calc(500px-30px)] w-full overflow-hidden md:h-[calc(75vh-30px)] md:min-h-[calc(600px-30px)] lg:h-[calc(85vh-30px)] lg:min-h-[calc(600px-30px)]">
        <Image
          src={BANNER}
          alt="Custom team jerseys, hats, and apparel by Esportiko"
          fill
          priority
          sizes="100vw"
          className="scale-[1.2] object-cover object-center"
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-navy/95 via-navy/75 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-navy/35 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_left_center,rgba(10,22,40,0.6)_0%,transparent_60%)]"
          aria-hidden
        />

        <div className="relative z-[2] mx-auto flex h-full min-h-[inherit] max-w-content -translate-y-[25px] flex-col justify-start px-6 pb-0 pt-[max(5.5rem,min(38vh,15rem))] text-center md:justify-center md:px-8 md:pb-0 md:pt-20 md:text-left lg:px-12 lg:pt-24">
          <motion.h1
            className="font-display text-4xl font-bold leading-tight tracking-tight text-white [text-shadow:_0_2px_20px_rgb(10_22_40_/_0.8),_0_1px_3px_rgb(0_0_0_/_0.6)] md:text-6xl lg:text-7xl"
            {...bannerMotion(0)}
          >
            Custom Apparel Built for Your Team.
          </motion.h1>
          <motion.h2
            className="mx-auto mt-4 max-w-2xl font-sans text-lg text-off-white/90 [text-shadow:_0_2px_20px_rgb(10_22_40_/_0.8),_0_1px_3px_rgb(0_0_0_/_0.6)] md:mt-6 md:text-xl lg:mx-0 lg:text-2xl"
            {...bannerMotion(reduceMotion ? 0 : 0.1)}
          >
            Screen printing, embroidery, and team uniforms for schools, clubs, and businesses across Santa Barbara and
            the Central Coast.
          </motion.h2>
          <motion.div
            className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 md:mx-0 md:max-w-none md:flex-row md:items-center md:gap-4"
            {...bannerMotion(reduceMotion ? 0 : 0.2)}
          >
            <Button asChild variant="primary" width="full" className="font-semibold text-white md:w-auto">
              <Link href="/request-a-quote">Request a Quote</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              width="full"
              className="border-0 bg-white font-semibold text-navy shadow-none transition-all duration-200 hover:bg-off-white hover:shadow-lg md:w-auto"
            >
              <Link href="/team-orders">Explore Team Orders</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Part 2: apparel showcase — ~20% wider than content max so cards read larger; 1:1 tiles */}
      <div className="mx-auto w-full max-w-[min(100%,90rem)] px-5 md:px-6 lg:px-8">
        <div className="px-1 pt-6 pb-6 md:px-2 md:pt-8 md:pb-8 lg:px-4">
          <h2 className="text-center font-display text-2xl font-semibold uppercase tracking-widest text-white md:text-3xl lg:text-4xl">
            Trusted by Local Teams & Schools
          </h2>
        </div>

        <div className="px-1 pb-16 md:px-2 md:pb-20 lg:px-4">
          <div className="grid grid-cols-1 gap-7 md:grid-cols-3 md:gap-7 lg:gap-10">
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
                    sizes="(max-width: 768px) 100vw, 38vw"
                    className="object-cover object-center brightness-[0.98] transition-[filter] duration-300 group-hover:brightness-105"
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
