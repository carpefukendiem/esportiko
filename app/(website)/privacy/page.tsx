import type { Metadata } from "next";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Privacy Policy",
    description:
      "How Esportiko handles information you submit through forms and project intake on esportikosb.com.",
    path: "/privacy",
  });
}

export default function PrivacyPage() {
  return (
    <SectionContainer className="bg-texture-dark">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 font-display text-h1 font-bold uppercase tracking-tight text-white">
          Privacy Policy
        </h1>
        <p className="text-body text-gray-soft">
          This placeholder outlines that information submitted through quote and
          contact forms is used to respond to your project and operate Esportiko
          services. A full policy should be reviewed by legal counsel before
          publication. Replace this page with your finalized policy text.
        </p>
      </div>
    </SectionContainer>
  );
}
