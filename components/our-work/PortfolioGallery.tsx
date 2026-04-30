"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { workCategoryLabel, type WorkItem } from "@/lib/content/our-work";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

type TabValue = "all" | WorkItem["category"];

export function PortfolioGallery({
  items,
  categories,
}: {
  items: WorkItem[];
  categories: { slug: WorkItem["category"]; label: string }[];
}) {
  const [tab, setTab] = useState<TabValue>("all");

  const filtered = useMemo(() => {
    if (tab === "all") return items;
    return items.filter((p) => p.category === tab);
  }, [tab, items]);

  return (
    <div>
      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as TabValue)}
        className="w-full"
      >
        <div className="overflow-x-auto pb-2">
          <TabsList className="inline-flex h-auto min-h-11 w-max flex-wrap justify-start gap-1">
            <TabsTrigger value="all" className="min-h-11 px-4">
              All
            </TabsTrigger>
            {categories.map((c) => (
              <TabsTrigger key={c.slug} value={c.slug} className="min-h-11 px-4">
                {c.label}
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
              src={item.imagePath}
              alt={item.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, 33vw"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 flex items-end bg-navy/0 transition-colors duration-300 group-hover:bg-navy/70">
              <span className="w-full translate-y-full p-4 font-sans text-body-sm font-medium text-white transition-transform duration-300 group-hover:translate-y-0">
                {item.title} — {workCategoryLabel(item.category)}
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
