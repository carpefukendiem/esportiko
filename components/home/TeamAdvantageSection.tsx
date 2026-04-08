"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/button";
import { fadeInUp } from "@/lib/utils/motion";
import { media } from "@/lib/data/media";

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
              <Link href="/request-a-quote?path=team">Get A Team Quote</Link>
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
              <div className="relative aspect-video min-h-[220px] w-full bg-navy sm:min-h-[280px] md:aspect-[16/9] md:min-h-[320px] lg:min-h-[380px]">
                <Image
                  src={media.teamOrderingUi}
                  alt="Esportiko team order intake: garment selection, roster fields, and organized quote flow"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </SectionContainer>
    </section>
  );
}
