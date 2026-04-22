"use client";

import { motion } from "framer-motion";
import { Award, ClipboardList, Headphones, MapPin } from "lucide-react";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { fadeInUp, homePageInView } from "@/lib/utils/motion";

const points = [
  {
    icon: Award,
    title: "Quality Decoration",
    body: "Garments that hold up through seasons, wash cycles, and game days.",
  },
  {
    icon: ClipboardList,
    title: "Organized Ordering",
    body: "Our intake system is built for team managers, not just one-off requests.",
  },
  {
    icon: Headphones,
    title: "Responsive Support",
    body: "Real people, clear communication, no automated runaround.",
  },
  {
    icon: MapPin,
    title: "Right Fit for Your Market",
    body: "Built for teams, schools, local businesses, and events across the Central Coast.",
  },
] as const;

export function WhySection() {
  return (
    <section className="border-y border-slate/60 bg-texture-dark">
      <SectionContainer>
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <SectionLabel className="mb-4">WHY ESPORTIKO</SectionLabel>
          <motion.h2
            className="font-display text-h2 font-semibold uppercase tracking-tight text-white"
            initial="hidden"
            whileInView="visible"
            viewport={homePageInView}
            variants={fadeInUp}
          >
            Let&apos;s Build Your Next Apparel Order
          </motion.h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          {points.map((p, i) => (
            <motion.article
              key={p.title}
              className="rounded-xl border border-slate bg-navy-light/60 p-6"
              initial="hidden"
              whileInView="visible"
              viewport={homePageInView}
              variants={fadeInUp}
              transition={{ delay: i * 0.05 }}
            >
              <p.icon
                className="mb-4 h-8 w-8 text-blue-accent"
                aria-hidden
              />
              <h4 className="mb-2 font-display text-lg font-semibold text-white md:text-xl">
                {p.title}
              </h4>
              <p className="text-body-sm leading-relaxed text-gray-soft">{p.body}</p>
            </motion.article>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}
