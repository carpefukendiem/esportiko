"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Upload, Shirt, ListChecks, CheckCircle2 } from "lucide-react";
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
    <section className="relative overflow-hidden bg-texture-dark geometric-bg">
      <div className="mx-auto flex max-w-content flex-col gap-12 px-6 pb-16 pt-10 md:px-8 md:pb-20 md:pt-14 lg:flex-row lg:items-center lg:gap-8 lg:px-12">
        <div className="w-full lg:w-[55%] lg:max-w-[55%]">
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

        <div className="relative mx-auto w-full max-w-lg flex-1 lg:mx-0 lg:max-w-none">
          <div className="relative aspect-[4/5] w-full max-w-md lg:ml-auto lg:max-w-none">
            <div className="absolute left-[4%] top-[8%] z-[1] w-[48%] rotate-[-6deg]">
              <Image
                src="/images/hero/hoodie-dark.svg"
                alt="Navy custom hoodie with premium screen printing"
                width={320}
                height={400}
                className="h-auto w-full drop-shadow-2xl"
                priority
              />
            </div>
            <div className="absolute right-[6%] top-[18%] z-[2] w-[52%] rotate-[4deg]">
              <Image
                src="/images/hero/jersey-rivera.svg"
                alt="White baseball jersey with Rivera 25 custom numbering"
                width={340}
                height={420}
                className="h-auto w-full drop-shadow-2xl"
                priority
              />
            </div>
            <div className="absolute bottom-[6%] left-[22%] z-[3] w-[38%] rotate-[2deg]">
              <Image
                src="/images/hero/hat-snapback.svg"
                alt="Snapback hat with embroidered Esportiko style logo"
                width={260}
                height={220}
                className="h-auto w-full drop-shadow-2xl"
                priority
              />
            </div>
            <motion.div
              className="absolute bottom-[12%] right-[4%] z-[4] w-[min(92%,280px)] rounded-xl border border-slate bg-navy-mid/95 p-4 shadow-xl backdrop-blur-sm"
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
              <ul className="space-y-3 font-sans text-body-sm text-off-white">
                <li className="flex items-center gap-2">
                  <Upload className="h-4 w-4 shrink-0 text-blue-accent" />
                  Upload Your Logo
                </li>
                <li className="flex items-center gap-2">
                  <Shirt className="h-4 w-4 shrink-0 text-blue-accent" />
                  Name / Number
                </li>
                <li className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4 shrink-0 text-blue-accent" />
                  Rivera — 23 Players · 4 Sizes
                </li>
                <li className="flex items-center gap-2 text-gray-soft">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  Quote Requested
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
