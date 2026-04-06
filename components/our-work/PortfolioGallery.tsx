"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { portfolioItems, type PortfolioCategory } from "@/lib/data/portfolio";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const filters: ("All" | PortfolioCategory)[] = [
  "All",
  "Hats",
  "Jerseys",
  "Polos",
  "Hoodies",
  "Tees",
  "Business Apparel",
  "Team Uniforms",
];

export function PortfolioGallery() {
  const [tab, setTab] = useState<string>("All");

  const filtered = useMemo(() => {
    if (tab === "All") return portfolioItems;
    return portfolioItems.filter((p) => p.category === tab);
  }, [tab]);

  return (
    <div>
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <div className="overflow-x-auto pb-2">
          <TabsList className="inline-flex h-auto min-h-11 w-max flex-wrap justify-start gap-1">
            {filters.map((f) => (
              <TabsTrigger key={f} value={f} className="min-h-11 px-4">
                {f}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <article
            key={item.id}
            className="group relative aspect-[4/5] overflow-hidden rounded-xl border border-slate bg-navy"
          >
            <Image
              src={item.image}
              alt={item.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, 33vw"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 flex items-end bg-navy/0 transition-colors duration-300 group-hover:bg-navy/70">
              <span className="w-full translate-y-full p-4 font-sans text-body-sm font-medium text-white transition-transform duration-300 group-hover:translate-y-0">
                {item.title} — {item.category}
              </span>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Button asChild variant="primary">
          <Link href="/request-a-quote">Start Your Project</Link>
        </Button>
      </div>
    </div>
  );
}
