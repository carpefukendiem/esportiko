import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 py-16"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(59,123,248,0.08) 0%, transparent 70%), #0F1521",
      }}
    >
      <p className="font-display text-6xl font-bold text-[#3B7BF8] md:text-7xl">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-white md:text-3xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-center text-body text-[#8A94A6]">
        This page doesn&apos;t exist or was moved.
      </p>
      <Button asChild variant="primary" className="mt-10">
        <Link href="/">Back to homepage</Link>
      </Button>
    </div>
  );
}
