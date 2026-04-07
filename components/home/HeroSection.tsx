"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TrustChip } from "@/components/ui/TrustChip";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-texture-dark">
      <div className="mx-auto grid max-w-content grid-cols-1 gap-10 px-6 pb-16 pt-12 md:px-8 md:pb-20 md:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-8 lg:px-12">
        {/* Left — copy */}
        <div className="relative z-10">
          <motion.h1
            className="mb-6 font-display font-extrabold tracking-tight text-white normal-case"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ fontSize: "clamp(2.25rem, 4.6vw, 3.5rem)", lineHeight: 1.08 }}
          >
            <span className="block whitespace-nowrap">Custom Apparel That Looks</span>
            <span className="mt-1 block whitespace-nowrap text-blue-light">
              As Good As Your Brand Plays
            </span>
          </motion.h1>

          <motion.p
            className="mb-8 max-w-lg text-body font-medium leading-relaxed text-off-white/85"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            Esportiko makes it easy to build premium custom apparel projects
            with visual mockups, structured team ordering, and expert quote
            support.
          </motion.p>

          <motion.div
            className="mb-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.45, ease: "easeOut" }}
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
            transition={{ delay: 0.5, duration: 0.45 }}
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

        {/* Right — apparel composition, full-bleed to the right edge */}
        <div className="relative h-[420px] w-full sm:h-[500px] lg:h-[560px]">
          {/* Soft blue glow behind the stack */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[85%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-accent/25 blur-[90px]"
            aria-hidden
          />

          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.7, ease: "easeOut" }}
          >
            <Image
              src="/images/hero-apparel-stack.png"
              alt="Custom Esportiko apparel — hoodie, jersey, and cap"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-contain object-right drop-shadow-[0_40px_80px_rgba(0,0,0,0.55)]"
            />
          </motion.div>

          {/* UI snippet overlay — left side, overlapping the apparel */}
          <motion.div
            className="absolute bottom-[12%] left-[2%] z-[5] w-[52%] max-w-[380px] sm:w-[48%] lg:left-[-6%] lg:w-[54%]"
            initial={{ opacity: 0, x: -16, y: 8 }}
            animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
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
        </div>
      </div>
    </section>
  );
}
