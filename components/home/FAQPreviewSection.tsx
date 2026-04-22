"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { getHomeFaqPreview } from "@/lib/data/faq";
import { fadeInUp, homePageInView } from "@/lib/utils/motion";

export function FAQPreviewSection() {
  const items = getHomeFaqPreview();
  return (
    <section className="relative overflow-hidden border-y border-navy/10 bg-white">
      <NoiseOverlay opacity={0.03} />
      <div className="relative z-10">
        <SectionContainer>
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <SectionLabel variant="light" className="mb-4">
              QUICK ANSWERS
            </SectionLabel>
            <motion.h2
              className="font-display text-h2 font-semibold uppercase tracking-tight text-navy"
              initial="hidden"
              whileInView="visible"
              viewport={homePageInView}
              variants={fadeInUp}
            >
              Common Questions
            </motion.h2>
          </div>
          <motion.div
            className="mx-auto max-w-3xl"
            initial="hidden"
            whileInView="visible"
            viewport={homePageInView}
            variants={fadeInUp}
          >
            <FAQAccordion items={items} tone="light" />
          </motion.div>
          <motion.p
            className="mx-auto mt-8 max-w-3xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={homePageInView}
            variants={fadeInUp}
          >
            <Link
              href="/faq"
              className="font-sans text-cta font-semibold text-blue-accent hover:text-blue-light hover:underline"
            >
              View all FAQs
            </Link>
          </motion.p>
        </SectionContainer>
      </div>
    </section>
  );
}
