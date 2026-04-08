"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Upload, Shirt, ListChecks, CheckCircle2 } from "lucide-react";
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
      <div className="mx-auto flex max-w-content flex-col gap-10 px-6 pb-16 pt-10 md:px-8 md:pb-20 md:pt-14 lg:flex-row lg:items-center lg:gap-8 lg:px-12">
        <div className="w-full lg:w-[50%] lg:max-w-[50%] lg:shrink-0">
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

        <div className="relative w-full flex-1 lg:min-h-[min(560px,calc(100vh-12rem))]">
          <div
            className="pointer-events-none absolute left-[40%] top-1/2 z-0 h-[75%] w-[95%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-accent/20 blur-[100px]"
            aria-hidden
          />

          <div className="relative z-[1] mx-auto w-full lg:absolute lg:inset-0 lg:mx-0">
            <div className="relative h-[min(420px,78vw)] w-full sm:h-[min(480px,70vw)] lg:h-full lg:min-h-[520px]">
              <Image
                src={media.hero.apparelStack}
                alt="Custom Esportiko apparel — hoodie, jersey, and caps ready for screen printing and embroidery"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain object-bottom drop-shadow-[0_40px_80px_rgba(0,0,0,0.45)] sm:object-center lg:scale-[1.14] lg:object-right"
              />
            </div>
          </div>

          <motion.div
            className="relative z-[4] mx-auto mt-4 w-full max-w-md lg:absolute lg:bottom-6 lg:left-0 lg:mt-0 lg:max-w-[min(100%,340px)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: [0, -6, 0],
            }}
            transition={{
              opacity: { delay: 0.6, duration: 0.5 },
              y: {
                delay: 1.1,
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            <div className="rounded-xl border border-slate bg-navy-mid/95 p-4 shadow-2xl backdrop-blur-sm">
              <div className="relative mb-3 h-24 w-full sm:h-28">
                <Image
                  src={media.hero.uploadWidget}
                  alt=""
                  fill
                  className="object-contain object-left"
                  sizes="340px"
                />
              </div>
              <ul className="space-y-3 font-sans text-body-sm text-off-white">
                <li className="flex items-center gap-2">
                  <Upload
                    className="h-4 w-4 shrink-0 text-blue-accent"
                    aria-hidden
                  />
                  Upload Your Logo
                </li>
                <li className="flex items-center gap-2">
                  <Shirt
                    className="h-4 w-4 shrink-0 text-blue-accent"
                    aria-hidden
                  />
                  Name / Number
                </li>
                <li className="flex items-center gap-2">
                  <ListChecks
                    className="h-4 w-4 shrink-0 text-blue-accent"
                    aria-hidden
                  />
                  Rivera — 23 Players · 4 Sizes
                </li>
                <li className="flex items-center gap-2 text-gray-soft">
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-success"
                    aria-hidden
                  />
                  Quote Requested
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
