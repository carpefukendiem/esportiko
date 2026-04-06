import type { Metadata } from "next";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { TeamOrderForm } from "@/components/forms/TeamOrderForm";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Start Team Order",
    description:
      "Submit your team or school uniform project with roster-ready intake. Esportiko serves Santa Barbara, Goleta, and the Central Coast.",
    path: "/start-team-order",
  });
}

export default function StartTeamOrderPage() {
  return (
    <SectionContainer className="bg-texture-dark">
      <TeamOrderForm />
    </SectionContainer>
  );
}
