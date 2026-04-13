"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqEntry } from "@/lib/data/faq";
import { cn } from "@/lib/utils/cn";

export function FAQAccordion({
  items,
  variant = "default",
}: {
  items: FaqEntry[];
  /** `faqDark`: high-contrast FAQ page — white type on darker rows. */
  variant?: "default" | "faqDark";
}) {
  const dark = variant === "faqDark";

  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {items.map((item, i) => (
        <AccordionItem
          key={item.question}
          value={`item-${i}`}
          className={cn(
            "rounded-xl border px-4 shadow-sm",
            dark
              ? "border-white/15 bg-black/40"
              : "border-slate/60 bg-navy-light/90"
          )}
        >
          <AccordionTrigger
            className={cn(
              "text-left font-sans text-body font-medium hover:no-underline",
              dark
                ? "text-white hover:text-white [&>svg]:text-white/70"
                : "text-off-white"
            )}
          >
            {item.question}
          </AccordionTrigger>
          <AccordionContent
            className={cn(
              "font-sans text-body-sm",
              dark ? "text-white" : "text-gray-soft"
            )}
          >
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
