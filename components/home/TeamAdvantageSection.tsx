"use client";

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
        <div className="mb-12 overflow-x-auto pb-2">
          <div className="flex min-w-[640px] items-center gap-2 md:min-w-0 md:justify-center">
            {steps.map((label, i) => (
              <div key={label} className="flex items-center">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-accent font-sans text-sm font-semibold text-white">
                    {i + 1}
                  </span>
                  <span className="whitespace-nowrap font-sans text-body-sm font-medium text-off-white">
                    {label}
                  </span>
                </div>
                {i < steps.length - 1 ? (
                  <div
                    className="mx-3 hidden h-px w-10 bg-slate sm:block md:w-14"
                    aria-hidden
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
          >
            <h2 className="mb-4 font-display text-h2 font-semibold uppercase tracking-tight text-white">
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
              <Link href="/start-team-order">Start Team Order</Link>
            </Button>
          </motion.div>
          <motion.div
            className="rounded-xl border border-slate bg-navy-mid p-3 shadow-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
          >
            <div className="overflow-hidden rounded-lg bg-navy-light">
              <div className="flex items-center gap-2 border-b border-slate px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-error/90" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/90" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/90" />
                <span className="ml-2 font-sans text-body-sm text-gray-soft">
                  team-order.esportiko
                </span>
              </div>
              <div className="grid gap-3 p-4 md:grid-cols-3">
                {["Jerseys", "Hoodies", "Hats"].map((g) => (
                  <div
                    key={g}
                    className="rounded-md border border-slate bg-navy px-2 py-3 text-center font-sans text-body-sm text-gray-soft"
                  >
                    {g}
                  </div>
                ))}
              </div>
              <div className="border-t border-slate p-4">
                <p className="mb-2 font-sans text-label font-medium uppercase tracking-wider text-gray-soft">
                  Roster preview
                </p>
                <div className="overflow-hidden rounded-md border border-slate">
                  <div className="grid grid-cols-4 gap-px bg-slate text-body-sm">
                    <div className="bg-navy-light px-2 py-2 font-medium text-off-white">
                      Player
                    </div>
                    <div className="bg-navy-light px-2 py-2 font-medium text-off-white">
                      #
                    </div>
                    <div className="bg-navy-light px-2 py-2 font-medium text-off-white">
                      Size
                    </div>
                    <div className="bg-navy-light px-2 py-2 font-medium text-off-white">
                      Qty
                    </div>
                    {[
                      ["Rivera", "25", "L", "2"],
                      ["Chen", "7", "M", "1"],
                      ["Patel", "14", "XL", "1"],
                    ].map((row, ri) =>
                      row.map((cell, ci) => (
                        <div
                          key={`${ri}-${ci}`}
                          className="bg-navy px-2 py-2 text-gray-soft"
                        >
                          {cell}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </SectionContainer>
    </section>
  );
}
