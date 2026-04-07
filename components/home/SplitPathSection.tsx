"use client";

import { motion } from "framer-motion";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { PathCard } from "@/components/ui/PathCard";
import { fadeInUp } from "@/lib/utils/motion";
import { media } from "@/lib/data/media";

export function SplitPathSection() {
  return (
    <section className="relative border-y border-navy/10 bg-section-white bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/white-background-img.png')" }}>
      <SectionContainer>
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
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeInUp}
          >
            <PathCard
              title="Team / Uniform Orders"
              description="Roster entry, names and numbers, size breakdowns, and organized team apparel — built for coaches, managers, and school programs."
              href="/request-a-quote?path=team"
              ctaLabel="Get a Team Quote"
              decorativeSrc={media.pathCards.team}
              decorativeAlt="Stacked custom team jerseys and uniforms"
            />
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeInUp}
          >
            <PathCard
              title="Business / Brand Orders"
              description="Logo uploads, garment selection, placement previews, and quantity-based pricing for businesses, restaurants, nonprofits, and events."
              href="/request-a-quote?path=business"
              ctaLabel="Get a Business Quote"
              decorativeSrc={media.pathCards.business}
              decorativeAlt="Branded shirt and cap for business apparel programs"
            />
          </motion.div>
        </div>
      </SectionContainer>
    </section>
  );
}
