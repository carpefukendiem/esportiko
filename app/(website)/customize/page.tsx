import { Suspense } from "react";
import { CustomizeExperience } from "@/components/customize/CustomizeExperience";
import { getCustomizeProducts } from "@/lib/customize/queries";

export const revalidate = 3600;

function CustomizeFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F1521] px-4 text-sm text-[#8A94A6]">
      Loading preview…
    </div>
  );
}

export default async function CustomizePage() {
  const products = await getCustomizeProducts();

  if (products.length === 0) {
    return (
      <section className="bg-navy py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="font-display text-h2 uppercase text-white">Customizer is loading</h1>
          <p className="mt-4 text-on-dark">
            Our product catalog is being prepared. Please check back shortly.
          </p>
        </div>
      </section>
    );
  }

  return (
    <Suspense fallback={<CustomizeFallback />}>
      <CustomizeExperience products={products} />
    </Suspense>
  );
}
