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
      <div className="mx-auto flex max-w-content flex-col gap-12 px-6 pb-16 pt-10 md:px-8 md:pb-20 md:pt-14 lg:flex-row lg:items-center lg:gap-12 lg:px-12">
        <div className="w-full lg:w-[52%] lg:max-w-[52%]">
          <h1 className="mb-6 font-display text-display font-extrabold tracking-tight text-white normal-case">
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
            className="mb-8 max-w-xl text-body font-medium leading-relaxed text-off-white/95"
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

        <div className="relative w-full flex-1 lg:mx-0 lg:max-w-none">
          <div className="relative mx-auto mt-2 h-[min(400px,68vw)] w-full max-w-xl sm:h-[460px] lg:mx-0 lg:mt-0 lg:h-[min(540px,52vh)] lg:max-w-none">
            <div
              className="pointer-events-none absolute left-1/2 top-[46%] h-[78%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-blue-accent/20 blur-[64px]"
              aria-hidden
            />

            <div className="absolute left-[2%] top-[10%] z-[2] aspect-[3/4] w-[min(46%,240px)] rotate-[-7deg] shadow-[0_28px_56px_-12px_rgba(0,0,0,0.55)] sm:left-[4%] sm:w-[min(44%,280px)]">
              <Image
                src={media.portfolio.jerseyBack}
                alt="Custom team jersey with name and number decoration"
                fill
                className="rounded-xl object-cover"
                sizes="(max-width: 1024px) 46vw, 280px"
                priority
              />
            </div>

            <div className="absolute right-[4%] top-[6%] z-[1] aspect-[3/4] w-[min(40%,200px)] rotate-[6deg] shadow-[0_22px_44px_-10px_rgba(0,0,0,0.5)] sm:right-[6%] sm:w-[min(38%,220px)]">
              <Image
                src={media.portfolio.hoodieDark}
                alt="Dark hoodie with custom front branding"
                fill
                className="rounded-xl object-cover"
                sizes="(max-width: 1024px) 40vw, 220px"
                priority
              />
            </div>

            <div className="absolute bottom-[8%] right-[8%] z-[3] aspect-square w-[min(34%,150px)] rotate-[11deg] shadow-[0_18px_36px_-8px_rgba(0,0,0,0.45)] sm:bottom-[10%] sm:right-[10%] sm:w-[min(32%,168px)]">
              <Image
                src={media.portfolio.hat}
                alt="Custom embroidered baseball cap"
                fill
                className="rounded-xl object-cover"
                sizes="(max-width: 1024px) 34vw, 168px"
                priority
              />
            </div>

            <div className="absolute right-[4%] top-[22%] z-[4] hidden flex-col items-end gap-2 sm:flex">
              <span className="glass-chip">Logo uploaded</span>
              <span className="glass-chip">Roster ready</span>
            </div>
          </div>

          <motion.div
            className="glass-panel relative z-[5] mx-auto mt-6 w-full max-w-[min(100%,320px)] p-4 sm:p-5 lg:absolute lg:bottom-[2%] lg:left-0 lg:mt-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: [0, -5, 0],
            }}
            transition={{
              opacity: { delay: 0.55, duration: 0.5 },
              y: {
                delay: 1.05,
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            <div className="relative mb-3 h-24 w-full sm:h-[7.25rem]">
              <Image
                src={media.hero.uploadWidget}
                alt=""
                fill
                className="object-contain object-left drop-shadow-md"
                sizes="320px"
              />
            </div>
            <ul className="space-y-2.5 font-sans text-body-sm text-white">
              <li className="flex items-center gap-2">
                <Upload
                  className="h-4 w-4 shrink-0 text-blue-light"
                  aria-hidden
                />
                Upload Your Logo
              </li>
              <li className="flex items-center gap-2">
                <Shirt
                  className="h-4 w-4 shrink-0 text-blue-light"
                  aria-hidden
                />
                Name / Number
              </li>
              <li className="flex items-center gap-2">
                <ListChecks
                  className="h-4 w-4 shrink-0 text-blue-light"
                  aria-hidden
                />
                Rivera — 23 players · 4 sizes
              </li>
              <li className="flex items-center gap-2 text-white/75">
                <CheckCircle2
                  className="h-4 w-4 shrink-0 text-success"
                  aria-hidden
                />
                Quote requested
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
