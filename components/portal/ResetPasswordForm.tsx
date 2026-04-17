"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createBrowserClientIfConfigured,
  SUPABASE_ENV_MISSING_USER_MESSAGE,
} from "@/lib/supabase/client";
import { brandLogo } from "@/lib/data/media";
import { SupabaseConfigBanner } from "@/components/portal/SupabaseConfigBanner";

const schema = z
  .object({
    password: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Values = z.infer<typeof schema>;

type SessionState = "checking" | "ready" | "invalid" | "nocfg";

export function ResetPasswordForm() {
  const router = useRouter();
  const [sessionState, setSessionState] = useState<SessionState>("checking");

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
      setSessionState("nocfg");
      return;
    }

    let cancelled = false;

    const markReadyIfSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (data.session) {
        setSessionState("ready");
        return true;
      }
      return false;
    };

    void markReadyIfSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;
      if (
        (event === "PASSWORD_RECOVERY" || event === "INITIAL_SESSION" || event === "SIGNED_IN") &&
        session
      ) {
        setSessionState("ready");
      }
    });

    const fallbackInvalid = window.setTimeout(() => {
      if (cancelled) return;
      void (async () => {
        const ok = await markReadyIfSession();
        if (cancelled || ok) return;
        setSessionState((s) => (s === "ready" ? "ready" : "invalid"));
      })();
    }, 900);

    return () => {
      cancelled = true;
      window.clearTimeout(fallbackInvalid);
      subscription.unsubscribe();
    };
  }, []);

  const onSubmit = async (data: Values) => {
    const supabase = createBrowserClientIfConfigured();
    if (!supabase) {
      setFormError("root", { message: SUPABASE_ENV_MISSING_USER_MESSAGE });
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: data.password });
    if (error) {
      setFormError("root", { message: error.message });
      return;
    }
    router.replace("/portal/dashboard");
    router.refresh();
  };

  if (sessionState === "checking") {
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
        <p className="text-center font-sans text-sm font-medium text-[#8A94A6]">
          Verifying reset link…
        </p>
      </div>
    );
  }

  if (sessionState === "nocfg") {
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
        <Link
          href="/login"
          className="mt-6 block text-center font-sans text-sm font-semibold text-[#3B7BF8] hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  if (sessionState === "invalid") {
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
          This reset link is invalid or has expired. Request a new one below.
        </p>
        <Link
          href="/forgot-password"
          className="mt-6 block text-center font-sans text-sm font-semibold text-[#3B7BF8] hover:underline"
        >
          Forgot password?
        </Link>
        <Link
          href="/login"
          className="mt-3 block text-center font-sans text-sm font-medium text-[#8A94A6] hover:text-white"
        >
          Back to sign in
        </Link>
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

      <SupabaseConfigBanner />

      <h1 className="mb-6 text-center font-sans text-xl font-semibold text-white">
        Choose a new password
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="new-password"
            className="mb-1 block font-sans text-sm font-medium text-white"
          >
            New password
          </label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            {...register("password")}
            className="w-full rounded-lg border border-[#2A3347] bg-[#1C2333] px-3 py-2.5 font-sans text-sm font-medium text-white placeholder:text-[#8A94A6] focus:border-[#3B7BF8] focus:outline-none focus:ring-1 focus:ring-[#3B7BF8]"
          />
          {errors.password && (
            <p className="mt-1 text-sm font-medium text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="confirm-password"
            className="mb-1 block font-sans text-sm font-medium text-white"
          >
            Confirm password
          </label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword")}
            className="w-full rounded-lg border border-[#2A3347] bg-[#1C2333] px-3 py-2.5 font-sans text-sm font-medium text-white placeholder:text-[#8A94A6] focus:border-[#3B7BF8] focus:outline-none focus:ring-1 focus:ring-[#3B7BF8]"
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
        {errors.root && (
          <p className="text-center text-sm font-medium text-red-500" role="alert">
            {errors.root.message}
          </p>
        )}
        <p className="text-center font-sans text-sm font-medium text-[#8A94A6]">
          <Link href="/login" className="text-[#3B7BF8] hover:underline">
            Back to sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default ResetPasswordForm;
