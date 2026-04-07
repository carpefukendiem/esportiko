"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/button";
import { fadeInUp } from "@/lib/utils/motion";

const placeholders = [
  { label: "Embroidered Cap", tone: "from-navy-light to-navy" },
  { label: "Team Jersey", tone: "from-navy to-navy-mid" },
  { label: "Custom Hoodie", tone: "from-navy-mid to-navy-light" },
  { label: "Branded Polo", tone: "from-navy-light to-navy-mid" },
  { label: "Pullover Hoodie", tone: "from-navy to-navy-light" },
];

export function PortfolioPreviewSection() {
  return (
    <section className="bg-texture-navy-mid border-y border-slate/60">
      <SectionContainer>
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <SectionLabel className="mb-4">OUR WORK</SectionLabel>
          <motion.h2
            className="font-display text-h2 font-bold uppercase tracking-tight text-white"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
          >
            Work That Earns the Second Look
          </motion.h2>
        </div>
        <div className="mb-10 flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-5 md:gap-4 md:overflow-visible md:pb-0 md:snap-none [&::-webkit-scrollbar]:hidden">
          {placeholders.map((item, i) => (
            <motion.div
              key={item.label}
              className={`group relative aspect-[3/4] w-[min(72vw,220px)] flex-shrink-0 snap-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br ${item.tone} shadow-[0_18px_40px_-15px_rgba(0,0,0,0.6)] md:w-auto md:min-w-0 md:max-w-none`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeInUp}
              transition={{ delay: i * 0.04 }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-50"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 50% 35%, rgba(37,99,235,0.25), transparent 60%)",
                }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)",
                }}
                aria-hidden
              />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <span className="block font-sans text-body-sm font-semibold text-white/85">
                  {item.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Button asChild variant="secondary">
            <Link href="/our-work">View Full Portfolio</Link>
          </Button>
        </motion.div>
      </SectionContainer>
    </section>
  );
}
