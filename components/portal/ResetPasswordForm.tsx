"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createBrowserClientIfConfigured } from "@/lib/supabase/client";
import { brandLogo } from "@/lib/data/media";

const schema = z
  .object({
    password: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type Values = z.infer<typeof schema>;

type Gate = "checking" | "ready" | "invalid";

export function ResetPasswordForm() {
  const router = useRouter();
  const [gate, setGate] = useState<Gate>("checking");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    const supabase = createBrowserClientIfConfigured();
    if (!supabase) {
      setGate("invalid");
      return;
    }
    let cancelled = false;
    let settled = false;

    const timeoutId = window.setTimeout(() => {
      if (!cancelled && !settled) setGate("invalid");
    }, 6000);

    const markReady = () => {
      if (cancelled || settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      setGate("ready");
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN")) {
        markReady();
      }
    });

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) markReady();
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const onSubmit = async (data: Values) => {
    const supabase = createBrowserClientIfConfigured();
    if (!supabase) return;
    const { error } = await supabase.auth.updateUser({ password: data.password });
    if (error) {
      setFormError("root", { message: error.message });
      return;
    }
    router.replace("/portal/dashboard");
    router.refresh();
  };

  const inputClass =
    "w-full rounded-lg border border-[#2A3347] bg-[#1C2333] px-3 py-2.5 font-sans text-sm font-medium text-white placeholder:text-[#8A94A6] focus:border-[#3B7BF8] focus:outline-none focus:ring-1 focus:ring-[#3B7BF8]";

  if (gate === "checking") {
    return (
      <div className="w-full max-w-md animate-pulse rounded-xl border border-[#2A3347] bg-[#1C2333] p-8">
        <div className="mx-auto mb-8 h-10 w-32 rounded bg-[#2A3347]" />
        <div className="space-y-4">
          <div className="h-10 rounded-lg bg-[#2A3347]" />
          <div className="h-10 rounded-lg bg-[#2A3347]" />
        </div>
      </div>
    );
  }

  if (gate === "invalid") {
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
        <p className="text-center font-sans text-sm font-medium text-red-400">
          This reset link is invalid or has expired. Request a new one to
          continue.
        </p>
        <p className="mt-6 text-center font-sans text-sm font-medium text-[#8A94A6]">
          <Link href="/forgot-password" className="text-[#3B7BF8] hover:underline">
            Request a new reset link
          </Link>
        </p>
        <p className="mt-3 text-center font-sans text-sm font-medium text-[#8A94A6]">
          <Link href="/login" className="text-[#3B7BF8] hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    );
  }

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
      <h1 className="mb-6 text-center font-sans text-xl font-semibold text-white">
        Choose a new password
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root && (
          <p className="text-sm font-medium text-red-500" role="alert">
            {errors.root.message}
          </p>
        )}
        <div>
          <label
            htmlFor="password"
            className="mb-1 block font-sans text-sm font-medium text-white"
          >
            New password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register("password")}
            className={inputClass}
          />
          {errors.password && (
            <p className="mt-1 text-sm font-medium text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1 block font-sans text-sm font-medium text-white"
          >
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword")}
            className={inputClass}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm font-medium text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-[#3B7BF8] py-3 font-sans text-sm font-semibold text-white transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B7BF8] disabled:opacity-50"
        >
          Update password
        </button>
      </form>
    </div>
  );
}
