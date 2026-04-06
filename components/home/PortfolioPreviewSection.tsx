"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/button";
import { portfolioItems } from "@/lib/data/portfolio";
import { fadeInUp } from "@/lib/utils/motion";

const preview = portfolioItems.slice(0, 5);

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
          {preview.map((item, i) => (
            <motion.div
              key={item.id}
              className="relative aspect-[3/4] w-[min(72vw,220px)] flex-shrink-0 snap-center overflow-hidden rounded-xl border border-slate/80 bg-navy shadow-lg md:w-auto md:min-w-0 md:max-w-none"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeInUp}
              transition={{ delay: i * 0.04 }}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-300 hover:scale-[1.03]"
                sizes="(max-width: 768px) 72vw, 20vw"
                loading={i < 2 ? undefined : "lazy"}
              />
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
