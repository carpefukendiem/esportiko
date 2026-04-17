"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createBrowserClientIfConfigured,
  SUPABASE_ENV_MISSING_USER_MESSAGE,
} from "@/lib/supabase/client";
import { getSiteUrl } from "@/lib/site-url";
import { brandLogo } from "@/lib/data/media";
import { SupabaseConfigBanner } from "@/components/portal/SupabaseConfigBanner";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type Values = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: Values) => {
    const supabase = createBrowserClientIfConfigured();
    if (!supabase) {
      setStatus("error");
      setMessage(SUPABASE_ENV_MISSING_USER_MESSAGE);
      return;
    }
    const site = getSiteUrl();
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${site}/reset-password`,
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setStatus("success");
    setMessage("Check your email for a link to reset your password.");
  };

  return (
    <div className="w-full max-w-md rounded-xl border border-[#2A3347] bg-[#1C2333] p-8">
      <div className="mb-8 flex justify-center">
        <Image
          src={brandLogo.src}
          alt="Esportiko"
          width={brandLogo.width}
          height={brandLogo.height}
          className="h-10 w-auto"
          priority
        />
      </div>

      <SupabaseConfigBanner />

      <h1 className="mb-2 text-center font-sans text-xl font-semibold text-white">
        Reset your password
      </h1>
      <p className="mb-6 text-center font-sans text-sm font-medium text-[#8A94A6]">
        Enter your email and we&apos;ll send you a link to choose a new password.
      </p>

      {status === "success" ? (
        <div className="space-y-6 text-center">
          <p className="font-sans text-sm font-medium text-emerald-400">{message}</p>
          <Link
            href="/login"
            className="inline-block font-sans text-sm font-semibold text-[#3B7BF8] hover:underline"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="forgot-email"
              className="mb-1 block font-sans text-sm font-medium text-white"
            >
              Email
            </label>
            <input
              id="forgot-email"
              type="email"
              autoComplete="email"
              {...register("email")}
              className="w-full rounded-lg border border-[#2A3347] bg-[#1C2333] px-3 py-2.5 font-sans text-sm font-medium text-white placeholder:text-[#8A94A6] focus:border-[#3B7BF8] focus:outline-none focus:ring-1 focus:ring-[#3B7BF8]"
              placeholder="you@team.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm font-medium text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[#3B7BF8] py-3 font-sans text-sm font-semibold text-white transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B7BF8] disabled:opacity-50"
          >
            Send reset link
          </button>
          {status === "error" && message && (
            <p className="text-center text-sm font-medium text-red-500" role="alert">
              {message}
            </p>
          )}
          <p className="text-center font-sans text-sm font-medium text-[#8A94A6]">
            <Link href="/login" className="text-[#3B7BF8] hover:underline">
              Back to sign in
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}

export default ForgotPasswordForm;
