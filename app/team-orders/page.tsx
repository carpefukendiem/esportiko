import type { Metadata } from "next";
import Link from "next/link";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { CTABand } from "@/components/ui/CTABand";
import { ProcessStep } from "@/components/ui/ProcessStep";
import { Button } from "@/components/ui/button";
import { TrustChip } from "@/components/ui/TrustChip";
import { getFaqsByCategoryId } from "@/lib/data/faq";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Team Orders",
    description:
      "Organized team uniform ordering with roster intake, names and numbers, and size breakdowns for Santa Barbara and Central Coast programs.",
    path: "/team-orders",
  });
}

const faqItems = getFaqsByCategoryId("team-orders");

const personas = [
  { role: "Coach", line: "One coordinator for roster truth and deadlines." },
  { role: "Manager", line: "Structured forms instead of scattered spreadsheets." },
  { role: "Athletic Director", line: "Consistent art and vendor alignment across programs." },
  { role: "Club Organizer", line: "Multi-team logistics with repeatable packages." },
  { role: "Team Parent", line: "Clear submission path when you are driving the order." },
];

const sports = [
  "Football",
  "Baseball",
  "Softball",
  "Basketball",
  "Soccer",
  "Volleyball",
  "Wrestling",
  "Track & Field",
  "Cheer",
  "Lacrosse",
  "Hockey",
  "Rugby",
  "Swim & Dive",
  "Golf",
  "Tennis",
  "More",
];

export default function TeamOrdersPage() {
  return (
    <>
      <SectionContainer className="bg-texture-dark">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 font-display text-h1 font-bold uppercase tracking-tight text-white">
            Team Ordering, Finally Organized.
          </h1>
          <p className="mb-8 text-body text-gray-soft">
            Names, numbers, sizing, and multi-garment packages — captured once,
            confirmed clearly, produced without the usual email chains.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="primary">
              <Link href="/start-team-order">Start Your Team Order</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/request-a-quote">Request a Quote First</Link>
            </Button>
          </div>
        </div>
      </SectionContainer>
      <SectionContainer className="bg-texture-navy-mid border-y border-slate/60">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center font-display text-h2 font-semibold text-white">
            Who this is for
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {personas.map((p) => (
              <div
                key={p.role}
                className="max-w-xs rounded-xl border border-slate bg-navy-light/70 p-4 text-center"
              >
                <TrustChip className="mb-2">{p.role}</TrustChip>
                <p className="text-body-sm text-gray-soft">{p.line}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>
      <SectionContainer className="bg-texture-dark">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-h2 font-semibold text-white">
            What&apos;s included in a program
          </h2>
          <p className="mb-6 text-body text-gray-soft">
            Most team builds combine on-field and sideline pieces. We structure
            the quote so every item shares consistent decoration and timeline.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {["Jerseys", "Shorts / pants", "Hoodies", "Hats", "Warmup jackets"].map(
              (item) => (
                <div
                  key={item}
                  className="flex aspect-[4/3] items-center justify-center rounded-xl border border-slate bg-navy-light/60 font-display text-lg font-semibold text-gray-soft"
                >
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </SectionContainer>
      <SectionContainer className="bg-texture-navy-mid border-y border-slate/60">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 font-display text-h2 font-semibold text-white">
            How it works
          </h2>
          <div className="space-y-6">
            <ProcessStep
              step={1}
              title="Tell us about your team"
              description="Sport, season, approximate roster size, and in-hands timing."
            />
            <ProcessStep
              step={2}
              title="Choose your garments"
              description="Game, practice, and sideline pieces in one structured package."
            />
            <ProcessStep
              step={3}
              title="Upload your logo / artwork"
              description="Vector preferred; we advise if art needs simplification."
            />
            <ProcessStep
              step={4}
              title="Submit roster when ready"
              description="Names, numbers, sizes, and quantities — or follow up later if still finalizing."
            />
            <ProcessStep
              step={5}
              title="We handle the rest"
              description="Proofing, production scheduling, and organized delivery coordination."
            />
          </div>
        </div>
      </SectionContainer>
      <SectionContainer className="bg-texture-dark">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-h2 font-semibold text-white">
            Why programs choose Esportiko
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                t: "Organized intake",
                b: "Built for roster data — not generic contact forms.",
              },
              {
                t: "No back-and-forth loops",
                b: "Required fields up front keep email noise down.",
              },
              {
                t: "Names + numbers handled",
                b: "Assignments tracked alongside garment sizes and quantities.",
              },
              {
                t: "Flexible deadlines",
                b: "Rush when capacity allows; honest guidance when it does not.",
              },
            ].map((x) => (
              <div
                key={x.t}
                className="rounded-xl border border-slate bg-navy-light/60 p-5"
              >
                <h3 className="mb-2 font-display text-lg font-semibold text-white">
                  {x.t}
                </h3>
                <p className="text-body-sm text-gray-soft">{x.b}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>
      <SectionContainer className="bg-texture-navy-mid border-y border-slate/60">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-h2 font-semibold text-white">
            Sports we support
          </h2>
          <div className="flex flex-wrap gap-2">
            {sports.map((s) => (
              <span
                key={s}
                className="rounded-full border border-slate bg-navy-light px-3 py-1 font-sans text-body-sm text-off-white"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </SectionContainer>
      <SectionContainer className="bg-texture-dark">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-h2 font-semibold text-white">
            Team order FAQs
          </h2>
          <FAQAccordion items={faqItems} />
        </div>
      </SectionContainer>
      <CTABand
        primaryHref="/start-team-order"
        primaryLabel="Start Your Team Order"
        secondaryHref="/request-a-quote"
        secondaryLabel="Request a Quote"
      />
    </>
  );
}
