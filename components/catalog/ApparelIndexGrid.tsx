import { CategoryCard } from "@/components/catalog/CategoryCard";
import type { DisplayCategory } from "@/lib/catalog/types";

export function ApparelIndexGrid({
  categories,
}: {
  categories: DisplayCategory[];
}) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-5">
      {categories.map((c) => (
        <CategoryCard key={c.slug} category={c} />
      ))}
    </div>
  );
}
