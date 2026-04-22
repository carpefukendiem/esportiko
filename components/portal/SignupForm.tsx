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
import { getSiteUrl } from "@/lib/site-url";
import { brandLogo } from "@/lib/data/media";
import { SupabaseConfigBanner } from "@/components/portal/SupabaseConfigBanner";

const signupSchema = z
  .object({
    team_name: z.string().min(1, "Team name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const router = useRouter();
  const [nextPath, setNextPath] = useState("/portal/dashboard");
  const [oauthLoading, setOauthLoading] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const raw =
      q.get("next")?.trim() ||
      q.get("redirect")?.trim() ||
      "/portal/dashboard";
    setNextPath(raw.startsWith("/") ? raw : `/${raw}`);
  }, []);
  const [awaitingEmail, setAwaitingEmail] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      team_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onGoogle = async () => {
    setOauthLoading(true);
    const supabase = createBrowserClientIfConfigured();
    if (!supabase) {
      setOauthLoading(false);
      setFormError("root", { message: SUPABASE_ENV_MISSING_USER_MESSAGE });
      return;
    }
    const site = getSiteUrl();
    const safeNext = nextPath.startsWith("/") ? nextPath : `/${nextPath}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${site}/auth/callback?next=${encodeURIComponent(safeNext)}`,
      },
    });
    setOauthLoading(false);
    if (error) {
      setFormError("root", { message: error.message });
    }
  };

  const onSubmit = async (data: SignupValues) => {
    const supabase = createBrowserClientIfConfigured();
    if (!supabase) {
      setFormError("root", { message: SUPABASE_ENV_MISSING_USER_MESSAGE });
      return;
    }

    const site = getSiteUrl();
    const safeNext = nextPath.startsWith("/") ? nextPath : `/${nextPath}`;

    const { data: signData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${site}/auth/callback?next=${encodeURIComponent(safeNext)}`,
        data: { team_name: data.team_name },
      },
    });

    if (error) {
      setFormError("root", { message: error.message });
      return;
    }

    if (signData.session && signData.user) {
      const { error: insertErr } = await supabase.from("accounts").insert({
        user_id: signData.user.id,
        team_name: data.team_name,
        contact_email: data.email,
      });
      if (insertErr && !isDuplicateAccountError(insertErr)) {
        console.error("signup accounts insert", insertErr);
      }
      router.push(safeNext);
      router.refresh();
      return;
    }

    setAwaitingEmail(true);
  };

  if (awaitingEmail) {
    return (
      <div className="w-full max-w-md rounded-xl border border-[#2A3347] bg-[#1C2333] p-8 text-center">
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
        <p className="font-sans text-sm font-medium text-[#B8D4FF]">
          Check your email to confirm your account
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block font-sans text-sm font-semibold text-[#3B7BF8] hover:underline"
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

      <button
        type="button"
        onClick={() => void onGoogle()}
        disabled={oauthLoading || isSubmitting}
        className="mb-6 flex w-full items-center justify-center gap-2 rounded-lg border border-[#2A3347] bg-[#1C2333] py-3 font-sans text-sm font-medium text-white transition-colors hover:bg-[#2A3347] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B7BF8] disabled:opacity-50"
      >
        <GoogleGlyph />
        Continue with Google
      </button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#2A3347]" />
        </div>
        <div className="relative flex justify-center font-sans text-xs font-medium uppercase tracking-wider text-[#8A94A6]">
          <span className="bg-[#1C2333] px-3">or email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root && (
          <p className="text-sm font-medium text-red-500" role="alert">
            {errors.root.message}
          </p>
        )}
        <div>
          <label
            htmlFor="signup-team"
            className="mb-1 block font-sans text-sm font-medium text-white"
          >
            Team name
          </label>
          <input
            id="signup-team"
            type="text"
            autoComplete="organization"
            {...register("team_name")}
            className="w-full rounded-lg border border-[#2A3347] bg-[#1C2333] px-3 py-2.5 font-sans text-sm font-medium text-white placeholder:text-[#8A94A6] focus:border-[#3B7BF8] focus:outline-none focus:ring-1 focus:ring-[#3B7BF8]"
            placeholder="Your team or school"
          />
          {errors.team_name && (
            <p className="mt-1 text-sm font-medium text-red-500">
              {errors.team_name.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="signup-email"
            className="mb-1 block font-sans text-sm font-medium text-white"
          >
            Email
          </label>
          <input
            id="signup-email"
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
        <div>
          <label
            htmlFor="signup-password"
            className="mb-1 block font-sans text-sm font-medium text-white"
          >
            Password
          </label>
          <input
            id="signup-password"
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
            htmlFor="signup-confirm"
            className="mb-1 block font-sans text-sm font-medium text-white"
          >
            Confirm password
          </label>
          <input
            id="signup-confirm"
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
          disabled={isSubmitting || oauthLoading}
          className="w-full rounded-lg bg-[#3B7BF8] py-3 font-sans text-sm font-semibold text-white transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B7BF8] disabled:opacity-50"
        >
          Create account
        </button>
      </form>

      <p className="mt-6 text-center font-sans text-sm font-medium text-[#8A94A6]">
        Already have an account?{" "}
        <Link href="/login" className="text-[#3B7BF8] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

function isDuplicateAccountError(error: { code?: string; message?: string }): boolean {
  return (
    error.code === "23505" ||
    (typeof error.message === "string" &&
      error.message.toLowerCase().includes("duplicate"))
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default SignupForm;
