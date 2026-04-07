"use client";

import { Fragment } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/button";
import { fadeInUp } from "@/lib/utils/motion";

const steps = [
  "Choose Garments",
  "Upload Your Logo",
  "Set Names & Numbers",
  "Request a Quote",
];

export function TeamAdvantageSection() {
  return (
    <section className="bg-navy bg-texture-dark">
      <SectionContainer>
        <SectionLabel className="mb-6">FOR TEAMS & COACHES</SectionLabel>
        <div className="mb-12 flex flex-wrap items-center justify-center gap-x-1 gap-y-4 px-1 sm:gap-x-0">
          {steps.map((label, i) => (
            <Fragment key={label}>
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-accent font-sans text-sm font-bold text-white shadow-md ring-2 ring-blue-light/30">
                  {i + 1}
                </span>
                <span className="whitespace-nowrap font-sans text-body-sm font-semibold text-off-white">
                  {label}
                </span>
              </div>
              {i < steps.length - 1 ? (
                <div
                  className="mx-2 hidden h-1 w-8 rounded-full bg-blue-accent/45 sm:block md:mx-3 md:w-14 lg:w-20"
                  aria-hidden
                />
              ) : null}
            </Fragment>
          ))}
        </div>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
          >
            <h2 className="mb-4 font-display text-h2 font-bold uppercase tracking-tight text-white">
              Built for Team Orders,
              <br />
              Not Just Single Items
            </h2>
            <p className="mb-8 text-body text-gray-soft">
              Most custom apparel shops treat team orders like big single orders.
              We don&apos;t. Our intake flow handles roster management, name and
              number assignments, size breakdowns, and multi-item packages — so
              coaches and managers can hand off the details without the
              back-and-forth.
            </p>
            <Button asChild variant="primary">
              <Link href="/request-a-quote?path=team">Get a Team Quote</Link>
            </Button>
          </motion.div>
          <motion.div
            className="rounded-xl border border-white/10 bg-gradient-to-br from-navy-light/90 to-navy-mid/90 p-3 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)] backdrop-blur-sm"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
          >
            <div className="overflow-hidden rounded-lg border border-white/10 bg-navy">
              <div className="flex items-center gap-2 border-b border-white/10 bg-navy-mid/80 px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-error/90" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/90" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/90" />
                <span className="ml-2 font-sans text-body-sm text-gray-soft">
                  team-order.esportiko
                </span>
              </div>
              <div className="grid grid-cols-[140px_1fr_180px] gap-4 p-5">
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-3 gap-1.5">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <span
                        key={i}
                        className={`block aspect-square rounded ${
                          i === 0
                            ? "bg-blue-light"
                            : i % 3 === 0
                            ? "bg-blue-accent/70"
                            : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="mt-2 space-y-1.5">
                    <span className="block h-1.5 w-full rounded-full bg-white/15" />
                    <span className="block h-1.5 w-3/4 rounded-full bg-white/10" />
                    <span className="block h-1.5 w-2/3 rounded-full bg-white/10" />
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative aspect-[3/4] w-full max-w-[160px] rounded-lg bg-gradient-to-br from-navy-light to-navy-mid shadow-inner">
                    <span className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-light/30 blur-2xl" />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-2xl font-bold text-white/80">
                      ✦
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2 text-[0.55rem] font-semibold uppercase tracking-wide text-gray-soft">
                    <span>Player</span>
                    <span>Size</span>
                    <span>Qty</span>
                  </div>
                  {[
                    ["Sam", "M", "1"],
                    ["Marie", "S", "1"],
                    ["Dale", "L", "1"],
                    ["Sam", "XL", "1"],
                  ].map(([n, s, q], i) => (
                    <div
                      key={i}
                      className="grid grid-cols-3 gap-2 rounded bg-white/5 px-2 py-1 text-[0.65rem] text-white/75"
                    >
                      <span>{n}</span>
                      <span>{s}</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </SectionContainer>
    </section>
  );
}
