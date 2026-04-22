"use client";

import { motion } from "framer-motion";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { PathCard } from "@/components/ui/PathCard";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { fadeInUp, homePageInView } from "@/lib/utils/motion";
import { media } from "@/lib/data/media";

/** Warm light band: layered CSS only (replaces ~3MB PNG). */
export function SplitPathSection() {
  return (
    <section className="relative overflow-hidden border-y border-navy/10">
      <div
        className="absolute inset-0 z-0 bg-gradient-to-b from-[#f5f7fa] to-[#eef1f6]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_90%_75%_at_16%_-10%,rgba(255,255,255,0.42),transparent_55%)]"
        aria-hidden
      />
      <NoiseOverlay opacity={0.045} />
      <div className="relative z-10">
        <SectionContainer contentClassName="max-w-[min(100%,88rem)] px-4 md:px-6 lg:px-8">
          <div className="mb-10 text-center md:mb-12">
            <SectionLabel variant="light" className="mb-4">
              Get started
            </SectionLabel>
            <motion.h2
              className="font-display text-h2 font-bold uppercase tracking-tight text-navy"
              initial="hidden"
              whileInView="visible"
              viewport={homePageInView}
              variants={fadeInUp}
            >
              What Are You Ordering?
            </motion.h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8">
            <motion.div
              className="h-full"
              initial="hidden"
              whileInView="visible"
              viewport={homePageInView}
              variants={fadeInUp}
            >
              <PathCard
                title="Team / Uniform Orders"
                description="Roster entry, names and numbers, size breakdowns, and organized apparel — built for coaches, managers, and school programs."
                href="/start-team-order"
                ctaLabel="Get A Quote"
                decorativeSrc={media.pathCards.team}
                decorativeAlt="Team and uniform order — jerseys and coordinated apparel"
              />
            </motion.div>
            <motion.div
              className="h-full"
              initial="hidden"
              whileInView="visible"
              viewport={homePageInView}
              variants={fadeInUp}
            >
              <PathCard
                title="Business / Brand Orders"
                description="Logo uploads, garment selection, placement previews, and quantity-based pricing for businesses, restaurants, nonprofits, and events."
                href="/start-business-order"
                ctaLabel="Get A Quote"
                decorativeSrc={media.pathCards.business}
                decorativeAlt="Branded shirt and apparel for business programs"
              />
            </motion.div>
          </div>
        </SectionContainer>
      </div>
    </section>
  );
}
