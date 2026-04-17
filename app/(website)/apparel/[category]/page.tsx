import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogBreadcrumb } from "@/components/catalog/CatalogBreadcrumb";
import { CatalogCategoryShell } from "@/components/catalog/CatalogCategoryShell";
import { CatalogConversionStrip } from "@/components/catalog/CatalogConversionStrip";
import { buildMetadata } from "@/lib/seo";
import {
  getDisplayCategories,
  getDisplayCategoryBySlug,
  getProductsByDisplayCategory,
} from "@/lib/catalog/fetcher";

export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await getDisplayCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const cat = await getDisplayCategoryBySlug(categorySlug);
  if (!cat) {
    return { title: "Category | Esportiko" };
  }
  return buildMetadata({
    title: `${cat.label} | Browse Apparel`,
    description: `Browse ${cat.label.toLowerCase()} styles available for customization. Santa Barbara and Central Coast.`,
    path: `/apparel/${cat.slug}`,
  });
}

export default async function ApparelCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const category = await getDisplayCategoryBySlug(categorySlug);
  if (!category) {
    notFound();
  }

  const products = await getProductsByDisplayCategory(category.slug);

  return (
    <>
      <CatalogBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Browse Apparel", href: "/apparel" },
          { label: category.label },
        ]}
      />
      <header className="bg-navy pb-8 md:pb-10">
        <div className="mx-auto max-w-content px-6 md:px-8 lg:px-12">
          <h1 className="font-display text-h2 font-bold uppercase tracking-tight text-white">
            {category.label}
          </h1>
          <p className="mt-3 max-w-2xl text-body text-gray-soft">
            {category.description}
          </p>
          <p className="mt-2 font-sans text-body-sm text-gray-muted">
            Styles shown below. No pricing displayed — contact us to customize.
          </p>
        </div>
      </header>
      <CatalogCategoryShell
        categorySlug={category.slug}
        products={products}
      />
      <CatalogConversionStrip />
    </>
  );
}
