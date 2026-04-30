import type { Metadata } from "next";
import Link from "next/link";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { TeamRosterDetailsForm } from "@/components/forms/TeamRosterDetailsForm";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Submit Team Roster",
    description:
      "After your quote is approved, send jersey numbers, last names, sizes, and quantities for your full roster. Built in Goleta — serving Santa Barbara and the Central Coast.",
    path: "/submit-team-roster",
  });
}

export default function SubmitTeamRosterPage() {
  return (
    <SectionContainer className="bg-texture-dark">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 font-sans text-label font-semibold uppercase tracking-wider text-blue-accent">
          Post-quote
        </p>
        <h1 className="mb-4 font-display text-h1 font-bold uppercase tracking-tight text-white">
          Submit roster &amp; print details
        </h1>
        <p className="mb-10 max-w-2xl text-body text-gray-soft">
          Use this form once you are ready to lock in the exact decoration for
          each piece — typically after you have accepted a quote. Add one row per
          player (or per name/number/size combo). Not there yet?{" "}
          <Link
            href="/start-team-order"
            className="text-blue-accent underline-offset-4 hover:text-blue-light hover:underline"
          >
            Start a team order
          </Link>{" "}
          or{" "}
          <Link
            href="/request-a-quote"
            className="text-blue-accent underline-offset-4 hover:text-blue-light hover:underline"
          >
            request a quote
          </Link>
          .
        </p>
        <TeamRosterDetailsForm />
      </div>
    </SectionContainer>
  );
}
