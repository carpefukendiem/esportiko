import Link from "next/link";

export function PortalAccountSetupFailed() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0F1521] px-4">
      <div className="max-w-md rounded-xl border border-[#2A3347] bg-[#1C2333] p-8 text-center">
        <p className="font-sans text-sm font-medium text-[#8A94A6]">
          We couldn&apos;t finish setting up your team account. Try signing out
          and back in, or contact support if this keeps happening.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block font-sans text-sm font-semibold text-[#3B7BF8] hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
