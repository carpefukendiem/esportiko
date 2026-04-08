"use client";

import { motion } from "framer-motion";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { PathCard } from "@/components/ui/PathCard";
import { fadeInUp } from "@/lib/utils/motion";
import { media } from "@/lib/data/media";

export function SplitPathSection() {
  return (
    <section
      className="border-y border-navy/10 bg-[#eef1f6] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(238,241,246,0.96) 0%, rgba(244,246,250,0.98) 100%), url('/images/white-background-img.png')",
      }}
    >
      <SectionContainer contentClassName="max-w-[min(100%,88rem)] px-4 md:px-6 lg:px-8">
        <div className="mb-10 text-center md:mb-12">
          <SectionLabel variant="light" className="mb-4">
            Get started
          </SectionLabel>
          <motion.h2
            className="font-display text-h2 font-bold uppercase tracking-tight text-navy"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
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
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeInUp}
          >
            <PathCard
              title="Team / Uniform Orders"
              description="Roster entry, names and numbers, size breakdowns, and organized apparel — built for coaches, managers, and school programs."
              href="/request-a-quote?path=team"
              ctaLabel="Get A Team Quote"
              decorativeSrc={media.pathCards.team}
              decorativeAlt="Team and uniform order — jerseys and coordinated apparel"
            />
          </motion.div>
          <motion.div
            className="h-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeInUp}
          >
            <PathCard
              title="Business / Brand Orders"
              description="Logo uploads, garment selection, placement previews, and quantity-based pricing for businesses, restaurants, nonprofits, and events."
              href="/request-a-quote?path=business"
              ctaLabel="Get A Quote"
              decorativeSrc={media.pathCards.business}
              decorativeAlt="Branded shirt and apparel for business programs"
            />
          </motion.div>
        </div>
      </SectionContainer>
    </section>
  );
}
