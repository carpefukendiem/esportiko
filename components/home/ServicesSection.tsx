"use client";

import { motion } from "framer-motion";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { services } from "@/lib/data/services";
import { fadeInUp, homePageInView } from "@/lib/utils/motion";

export function ServicesSection() {
  return (
    <section className="bg-texture-dark border-y border-slate/60">
      <SectionContainer>
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <SectionLabel className="mb-4">WHAT WE DO</SectionLabel>
          <motion.h2
            className="font-display text-h2 font-semibold uppercase tracking-tight text-white"
            initial="hidden"
            whileInView="visible"
            viewport={homePageInView}
            variants={fadeInUp}
          >
            Built for Print. Stitched for Impact.
          </motion.h2>
        </div>
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={homePageInView}
          variants={fadeInUp}
        >
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </motion.div>
      </SectionContainer>
    </section>
  );
}
