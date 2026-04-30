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
  tone = "dark",
}: {
  items: FaqEntry[];
  tone?: "dark" | "light";
}) {
  const light = tone === "light";
  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {items.map((item, i) => (
        <AccordionItem
          key={item.question}
          value={`item-${i}`}
          className={cn(
            "rounded-xl px-4",
            light
              ? "border border-navy/10 bg-white shadow-sm"
              : "border border-slate bg-navy-light/60"
          )}
        >
          <AccordionTrigger
            className={cn(
              "text-left font-sans text-body font-medium hover:no-underline",
              light &&
                "text-on-light-strong data-[state=open]:text-on-light-strong [&>svg]:text-on-light-muted focus-visible:ring-offset-white",
              !light && "text-off-white focus-visible:ring-offset-navy [&_svg]:text-gray-soft"
            )}
          >
            {item.question}
          </AccordionTrigger>
          <AccordionContent
            className={cn(
              "font-sans text-body-sm leading-relaxed",
              light ? "text-on-light" : "text-gray-soft"
            )}
          >
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
