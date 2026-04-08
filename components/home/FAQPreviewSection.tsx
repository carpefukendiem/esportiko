"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { getHomeFaqPreview } from "@/lib/data/faq";
import { fadeInUp } from "@/lib/utils/motion";

export function FAQPreviewSection() {
  const items = getHomeFaqPreview();
  return (
    <section className="border-y border-navy/10 bg-white">
      <SectionContainer>
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <SectionLabel variant="light" className="mb-4">
            QUICK ANSWERS
          </SectionLabel>
          <motion.h2
            className="font-display text-h2 font-semibold uppercase tracking-tight text-navy"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
          >
            Common Questions
          </motion.h2>
        </div>
        <motion.div
          className="mx-auto max-w-3xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={fadeInUp}
        >
          <FAQAccordion items={items} variant="light" />
          <p className="mt-8 text-center">
            <Link
              href="/faq"
              className="font-sans text-cta font-semibold text-blue-accent hover:text-blue-light hover:underline"
            >
              View all FAQs
            </Link>
          </p>
        </motion.div>
      </SectionContainer>
    </section>
  );
}
