import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
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
      <div className="mb-10 rounded-xl border border-slate/80 bg-navy-mid/80 px-5 py-4 text-body-sm text-gray-soft md:px-6 md:py-5">
        <strong className="font-semibold text-off-white">
          Already approved your quote?
        </strong>{" "}
        When you are ready to send final jersey numbers, last names, sizes, and
        quantities for production, use the{" "}
        <Link
          href="/submit-team-roster"
          className="text-blue-accent underline-offset-4 hover:text-blue-light hover:underline"
        >
          roster &amp; print details form
        </Link>
        .
      </div>
      <Suspense fallback={null}>
        <TeamOrderForm />
      </Suspense>
    </SectionContainer>
  );
}
