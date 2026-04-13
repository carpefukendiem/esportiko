"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqEntry } from "@/lib/data/faq";

export function FAQAccordion({ items }: { items: FaqEntry[] }) {
  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {items.map((item, i) => (
        <AccordionItem
          key={item.question}
          value={`item-${i}`}
          className="rounded-xl border border-slate/60 bg-navy-light/90 px-4 shadow-sm"
        >
          <AccordionTrigger className="text-left font-sans text-body font-medium text-off-white hover:no-underline">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="font-sans text-body-sm text-gray-soft">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
