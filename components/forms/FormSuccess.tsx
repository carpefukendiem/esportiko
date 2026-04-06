"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FormSuccess({
  title = "We've Got Your Request.",
  body = "Someone from the Esportiko team will be in touch shortly. If you have files to add or questions in the meantime, feel free to reach out directly.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="mx-auto max-w-lg rounded-xl border border-slate bg-navy-mid px-8 py-12 text-center"
    >
      <CheckCircle
        className="mx-auto mb-6 h-14 w-14 text-blue-accent"
        aria-hidden
      />
      <h1 className="mb-4 font-display text-2xl font-semibold uppercase tracking-tight text-white md:text-3xl">
        {title}
      </h1>
      <p className="mb-8 text-body text-gray-soft">{body}</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild variant="primary">
          <Link href="/">Back to Home</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </motion.div>
  );
}
