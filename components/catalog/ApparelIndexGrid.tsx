"use client";

import { motion } from "framer-motion";
import { CategoryCard } from "@/components/catalog/CategoryCard";
import type { DisplayCategory } from "@/lib/catalog/types";
import { fadeInUp, staggerContainer } from "@/lib/utils/motion";

export function ApparelIndexGrid({
  categories,
}: {
  categories: DisplayCategory[];
}) {
  return (
    <motion.div
      className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={staggerContainer}
    >
      {categories.map((c, i) => (
        <motion.div
          key={c.slug}
          variants={fadeInUp}
          transition={{ delay: i * 0.05 }}
        >
          <CategoryCard category={c} />
        </motion.div>
      ))}
    </motion.div>
  );
}
