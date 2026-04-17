import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogBreadcrumb } from "@/components/catalog/CatalogBreadcrumb";
import { DecorationBadge } from "@/components/catalog/DecorationBadge";
import { ProductDetailMedia } from "@/components/catalog/ProductDetailMedia";
import { ProductCard } from "@/components/catalog/ProductCard";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import {
  getDisplayCategories,
  getDisplayCategoryBySlug,
  getProductInDisplayCategory,
  getProductsByDisplayCategory,
  getRelatedProducts,
} from "@/lib/catalog/fetcher";

export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await getDisplayCategories();
  const out: { category: string; style: string }[] = [];
  for (const c of categories) {
    const items = await getProductsByDisplayCategory(c.slug);
    for (const p of items) {
      out.push({ category: c.slug, style: p.styleNumber });
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; style: string }>;
}): Promise<Metadata> {
  const { category: catSlug, style: styleParam } = await params;
  const category = await getDisplayCategoryBySlug(catSlug);
  const product = await getProductInDisplayCategory(
    catSlug,
    decodeURIComponent(styleParam)
  );
  if (!category || !product) {
    return { title: "Style | Esportiko" };
  }
  return buildMetadata({
    title: `${product.styleNumber} — ${category.label}`,
    description: `${product.productTitle}. Custom decoration available — request a quote from Esportiko.`,
    path: `/apparel/${category.slug}/${product.styleNumber}`,
  });
}

export default async function ApparelStyleDetailPage({
  params,
}: {
  params: Promise<{ category: string; style: string }>;
}) {
  const { category: catSlug, style: styleParam } = await params;
  const styleId = decodeURIComponent(styleParam);
  const category = await getDisplayCategoryBySlug(catSlug);
  if (!category) {
    notFound();
  }

  const product = await getProductInDisplayCategory(catSlug, styleId);
  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(category.slug, product.styleNumber);

  return (
    <>
      <CatalogBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Browse Apparel", href: "/apparel" },
          { label: category.label, href: `/apparel/${category.slug}` },
          { label: product.styleNumber },
        ]}
      />
      <SectionContainer className="bg-navy border-b border-slate/60">
        <div className="grid gap-8 md:grid-cols-2 md:items-start lg:gap-12">
          <ProductDetailMedia product={product} />
          <div>
            <h1 className="font-display text-h1 font-bold uppercase tracking-tight text-white">
              {product.productTitle}
            </h1>
            <p className="mt-2 font-sans text-label font-semibold uppercase tracking-wider text-gray-soft">
              {product.brandName}
            </p>
            <p className="mt-1 font-mono text-label text-gray-muted">
              Style #{product.styleNumber}
            </p>
            <p className="mt-6 font-sans text-body-sm text-gray-soft">
              <span className="font-semibold text-off-white">
                Available sizes:{" "}
              </span>
              {product.availableSizes}
            </p>
            <p className="mt-6 text-body text-gray-soft">
              {product.productDescription}
            </p>
            <p className="mt-4 text-body-sm text-gray-muted">
              Imagery reflects SanMar&apos;s catalog feed (updated nightly). No
              live inventory or pricing on this site — share this style number
              when you start a project.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.decorationTypes.map((d) => (
                <DecorationBadge key={d} label={d} />
              ))}
            </div>
            <div className="mt-10 rounded-card border border-slate/30 bg-navy-light/50 p-6">
              <p className="font-display text-lg font-semibold text-white">
                Want this item?
              </p>
              <p className="mt-2 text-body-sm text-gray-soft">
                Tell us the style, colors, and quantity. We&apos;ll take it from
                there.
              </p>
              <Button asChild variant="primary" className="mt-6">
                <Link href="/request-a-quote">Start a Project</Link>
              </Button>
            </div>
          </div>
        </div>
      </SectionContainer>
      <SectionContainer className="bg-texture-navy-mid border-y border-slate/60">
        <h2 className="mb-8 font-display text-h2 font-bold uppercase tracking-tight text-white">
          More from this category
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {related.map((p) => (
            <ProductCard
              key={p.uniqueKey}
              product={p}
              categorySlug={category.slug}
            />
          ))}
        </div>
      </SectionContainer>
    </>
  );
}
