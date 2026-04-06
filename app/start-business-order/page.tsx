import type { Metadata } from "next";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { BusinessOrderForm } from "@/components/forms/BusinessOrderForm";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Start Business Order",
    description:
      "Request branded apparel, staff uniforms, or event merch. Structured intake for businesses across Santa Barbara and the Central Coast.",
    path: "/start-business-order",
  });
}

export default function StartBusinessOrderPage() {
  return (
    <SectionContainer className="bg-texture-dark">
      <BusinessOrderForm />
    </SectionContainer>
  );
}
