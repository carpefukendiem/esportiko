import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Thank You",
    description:
      "Your request was received. The Esportiko team will follow up on your custom apparel project.",
    path: "/thank-you",
  });
}

export default function ThankYouPage() {
  return (
    <SectionContainer className="bg-texture-dark">
      <div className="mx-auto max-w-lg py-10 text-center">
        <CheckCircle
          className="mx-auto mb-6 h-16 w-16 text-blue-accent"
          aria-hidden
        />
        <h1 className="mb-4 font-display text-3xl font-semibold uppercase tracking-tight text-white md:text-4xl">
          We&apos;ve Got Your Request.
        </h1>
        <p className="mb-10 text-body text-gray-soft">
          Someone from the Esportiko team will be in touch shortly. If you have
          files to add or questions in the meantime, feel free to reach out
          directly.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="primary">
            <Link href="/">Back to Home</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </SectionContainer>
  );
}
