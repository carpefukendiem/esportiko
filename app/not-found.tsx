import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { sitePhone } from "@/lib/data/site";

const HERO_IMAGE = "/images/hero-apparel-stack.webp";

export default function NotFound() {
  return (
    <section className="relative min-h-[80vh] overflow-hidden bg-navy">
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        priority
        sizes="100vw"
        quality={75}
        className="object-cover object-center opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/60 to-navy" />

      <div className="relative container flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 font-display text-sm uppercase tracking-[0.2em] text-blue-light">
          404
        </p>
        <h1 className="mb-6 font-display text-h1 font-semibold uppercase tracking-tight text-white">
          This page took a wrong turn.
        </h1>
        <p className="mb-10 max-w-xl text-lg leading-relaxed text-slate-200">
          Let&apos;s get you back on track. Start a quote, see our work, or head home.
        </p>

        <div className="flex w-full max-w-2xl flex-col gap-4 sm:flex-row sm:justify-center sm:gap-3">
          <Button asChild variant="navy" width="full" className="sm:w-auto sm:min-w-[11rem]">
            <Link href="/request-a-quote">Get a Free Quote</Link>
          </Button>
          <Button asChild variant="secondary" width="full" className="sm:w-auto sm:min-w-[11rem]">
            <Link href="/our-work">See Our Work</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            width="full"
            className="text-slate-200 hover:text-white sm:w-auto"
          >
            <Link href="/">Back to Home</Link>
          </Button>
        </div>

        <p className="mt-12 text-sm text-slate-400">
          Looking for something specific? Call{" "}
          <a href={sitePhone.telHref} className="underline hover:text-white">
            (805) 335-2239
          </a>
        </p>
      </div>
    </section>
  );
}
