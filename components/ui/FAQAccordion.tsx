"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils/cn";
import type { FaqEntry } from "@/lib/data/faq";

export function FAQAccordion({
  items,
  variant = "dark",
}: {
  items: FaqEntry[];
  variant?: "dark" | "light";
}) {
  const isLight = variant === "light";
  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {items.map((item, i) => (
        <AccordionItem
          key={item.question}
          value={`item-${i}`}
          className={cn(
            "rounded-xl border px-4",
            isLight
              ? "border-navy/10 bg-white [&_button_svg]:text-navy/50"
              : "border-slate bg-navy-light/60"
          )}
        >
          <AccordionTrigger
            className={cn(
              "text-left font-sans text-body font-medium hover:no-underline",
              isLight
                ? "text-navy hover:text-blue-accent"
                : "text-off-white hover:text-blue-light"
            )}
          >
            {item.question}
          </AccordionTrigger>
          <AccordionContent
            className={cn(
              "font-sans text-body-sm",
              isLight ? "text-gray-muted" : "text-gray-soft"
            )}
          >
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
