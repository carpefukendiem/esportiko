"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useForm, type FieldPath } from "react-hook-form";
import { z } from "zod";
import { brandLogo } from "@/lib/data/media";
import { useToast } from "@/components/ui/use-toast";
import { completeOnboarding } from "@/lib/actions/completeOnboarding";
import type { AccountRow } from "@/types/portal";
import {
  HEARD_ABOUT_OPTIONS,
  LIKELY_ORDER_TYPES,
  ONBOARDING_SPORTS,
  type LikelyOrderType,
  type OnboardingSport,
} from "@/lib/portal/onboardingOptions";
import {
  onboardingStep1Schema,
  onboardingStep2Schema,
  onboardingWizardSchema,
  type OnboardingWizardValues,
} from "@/lib/schemas/onboardingWizardSchema";

const inputClass =
  "w-full rounded-lg border border-[#2A3347] bg-[#1C2333] px-3 py-2.5 font-sans text-sm font-medium text-white placeholder:text-[#8A94A6] focus:border-[#3B7BF8] focus:outline-none";

const selectClass = `${inputClass} appearance-none bg-[#1C2333]`;

const labelClass = "mb-1 block font-sans text-sm font-medium text-white";

function coerceSport(s: string | null | undefined): OnboardingSport | undefined {
  if (!s) return undefined;
  return (ONBOARDING_SPORTS as readonly string[]).includes(s)
    ? (s as OnboardingSport)
    : undefined;
}

function applyZodErrors(
  error: z.ZodError,
  setError: (name: FieldPath<OnboardingWizardValues>, e: { message: string }) => void
) {
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string") {
      setError(key as FieldPath<OnboardingWizardValues>, {
        message: issue.message,
      });
    }
  }
}

export function OnboardingWizard({ account }: { account: AccountRow }) {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<OnboardingWizardValues>({
    defaultValues: {
      team_name: account.team_name ?? "",
      contact_name: account.contact_name ?? "",
      sport: coerceSport(account.sport) ?? ("" as unknown as OnboardingSport),
      league_or_school: account.league_or_school ?? "",
      contact_phone: account.contact_phone ?? "",
      heard_about_us: "" as unknown as OnboardingWizardValues["heard_about_us"],
      likely_order_types: [],
      onboarding_notes: "",
    },
  });

  const {
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    getValues,
    formState: { errors },
  } = form;

  const selectedOrders = watch("likely_order_types") ?? [];

  const toggleOrderType = (t: LikelyOrderType) => {
    const next = selectedOrders.includes(t)
      ? selectedOrders.filter((x) => x !== t)
      : [...selectedOrders, t];
    setValue("likely_order_types", next, { shouldValidate: true });
  };

  const onContinue = () => {
    clearErrors();
    const partial = onboardingStep1Schema.safeParse(getValues());
    if (!partial.success) {
      applyZodErrors(partial.error, setError);
      return;
    }
    setStep(2);
  };

  const onBack = () => {
    clearErrors();
    setStep(1);
  };

  const onFinish = async (data: OnboardingWizardValues) => {
    clearErrors();
    const full = onboardingWizardSchema.safeParse(data);
    if (!full.success) {
      applyZodErrors(full.error, setError);
      return;
    }

    setSubmitting(true);
    const result = await completeOnboarding(full.data);
    setSubmitting(false);

    if (!result.ok) {
      toast({
        title: "Something went wrong",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    toast({
      description:
        "You're all set. Start your first order whenever you're ready.",
    });
    router.push("/portal/dashboard");
    router.refresh();
  };

  const onSubmitForm = () => {
    if (step === 1) {
      onContinue();
      return;
    }
    clearErrors();
    const data = getValues();
    const partial = onboardingStep2Schema.safeParse(data);
    if (!partial.success) {
      applyZodErrors(partial.error, setError);
      return;
    }
    void onFinish(data);
  };

  return (
    <div className="min-h-screen bg-[#0F1521] px-6 py-8 font-sans text-white md:py-12">
      <div className="mx-auto w-full max-w-[560px]">
        {step === 2 && (
          <button
            type="button"
            onClick={onBack}
            className="mb-4 font-sans text-sm font-medium text-[#8A94A6] transition-colors hover:text-white"
          >
            Back
          </button>
        )}

        <div className="rounded-xl border border-[#2A3347] bg-[#1C2333] p-6 shadow-xl md:p-8">
          <div className="mb-6 flex justify-center">
            <Image
              src={brandLogo.src}
              alt="Esportiko"
              width={brandLogo.width}
              height={brandLogo.height}
              className="h-9 w-auto md:h-10"
              priority
            />
          </div>

          <p className="mb-3 text-center font-sans text-xs font-semibold uppercase tracking-wider text-[#8A94A6]">
            Step {step} of 2
          </p>
          <div className="mb-6 flex gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#2A3347]">
              <div
                className="h-full rounded-full bg-[#3B7BF8] transition-all duration-300 ease-out"
                style={{ width: step >= 1 ? "100%" : "0%" }}
              />
            </div>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#2A3347]">
              <div
                className="h-full rounded-full bg-[#3B7BF8] transition-all duration-300 ease-out"
                style={{ width: step >= 2 ? "100%" : "0%" }}
              />
            </div>
          </div>

          <h1 className="text-center font-sans text-xl font-semibold text-white md:text-2xl">
            Set up your team account
          </h1>
          <p className="mx-auto mt-2 max-w-md text-center font-sans text-sm font-medium text-[#8A94A6]">
            This takes about 60 seconds and helps us prepare your first order
            faster.
          </p>

          <form
            className="mt-8"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmitForm();
            }}
          >
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="team_name" className={labelClass}>
                      Team name
                    </label>
                    <input
                      id="team_name"
                      className={inputClass}
                      placeholder="e.g. Westside Volleyball"
                      {...register("team_name")}
                    />
                    {errors.team_name && (
                      <p className="mt-1 text-sm font-medium text-red-400">
                        {errors.team_name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="contact_name" className={labelClass}>
                      Your name / contact name
                    </label>
                    <input
                      id="contact_name"
                      className={inputClass}
                      placeholder="Full name"
                      autoComplete="name"
                      {...register("contact_name")}
                    />
                    {errors.contact_name && (
                      <p className="mt-1 text-sm font-medium text-red-400">
                        {errors.contact_name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="sport" className={labelClass}>
                      Sport
                    </label>
                    <select
                      id="sport"
                      className={selectClass}
                      {...register("sport")}
                    >
                      <option value="" disabled>
                        Select a sport
                      </option>
                      {ONBOARDING_SPORTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {errors.sport && (
                      <p className="mt-1 text-sm font-medium text-red-400">
                        {errors.sport.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="league_or_school" className={labelClass}>
                      League or school{" "}
                      <span className="font-normal text-[#8A94A6]">(optional)</span>
                    </label>
                    <input
                      id="league_or_school"
                      className={inputClass}
                      placeholder="Conference, district, school name…"
                      {...register("league_or_school")}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact_phone" className={labelClass}>
                      Contact phone{" "}
                      <span className="font-normal text-[#8A94A6]">(optional)</span>
                    </label>
                    <input
                      id="contact_phone"
                      type="tel"
                      className={inputClass}
                      autoComplete="tel"
                      placeholder="(555) 000-0000"
                      {...register("contact_phone")}
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-2 flex h-11 w-full items-center justify-center rounded-lg bg-[#3B7BF8] font-sans text-sm font-medium text-white transition-opacity hover:opacity-90"
                  >
                    Continue
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="space-y-5"
                >
                  <div>
                    <label htmlFor="heard_about_us" className={labelClass}>
                      How did you hear about Esportiko?
                    </label>
                    <select
                      id="heard_about_us"
                      className={selectClass}
                      {...register("heard_about_us")}
                    >
                      <option value="" disabled>
                        Select one
                      </option>
                      {HEARD_ABOUT_OPTIONS.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                    {errors.heard_about_us && (
                      <p className="mt-1 text-sm font-medium text-red-400">
                        {errors.heard_about_us.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className={labelClass}>
                      What are you most likely to order?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {LIKELY_ORDER_TYPES.map((t) => {
                        const on = selectedOrders.includes(t);
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => toggleOrderType(t)}
                            className={`rounded-lg border px-3 py-2 font-sans text-xs font-medium transition-colors md:text-sm ${
                              on
                                ? "border-[#3B7BF8] bg-[#3B7BF8] text-white"
                                : "border-[#2A3347] bg-[#2A3347] text-[#8A94A6] hover:border-[#3B7BF8]/50"
                            }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                    {errors.likely_order_types && (
                      <p className="mt-1 text-sm font-medium text-red-400">
                        {errors.likely_order_types.message as string}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="onboarding_notes" className={labelClass}>
                      Anything else we should know?{" "}
                      <span className="font-normal text-[#8A94A6]">(optional)</span>
                    </label>
                    <textarea
                      id="onboarding_notes"
                      rows={4}
                      className={`${inputClass} resize-y`}
                      placeholder="Logo preferences, school colors, typical order size, etc."
                      {...register("onboarding_notes")}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 flex h-11 w-full items-center justify-center rounded-lg bg-[#3B7BF8] font-sans text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {submitting ? "Saving…" : "Finish setup"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  );
}
