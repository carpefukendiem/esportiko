"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TrustChip } from "@/components/ui/TrustChip";
import { media } from "@/lib/data/media";

const wordMotion = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.45, ease: "easeOut" as const },
});

export function HeroSection() {
  const lineA = "Custom Apparel That Looks";
  const lineB = "As Good As Your Brand Plays";
  const wordsA = lineA.split(" ");
  const wordsB = lineB.split(" ");
  let idx = 0;

  return (
    <section className="relative overflow-hidden bg-texture-dark geometric-bg min-h-[600px] lg:min-h-[680px]">
      <div className="mx-auto flex max-w-content flex-col lg:flex-row lg:items-center px-6 md:px-8 lg:px-12 py-12 md:py-16 lg:py-0 lg:min-h-[680px] gap-8 lg:gap-0">
        {/* Left column — text */}
        <div className="relative z-10 w-full min-w-0 pr-2 sm:pr-4 lg:w-[52%] lg:shrink-0 lg:py-16 lg:pr-10 xl:pr-14">
          <h2 className="mb-6 font-display text-display font-bold uppercase tracking-tight text-white">
            <span className="block">
              {wordsA.map((w) => {
                const i = idx++;
                return (
                  <motion.span
                    key={`${w}-${i}`}
                    className="mr-[0.2em] inline-block"
                    {...wordMotion(i)}
                  >
                    {w}
                  </motion.span>
                );
              })}
            </span>
            <span className="mt-1 block text-blue-accent">
              {wordsB.map((w) => {
                const i = idx++;
                return (
                  <motion.span
                    key={`${w}-${i}-b`}
                    className="mr-[0.2em] inline-block"
                    {...wordMotion(i)}
                  >
                    {w}
                  </motion.span>
                );
              })}
            </span>
          </h2>
          <motion.p
            className="mb-8 max-w-xl text-body text-off-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            Esportiko makes it easy to build premium custom apparel projects —
            screen printing, embroidery, team uniforms, and branded merchandise
            for teams, businesses, schools, and events across Santa Barbara and
            the Central Coast.
          </motion.p>
          <motion.div
            className="mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.45, ease: "easeOut" }}
          >
            <Button asChild variant="primary" width="full" className="sm:w-auto">
              <Link href="/request-a-quote">Start Your Project</Link>
            </Button>
            <Button asChild variant="ghost" width="full" className="sm:w-auto">
              <Link href="/our-work">View Our Work</Link>
            </Button>
          </motion.div>
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.45 }}
          >
            <p className="font-sans text-body-sm italic text-gray-soft">
              Trusted by:
            </p>
            <div className="flex flex-wrap gap-2">
              <TrustChip>Teams</TrustChip>
              <TrustChip>Businesses</TrustChip>
              <TrustChip>Schools</TrustChip>
              <TrustChip>Events</TrustChip>
            </div>
          </motion.div>
        </div>

        {/* Right column — image, absolutely fills the right half */}
        <div className="relative w-full h-[360px] sm:h-[440px] lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-[52%] lg:h-full">
          {/* Glow */}
          <div
            className="pointer-events-none absolute inset-0 z-0 bg-blue-accent/10 blur-[80px]"
            aria-hidden
          />
          {/* Gradient fade on left edge so it blends into text column */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#0a0f1e] to-transparent lg:w-48"
            aria-hidden
          />
          <Image
            src={media.hero.apparelStack}
            alt="Custom Esportiko apparel — hoodie, jersey, and caps ready for screen printing and embroidery"
            fill
            loading="lazy"
            sizes="(max-width: 1024px) 100vw, 52vw"
            className="object-contain object-center lg:object-right lg:object-center"
          />
        </div>
      </div>
    </section>
  );
}
