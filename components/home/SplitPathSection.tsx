"use client";

import { motion } from "framer-motion";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { PathCard } from "@/components/ui/PathCard";
import { fadeInUp } from "@/lib/utils/motion";

export function SplitPathSection() {
  return (
    <section className="border-y border-slate bg-texture-navy-mid">
      <SectionContainer>
        <motion.h2
          className="mb-12 text-center font-display text-h2 font-semibold uppercase tracking-tight text-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeInUp}
        >
          What Are You Ordering?
        </motion.h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeInUp}
          >
            <PathCard
              title="Team / Uniform Orders"
              description="Roster entry, names and numbers, size breakdowns, and organized apparel — built for coaches, managers, and school programs."
              href="/start-team-order"
              ctaLabel="Start Team Order"
              decorativeSrc="/images/services/team-uniforms.svg"
              decorativeAlt="Decorative team jersey graphic suggesting uniform orders"
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
              href="/start-business-order"
              ctaLabel="Start Business Order"
              decorativeSrc="/images/services/branded-apparel.svg"
              decorativeAlt="Decorative branded hat graphic suggesting business apparel"
            />
          </motion.div>
        </div>
      </SectionContainer>
    </section>
  );
}
