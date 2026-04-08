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
    <section className="relative overflow-hidden bg-texture-dark geometric-bg">
      <div className="mx-auto flex max-w-content flex-col gap-10 px-6 pb-16 pt-10 md:px-8 md:pb-20 md:pt-14 lg:flex-row lg:items-start lg:gap-8 lg:px-12">
        <div className="w-full min-w-0 lg:w-[50%] lg:max-w-[50%] lg:shrink-0">
          <h1 className="mb-6 font-display text-display font-bold uppercase tracking-tight text-white">
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
          </h1>
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

        <div className="relative w-full min-w-0 flex-1 overflow-hidden lg:min-h-[min(400px,52vh)]">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[65%] w-full max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-accent/20 blur-[100px] lg:left-[55%] lg:h-[70%] lg:w-[95%]"
            aria-hidden
          />

          <div className="relative z-[1] mx-auto h-full w-full max-w-full lg:flex lg:items-center lg:justify-end">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-full sm:aspect-[5/4] lg:aspect-auto lg:h-[min(520px,58vh)] lg:max-h-[620px] lg:w-full lg:max-w-[min(100%,520px)]">
              <Image
                src={media.hero.apparelStack}
                alt="Custom Esportiko apparel — hoodie, jersey, and caps ready for screen printing and embroidery"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain object-bottom drop-shadow-[0_40px_80px_rgba(0,0,0,0.45)] sm:object-center lg:object-right"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
