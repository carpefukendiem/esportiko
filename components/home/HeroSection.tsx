"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TrustChip } from "@/components/ui/TrustChip";

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
    <section className="relative overflow-hidden bg-texture-dark">
      <div className="mx-auto flex max-w-content flex-col gap-10 px-6 pb-16 pt-10 md:px-8 md:pb-20 md:pt-14 lg:flex-row lg:items-center lg:gap-12 lg:px-12">
        {/* Left — copy */}
        <div className="w-full lg:w-[48%] lg:max-w-[48%]">
          <h1 className="mb-6 font-display text-display font-extrabold leading-[1.02] tracking-tight text-white normal-case">
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
            <span className="mt-1 block text-blue-light">
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
            className="mb-8 max-w-xl text-body font-medium leading-relaxed text-off-white/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            Esportiko makes it easy to build premium custom apparel projects
            with visual mockups, structured team ordering, and expert quote
            support.
          </motion.p>

          <motion.div
            className="mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.45, ease: "easeOut" }}
          >
            <Button asChild variant="primary" width="full" className="sm:w-auto">
              <Link href="/request-a-quote">Get a Quote</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              width="full"
              className="sm:w-auto border-white bg-white text-blue-accent hover:bg-off-white hover:text-blue-accent"
            >
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

        {/* Right — composition (no white plate; full-bleed apparel stack) */}
        <div className="relative w-full flex-1 lg:-mr-12">
          <motion.div
            className="relative mx-auto aspect-[5/4] w-full max-w-none lg:mx-0 lg:h-[680px] lg:w-[120%] lg:max-w-[120%]"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.7, ease: "easeOut" }}
          >
            {/* Soft blue glow behind the apparel */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-accent/25 blur-[90px]"
              aria-hidden
            />

            {/* Apparel stack — scaled up to fill the hero like the mockup */}
            <div className="absolute inset-0">
              <Image
                src="/images/hero-apparel-stack.png"
                alt="Custom Esportiko apparel — hoodie, jersey, and cap"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-contain object-center drop-shadow-[0_40px_80px_rgba(0,0,0,0.55)]"
              />
            </div>

            {/* UI snippet overlay — larger, overlapping into the left column */}
            <motion.div
              className="absolute bottom-[10%] left-[-8%] z-[5] w-[60%] max-w-[440px] sm:w-[56%]"
              initial={{ opacity: 0, x: -20, y: 10 }}
              animate={{
                opacity: 1,
                x: 0,
                y: [0, -6, 0],
              }}
              transition={{
                opacity: { delay: 0.55, duration: 0.5 },
                x: { delay: 0.55, duration: 0.5 },
                y: {
                  delay: 1.05,
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              <Image
                src="/images/ui-hero-snippet.png"
                alt="Esportiko upload widget — Upload Your Logo, Name / Number, Quote Requested"
                width={880}
                height={680}
                priority
                className="h-auto w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
